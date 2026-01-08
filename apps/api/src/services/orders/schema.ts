import { z } from "zod";

export const orderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0),
  unit: z.string().min(1),
  checked: z.boolean().default(false),
});

export const createOrderSchema = z.object({
  orderDate: z.coerce.date(),
  orderItems: z.array(orderItemSchema).optional().default([]),
});

export const updateOrderSchema = z.object({
  id: z.uuid(),
  orderDate: z.coerce.date().optional(),
  orderItems: z.array(orderItemSchema).optional(),
});

export const orderFiltersSchema = z.object({
  orderDate: z.coerce.date().optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
export type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>;
