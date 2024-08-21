"use client";
import { Dispatch, SetStateAction } from "react";
import { ActionState } from "@/lib/types/actionState";
import GenericActionAlertDialog from "./generic-action-alert-dialog";
import { ToastConfig } from "@/lib/types/ui";

export default function DeleteAlertDialog<T>({
  isOpen,
  setIsOpen,
  dataLabel = "data",
  deleteAction,
  deleteActionPayload,
  successToastConfig = {
    title: "Delete Successful",
    description: "Data is successfully deleted",
  },
  errorToastConfig = {
    title: "Delete Error",
    description: `There is an issue when deleting data.`,
  },
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deleteActionPayload: T;
  deleteAction: (state: ActionState | null, payload: T) => Promise<ActionState>;
  dataLabel?: string;
  successToastConfig?: ToastConfig;
  errorToastConfig?: ToastConfig;
}) {
  return (
    <>
      <GenericActionAlertDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Delete ${dataLabel}?`}
        description={`This action cannot be undone. This will permanently delete ${dataLabel} and remove this data from our servers.`}
        btnConfirmLabel={"Delete"}
        confirmAction={deleteAction}
        actionPayload={deleteActionPayload}
        btnConfirmProps={{ variant: "destructive" }}
        successToastConfig={successToastConfig}
        errorToastConfig={errorToastConfig}
      />
    </>
  );
}
