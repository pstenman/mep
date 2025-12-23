import { z } from "zod";

export const orderItemSchema = z.object({
  quantity: z.number().min(0),
  price: z.number().min(0),
});

export const createOrderSchema = z.object({
  orderItems: z.array(orderItemSchema).optional(),
});

export const updateOrderSchema = z.object({
  id: z.uuid(),
  orderItems: z.array(orderItemSchema).optional(),
});

export const orderFiltersSchema = z.object({});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
export type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>;

