import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.number().int().positive().optional(),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is too short"),
  address: z.string().optional(),
});

export const fileSchema = z.object({
  attachments: z
    .array(z.object({ name: z.string(), url: z.string().url() }))
    .optional(),
});

export const formSchema = z.object({
  personal: personalSchema,
  contact: contactSchema,
  files: fileSchema,
});

export type FormPayload = z.infer<typeof formSchema>;
