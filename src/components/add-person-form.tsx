"use client";

import { ReactNode, SetStateAction, Dispatch } from "react";
import { personFormSchema } from "@/schemas/person";
import GenericDialogForm from "@/components/generic-dialog-form";
import { useGenericForm } from "@/hooks/useGenericForm";
import { createPerson } from "@/actions/people";

export default function AddPersonForm({
  isOpen = false,
  setIsOpen,
  trigger = <></>,
}: {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
}) {
  const { form, onSubmit, isLoading } = useGenericForm({
    baseData: null,
    setIsOpen: setIsOpen,
    schema: personFormSchema,
    serverAction: createPerson,
    defaultValues: {
      user_id: "1",
      first_name: "",
      last_name: "",
      phone_number: "",
      date_of_birth: new Date(),
    },
    successToastConfig: {
      title: `Add Person Successful`,
      description: "Person is successfully added",
    },
    errorToastConfig: {
      title: "Add Person Error",
      description: "There is an issue when adding person.",
    },
  });

  return (
    <>
      <GenericDialogForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"Add Person"}
        trigger={trigger}
        schema={personFormSchema}
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        fieldOptions={{
          id: {
            visible: false,
          },
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
