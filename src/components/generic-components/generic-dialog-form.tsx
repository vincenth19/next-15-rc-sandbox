"use client";

import { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { ControllerRenderProps, Path, UseFormReturn } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputDatePicker } from "@/components/ui/c-input-datepicker";

function renderFormField(
  type: string,
  name: string,
  description: string | undefined,
  field: ControllerRenderProps<any, string>,
  placeholder?: string
) {
  const label = name
    .split("_")
    .map((str: string) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");

  switch (type) {
    case "date": {
      return (
        <FormItem className="flex flex-col gap-1">
          <FormLabel>{label}</FormLabel>
          <InputDatePicker
            placeholder={placeholder || label}
            value={field.value}
            onchange={(value: Date) => {
              const updatedDate = new Date(
                value.getTime() - value.getTimezoneOffset() * 60000
              );
              field.onChange(updatedDate);
            }}
          />
          <FormMessage />
        </FormItem>
      );
    }
    default: {
      return (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      );
    }
  }
}

export type FieldOptions = {
  visible?: boolean;
  placeholder?: string;
};

export default function GenericDialogForm<T extends z.ZodObject<any, any>>({
  isOpen,
  setIsOpen,
  title,
  trigger,
  schema,
  form,
  onSubmit,
  isLoading,
  fieldOptions = {},
  btnActionProps,
  btnActionLabel = "Submit",
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  trigger: ReactNode;
  schema: T;
  form: UseFormReturn<z.infer<T>, any, undefined>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  fieldOptions?: Partial<Record<keyof z.infer<T>, FieldOptions>>;
  btnActionProps?: ButtonProps;
  btnActionLabel?: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogDescription>{title} Form</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <div className="my-8"></div>
          <Form {...form}>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {Object.entries(schema._def.shape()).map(([key, value]) => {
                const options = fieldOptions[key] || {};
                if (options.visible === false) return null;
                const zodValue = value as ZodTypeAny;
                return (
                  <FormField
                    key={`field-${key}`}
                    control={form.control}
                    name={key as Path<z.infer<T>>}
                    render={({ field }) => {
                      const zodMetadata = zodValue._def;
                      return renderFormField(
                        zodMetadata.typeName.slice(3).toLowerCase(),
                        key,
                        zodMetadata.description,
                        field
                      );
                    }}
                  />
                );
              })}
              <Button type="submit" disabled={isLoading} {...btnActionProps}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "" : btnActionLabel}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
