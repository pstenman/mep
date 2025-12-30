import { orderQueries, type OrderFilters } from "@mep/db";
import type { CreateOrderSchema, UpdateOrderSchema } from "./schema";

export class OrderService {
  static async getAll(companyId: string) {
    const filters: OrderFilters = {
      companyId,
    };
    const rows = await orderQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await orderQueries.getById(id);
  }

  static async create(
    input: CreateOrderSchema,
    companyId: string,
    userId: string,
  ) {
    const order = await orderQueries.create({
      companyId,
      orderItems: input.orderItems,
      createdBy: userId,
      updatedBy: userId,
    });
    return order;
  }

  static async update(input: UpdateOrderSchema, userId: string) {
    const existing = await orderQueries.getById(input.id);
    if (!existing) {
      throw new Error("Order not found");
    }

    const updateData: Partial<{
      orderItems: Array<{ quantity: number; price: number }> | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.orderItems !== undefined) {
      updateData.orderItems = input.orderItems || null;
    }

    const order = await orderQueries.update(input.id, updateData);
    return order;
  }

  static async delete(id: string, companyId: string) {
    const existing = await orderQueries.getById(id);
    if (!existing) {
      throw new Error("Order not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Order does not belong to this company");
    }

    await orderQueries.delete(id);
    return { success: true };
  }
}
