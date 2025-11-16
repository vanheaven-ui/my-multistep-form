import { z } from "zod";

export const PersonalSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const ContactSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const FilesSchema = z.object({
  attachments: z
    .array(z.object({ name: z.string(), size: z.number() }))
    .optional(),
});

// Merge all for full form
export const FormSchema =
  PersonalSchema.merge(ContactSchema).merge(FilesSchema);

export type FormSchemaType = z.infer<typeof FormSchema>;
