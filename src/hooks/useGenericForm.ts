import { FormEvent, useActionState, useEffect } from "react";
import { z, ZodType } from "zod";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { ActionState } from "@/lib/types/actionState";

type ToastConfig = {
  title: string;
  description: string;
};
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
  successToastConfig: ToastConfig;
  errorToastConfig: ToastConfig;
  defaultValues?: DefaultValues<T>;
}) {
  const { toast } = useToast();
  const [actionState, _serverAction, isLoading] = useActionState(
    serverAction,
    null
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.handleSubmit((data) => {
      _serverAction({ formData: data });
    })(event);
  }

  useEffect(() => {
    form.reset(baseData);
  }, [baseData]);

  useEffect(() => {
    if (actionState?.success) {
      toast(successToastConfig);
      setIsOpen(false);
      if (!baseData) form.reset();
    } else if (actionState?.error) {
      toast({
        title: errorToastConfig.title,
        description: `${errorToastConfig.description} ${actionState.error}`,
        variant: "destructive",
      });
      console.error("useGenericForm: ", actionState.error);
    }
  }, [actionState]);

  return { form, onSubmit, isLoading };
}
