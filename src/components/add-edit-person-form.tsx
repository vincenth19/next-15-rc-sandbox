"use client";

import { ReactNode, SetStateAction, Dispatch } from "react";
import { Person } from "@prisma/client";
import { personFormSchema } from "@/schemas/person";
import GenericDialogForm from "@/components/generic-dialog-form";
import { useGenericForm } from "@/hooks/useGenericForm";
import { createPerson, updatePerson } from "@/actions/people";

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
  const { form, onSubmit, isLoading } = useGenericForm({
    baseData: person,
    setIsOpen: setIsOpen,
    schema: personFormSchema,
    serverAction: person ? updatePerson : createPerson,
    defaultValues: {
      id: person?.id ?? undefined,
      user_id: person?.user_id ?? "",
      first_name: person?.first_name ?? "",
      last_name: person?.last_name ?? "",
      phone_number: person?.phone_number ?? "",
      date_of_birth: person?.date_of_birth ?? new Date(),
    },
    successToastConfig: {
      title: `${person ? "Edit" : "Add"} Person Successful`,
      description: `${person ? "Person" : "New person"} is successfully ${
        person ? "edited" : "added"
      }.`,
    },
    errorToastConfig: {
      title: `${person ? "Edit" : "Add"} Person Error`,
      description: `There is an issue when ${
        person ? "editing" : "adding"
      } person.`,
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
