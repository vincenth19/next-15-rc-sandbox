import { useToast } from "@/components/ui/use-toast";
import { ActionState } from "@/lib/types/actionState";
import { ToastConfig } from "@/lib/types/ui";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export function useGenericActionAlertDialog({
  setIsOpen,
  serverAction,
  successToastConfig,
  errorToastConfig,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  serverAction: (
    state: ActionState | null,
    payload: any
  ) => Promise<ActionState>;
  successToastConfig?: ToastConfig;
  errorToastConfig?: ToastConfig;
}) {
  const { toast } = useToast();
  const [actionState, action, isPending] = useActionState(serverAction, null);
  const prevActionStateRef = useRef<ActionState | null>(null);

  const handleActionStateChange = useCallback(() => {
    if (actionState?.success && actionState !== prevActionStateRef.current) {
      successToastConfig && toast(successToastConfig);
      setIsOpen(false);
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
      console.error("useGenericActionAlertDialog: ", actionState.error);
    }
    prevActionStateRef.current = actionState;
  }, [actionState, successToastConfig, errorToastConfig, setIsOpen, toast]);

  useEffect(() => {
    handleActionStateChange();
  }, [handleActionStateChange]);

  return { actionState, action, isPending };
}
