import { z } from "zod";

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
    .max(50, { message: "Maximum 50 characters" })
    .regex(/^[\p{L}\p{M}\s]+$/u, {
      message: "Only alphabeth characters are allowed",
    }),
  last_name: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Invalid last name. Must be a string.",
    })
    .min(1, {
      message: "Last name is required",
    })
    .max(50, { message: "Maximum 50 characters" })
    .regex(/^[\p{L}\p{M}\s]+$/u, {
      message: "Only alphabeth characters are allowed",
    }),
  phone_number: z
    .string({
      required_error: "Phone number is required",
      invalid_type_error:
        "Invalid phone number. Must be numbers with/out extension.",
    })
    .regex(/^(\+61|0)[2-478]( ?\d){8}$/, {
      message:
        "Invalid AUS phone number format. Enter 10 numbers, 13 if using +61",
    }),
  date_of_birth: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date",
    })
});
