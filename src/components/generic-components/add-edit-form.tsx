"use client";

import { ReactNode, SetStateAction, Dispatch } from "react";
import { z } from "zod";
import GenericDialogForm, {
  FieldOptions,
} from "@/components/generic-components/generic-dialog-form";
import { useGenericForm } from "@/hooks/useGenericForm";
import { ActionState } from "@/lib/types/actionState";
import { FieldValues } from "react-hook-form";

export default function AddEditForm<T extends z.ZodObject<any, any>>({
  titleSuffix = "",
  isOpen = false,
  setIsOpen,
  trigger = <></>,
  data = null,
  schema,
  fieldOptions = {},
  defaultValues,
  addAction,
  editAction,
}: {
  titleSuffix?: string;
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
  data?: z.infer<T> | null;
  schema: T;
  defaultValues: FieldValues;
  fieldOptions?: Partial<Record<keyof z.infer<T>, FieldOptions>>;
  addAction: (state: ActionState | null, payload: any) => Promise<ActionState>;
  editAction: (state: ActionState | null, payload: any) => Promise<ActionState>;
}) {
  const { form, onSubmit, isLoading } = useGenericForm({
    baseData: data,
    setIsOpen: setIsOpen,
    schema: schema,
    serverAction: data ? editAction : addAction,
    defaultValues: { ...defaultValues },
    successToastConfig: {
      title: `${data ? "Edit" : "Add"} Successful`,
      description: `Data is successfully ${data ? "edited" : "added"}.`,
    },
    errorToastConfig: {
      title: `Edit Error`,
      description: `There is an issue when ${data ? "editing" : "adding"}.`,
    },
  });

  return (
    <>
      <GenericDialogForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`${data ? "Edit" : "Add"} ${titleSuffix}`}
        trigger={trigger}
        schema={schema}
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        fieldOptions={fieldOptions}
        btnActionLabel={data ? "Confirm Edit" : "Add"}
      />
    </>
  );
}
