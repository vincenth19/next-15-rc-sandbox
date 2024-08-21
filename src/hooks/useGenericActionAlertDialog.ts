import { useToast } from "@/components/ui/use-toast";
import { ActionState } from "@/lib/types/actionState";
import { ToastConfig } from "@/lib/types/ui";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";

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

  useEffect(() => {
    if (actionState?.success) {
      successToastConfig && toast(successToastConfig);
      setIsOpen(false);
    } else if (actionState?.success === true && actionState?.error) {
      errorToastConfig &&
        toast({
          title: errorToastConfig?.title,
          description: `${errorToastConfig?.description} ${actionState.error}`,
          variant: "destructive",
        });
      console.error("useGenericForm: ", actionState.error);
    }
  }, [actionState]);

  return { actionState, action, isPending };
}
