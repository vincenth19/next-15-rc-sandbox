"use client";

import { useState, useActionState, useEffect, FormEvent } from "react";
import { Person } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LucideEdit } from "lucide-react";

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

export default function PersonDialogForm({
  person = null,
}: {
  person?: Person | null;
}) {
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
    if (createPersonActionState?.success === true) {
      toast({
        title: "Add Person Successful",
        description: "New person is successfully added",
      });
      form.reset({
        user_id: "1",
        first_name: "",
        last_name: "",
        phone_number: "",
        date_of_birth: new Date().toISOString(),
      });
      setIsDialogOpen(false);
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
        <Button variant={person ? "outline" : "default"}>
          {person ? <LucideEdit size={20} /> : "Add Person"}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={`${person ? "Edit" : "Add"} personn form`}
      >
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
