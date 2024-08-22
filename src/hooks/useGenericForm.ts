import {
  FormEvent,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { z, ZodType } from "zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ActionState } from "@/lib/types/actionState";
import { ToastConfig } from "@/lib/types/ui";

export function useGenericForm<T extends FieldValues>({
  baseData,
  setIsOpen,
  schema,
  serverAction,
  successToastConfig,
  errorToastConfig,
  defaultValues,
}: {
  baseData: T | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  schema: ZodType<any, any, any>;
  serverAction: (
    state: ActionState | null,
    payload: any
  ) => Promise<ActionState>;
  successToastConfig?: ToastConfig;
  errorToastConfig?: ToastConfig;
  defaultValues?: DefaultValues<T>;
}) {
  const { toast } = useToast();
  const [actionState, _serverAction, isLoading] = useActionState(
    serverAction,
    null
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: baseData || defaultValues,
  });

  const prevActionStateRef = useRef<ActionState | null>(null);

  const handleActionStateChange = useCallback(() => {
    if (actionState?.success && actionState !== prevActionStateRef.current) {
      successToastConfig && toast(successToastConfig);
      setIsOpen(false);
      if (!baseData) form.reset();
    } else if (
      actionState?.success === false &&
      actionState?.error &&
      actionState !== prevActionStateRef.current
    ) {
      errorToastConfig &&
        toast({
          title: errorToastConfig?.title,
          description: `${errorToastConfig?.description} ${actionState.error}`,
          variant: "destructive",
        });
      console.error("useGenericForm: ", actionState.error);
    }
    prevActionStateRef.current = actionState;
  }, [
    actionState,
    successToastConfig,
    errorToastConfig,
    setIsOpen,
    baseData,
    form,
    toast,
  ]);

  useEffect(() => {
    handleActionStateChange();
  }, [handleActionStateChange]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      form.handleSubmit((data) => {
        _serverAction({ formData: data });
      })(event);
    },
    [form, _serverAction]
  );

  return { form, onSubmit, isLoading };
}
