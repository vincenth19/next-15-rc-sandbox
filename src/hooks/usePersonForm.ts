import { FormEvent, useActionState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Person } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPerson, updatePerson } from "@/actions/people";
import { personFormSchema } from "@/schemas/person";
import { useToast } from "@/components/ui/use-toast";

export const usePersonForm = (
  person: Person | null,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const [createPersonActionState, createPersonAction, createPersonPending] =
    useActionState(createPerson, null);
  const [updatePersonActionState, updatePersonAction, updatePersonPending] =
    useActionState(updatePerson, null);

  const form = useForm<z.infer<typeof personFormSchema>>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      user_id: person?.user_id ?? "1",
      first_name: person?.first_name ?? "",
      last_name: person?.last_name ?? "",
      phone_number: person?.phone_number ?? "",
      date_of_birth: person?.date_of_birth ?? new Date(),
    },
  });

  const isLoading = createPersonPending || updatePersonPending;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    form.handleSubmit((data) => {
      person
        ? updatePersonAction({
            formData: data,
            personId: person.id,
          })
        : createPersonAction({ formData: data });
    })(event);
  }

  useEffect(() => {
    form.reset({
      user_id: person?.user_id ?? "1",
      first_name: person?.first_name ?? "",
      last_name: person?.last_name ?? "",
      phone_number: person?.phone_number ?? "",
      date_of_birth: person?.date_of_birth ?? new Date(),
    });
  }, [person]);

  useEffect(() => {
    if (createPersonActionState?.success || updatePersonActionState?.success) {
      toast({
        title: `${person ? "Edit" : "Add"} Person Successful`,
        description: `Person successfully ${person ? "edited" : "added"}`,
      });
      setIsOpen(false);
      if (!person) form.reset();
    } else if (
      createPersonActionState?.error ||
      updatePersonActionState?.error
    ) {
      toast({
        title: `${person ? "Edit" : "Add"} Person Error`,
        description: `Failed to ${person ? "edit" : "add"} person: ${
          createPersonActionState?.error || updatePersonActionState?.error
        }`,
        variant: "destructive",
      });
    }
  }, [createPersonActionState, updatePersonActionState]);

  return { form, onSubmit, isLoading };
};
