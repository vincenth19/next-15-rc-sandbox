"use client";

import { ReactNode, SetStateAction, Dispatch } from "react";
import { Person } from "@prisma/client";
import { personFormSchema } from "@/schemas/person";
import GenericDialogForm from "@/components/generic-dialog-form";
import { useGenericForm } from "@/hooks/useGenericForm";
import { createPerson, updatePerson } from "@/actions/people";

export default function EditPersonForm({
  isOpen = false,
  setIsOpen,
  trigger = <></>,
  person,
}: {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
  person: Person;
}) {
  const { form, onSubmit, isLoading } = useGenericForm({
    baseData: person,
    setIsOpen: setIsOpen,
    schema: personFormSchema,
    serverAction: person ? updatePerson : createPerson,
    defaultValues: {
      id: person.id,
      user_id: person.user_id,
      first_name: person.first_name,
      last_name: person.last_name,
      phone_number: person.phone_number,
      date_of_birth: person.date_of_birth,
    },
    successToastConfig: {
      title: "Edit Person Successful",
      description: "New person is successfully edited.",
    },
    errorToastConfig: {
      title: "Edit Person Error",
      description: "There is an issue when editing person.",
    },
  });

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
