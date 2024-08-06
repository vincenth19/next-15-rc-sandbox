"use client";

import { useState, useActionState, useEffect } from "react";
import { Person } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPerson, updatePerson } from "@/actions/people";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputDatePicker } from "@/components/ui/c-input-datepicker";
import { useToast } from "@/components/ui/use-toast";
import { personFormSchema } from "@/schemas/person";

const PersonDialogForm = ({ person = null }: { person?: Person | null }) => {
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      date_of_birth: person?.date_of_birth
        ? person.date_of_birth.toISOString()
        : new Date().toISOString(),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (person && person.id) {
      updatePersonAction({
        formData: data,
        personId: person.id,
      });
    } else {
      createPersonAction(data);
    }
  });

  useEffect(() => {
    if (createPersonActionState?.success === true) {
      toast({
        title: "Add Person Successful",
        description: "New person is successfully added",
      });
      setIsDialogOpen(false);
      form.reset();
    } else if (
      createPersonActionState?.success === false &&
      createPersonActionState?.error
    ) {
      toast({
        title: "Add Person Error",
        description: `Failed to add person: ${createPersonActionState.error}`,
        variant: "destructive",
      });
    }

    if (updatePersonActionState?.success === true) {
      toast({
        title: "Edit Person Successful",
        description: "The person is successfully edited",
      });
      setIsDialogOpen(false);
      form.reset();
    } else if (
      updatePersonActionState?.success === false &&
      updatePersonActionState?.error
    ) {
      toast({
        title: "Edit Person Error",
        description: `Failed to edit person: ${updatePersonActionState.error}`,
        variant: "destructive",
      });
    }
  }, [toast, form, createPersonActionState, updatePersonActionState]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {person ? <Button>Edit</Button> : <Button>Add Person</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{person ? "Edit" : "Add"} Person</DialogTitle>
          <div className="my-8"></div>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0412354678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex flex-col gap-3">
                        <FormLabel>Date of Birth</FormLabel>
                        <InputDatePicker
                          placeholder="Date of birth"
                          value={field.value}
                          onchange={(value: Date) => {
                            const isoString = new Date(
                              value.getTime() -
                                value.getTimezoneOffset() * 60000
                            ).toISOString();

                            field.onChange(isoString);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  );
                }}
              />
              <Button
                type="submit"
                aria-disabled={createPersonPending || updatePersonPending}
              >
                {createPersonPending || updatePersonPending
                  ? "Submitting..."
                  : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default PersonDialogForm;
