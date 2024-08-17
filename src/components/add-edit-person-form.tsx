"use client";

import { ReactNode, SetStateAction, Dispatch } from "react";
import { Person } from "@prisma/client";
import { usePersonForm } from "@/hooks/usePersonForm";
import { personFormSchema } from "@/schemas/person";
import GenericDialogForm from "@/components/generic-dialog-form";

export default function AddEditPersonForm({
  isOpen = false,
  setIsOpen,
  trigger = <></>,
  person = null,
}: {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
  person?: Person | null;
}) {
  const { form, onSubmit, isLoading } = usePersonForm(person, setIsOpen);

  return (
    <>
      <GenericDialogForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`${person ? "Edit" : "Add"} Person`}
        trigger={trigger}
        schema={personFormSchema}
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        fieldOptions={{
          user_id: {
            visible: false,
          },
          phone_number: {
            placeholder: "0423456789",
          },
        }}
      />
    </>
  );
}
