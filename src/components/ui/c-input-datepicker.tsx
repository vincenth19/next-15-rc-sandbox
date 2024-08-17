"use client";

import { format } from "date-fns";
import { enAU } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "./form";

export function InputDatePicker({
  placeholder = "Pick a date",
  value,
  onchange,
  min = new Date("1900-01-01"),
  max = new Date(),
}: {
  placeholder?: string;
  value: Date | string;
  onchange: (...event: any[]) => void;
  min?: Date;
  max?: Date;
}) {
  const dateValue = typeof value !== "string" ? value : value.toString();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !dateValue && "text-muted-foreground"
            )}
          >
            {dateValue ? (
              format(value, "PPP", { locale: enAU })
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(dateValue)}
          onSelect={onchange}
          disabled={(date: Date) => date > max || date < min}
        />
      </PopoverContent>
    </Popover>
  );
}
