import {z} from "zod";

export const emailSchema = z.string().trim().email("Invalid email address").min(1).max(255);

export const registerSchema = z.object({
    name:z.string().trim().min(1,"Name is required").max(100),
    email:emailSchema,
})

export const loginSchema = z.object({
    email : emailSchema
})

export const monthlyBudgetSchema = z.number().min(0);