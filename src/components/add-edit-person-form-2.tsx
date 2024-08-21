import { Dispatch, ReactNode, SetStateAction } from "react";
import { z } from "zod";
import { Person } from "@prisma/client";
import { personFormSchema } from "@/schemas/person";
import { createPerson, updatePerson } from "@/actions/people";
import AddEditForm from "@/components/add-edit-form";

export default function AddEditPersonForm2({
  isOpen = false,
  setIsOpen,
  person = null,
  trigger = <></>,
}: {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  person?: Person | null;
  trigger?: ReactNode;
}) {
  // convert prisma person data type to zod person schema
  const formData: z.infer<typeof personFormSchema> | null = {
    id: person?.id ?? undefined,
    user_id: person?.user_id ?? "1",
    first_name: person?.first_name ?? "",
    last_name: person?.last_name ?? "",
    phone_number: person?.phone_number ?? "",
    date_of_birth: person?.date_of_birth ?? new Date(),
  };

  return (
    <>
      <AddEditForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        schema={personFormSchema}
        addAction={createPerson}
        editAction={updatePerson}
        data={person ? formData : null}
        trigger={trigger}
        defaultValues={formData}
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
