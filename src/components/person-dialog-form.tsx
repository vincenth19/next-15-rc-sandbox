"use client";

import { useState } from "react";
import { Person } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { InputDatePicker } from "./ui/c-input-datepicker";
import { createPerson, updatePerson } from "@/actions/people";

export const personFormSchema = z.object({
  user_id: z.string().default("1"), // TODO: update when we have auth
  first_name: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "Invalid first name. Must be a string.",
    })
    .min(1, {
      message: "First name is required",
    })
    .max(50, { message: "Maximum 50 characters" }),
  last_name: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Invalid last name. Must be a string.",
    })
    .min(1, {
      message: "Last name is required",
    })
    .max(50, { message: "Maximum 50 characters" }),
  phone_number: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error:
        "Invalid phone number. Must be numbers with/out extension.",
    })
    .min(10, {
      message: "Minimum 10 characters",
    })
    .max(15, {
      message: "Maximum 15 characters",
    }),
  date_of_birth: z
    .string({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date",
    })
    .datetime(),
});

const PersonDialogForm = ({
  action = "post",
  person = null,
}: {
  action?: "post" | "put";
  person?: Person | null;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  async function onAddPerson(values: z.infer<typeof personFormSchema>) {
    try {
      setIsLoading(true);
      const result = await createPerson(values);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function onEditPerson(values: z.infer<typeof personFormSchema>) {
    try {
      setIsLoading(true);
      if (!person?.id) {
        throw new Error("Person ID is not provided.");
      }
      const result = await updatePerson(person.id, values);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {action === "post" ? (
          <Button>Add Person</Button>
        ) : (
          <Button>Edit</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action === "post" ? "Add" : "Edit"} Person</DialogTitle>
          <div className="my-8"></div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                action === "post" ? onAddPerson : onEditPerson
              )}
              className="flex flex-col gap-4"
            >
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
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default PersonDialogForm;
