import { z } from "zod";

export const ParcelCreationSchema = z.object({
  receiverName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Provide a valid BD phone number"),
  address: z.string().min(5, "A detailed address is required"),
  district: z.string().min(2, "District is required"),
  weight: z.number().min(0.5, "Weight must be at least 0.5kg"),
  codAmount: z.number().min(0, "COD cannot be negative"),
});

export const WithdrawalRequestSchema = z.object({
  amount: z.number().min(500, "Minimum withdrawal is 500 BDT"),
});
