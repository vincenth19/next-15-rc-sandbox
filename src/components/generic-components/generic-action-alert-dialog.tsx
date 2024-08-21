"use client";
import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { ActionState } from "@/lib/types/actionState";
import { useGenericActionAlertDialog } from "@/hooks/useGenericActionAlertDialog";
import { ToastConfig } from "@/lib/types/ui";

export default function GenericActionAlertDialog<T>({
  isOpen,
  setIsOpen,
  confirmAction,
  actionPayload,
  title,
  description,
  btnConfirmLabel = {
    default: "Confirm",
    loading: "Confirming...",
  },
  btnConfirmProps,
  successToastConfig,
  errorToastConfig,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  confirmAction: (
    state: ActionState | null,
    payload: T
  ) => Promise<ActionState>;
  actionPayload: T;
  dataLabel?: string;
  title: string;
  description: string;
  btnConfirmLabel: {
    default: string;
    loading: string;
  };
  btnConfirmProps?: ButtonProps;
  successToastConfig?: ToastConfig;
  errorToastConfig?: ToastConfig;
}) {
  const { action, isPending } = useGenericActionAlertDialog({
    setIsOpen: setIsOpen,
    serverAction: confirmAction,
    successToastConfig,
    errorToastConfig,
  });
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <VisuallyHidden.Root>
          <AlertDialogDescription>Delete person dialog</AlertDialogDescription>
        </VisuallyHidden.Root>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="w-full flex flex-col sm:flex-row space-2 justify-between">
            <Button
              disabled={isPending}
              onClick={() => {
                action(actionPayload);
              }}
              {...btnConfirmProps}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? btnConfirmLabel.loading : btnConfirmLabel.default}
            </Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
