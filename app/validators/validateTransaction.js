import {z} from "zod";
export const baseTransactionSchema = z.object({
  title: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.coerce.number(),
  category: z.string(),
  date: z.coerce.date(),          // 🔥 FIXED HERE
  isRecurring: z.coerce.boolean().default(false),
  recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).nullable().optional(),
  paymentMethod: z.string().optional(),
  description: z.string().optional(),
});
export const bulkTransactionDeleteSchema = z.object({
  transactionsIds : z.array(z.string().length(24,"Invalid Transaction ID format")).min(1,"At least one Transaction ID must be provided")
})
export const createTransactionSchema = baseTransactionSchema;
export const updateTransactionSchema = baseTransactionSchema.partial();