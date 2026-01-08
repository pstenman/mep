import { orderQueries, type OrderFilters } from "@mep/db";
import type { CreateOrderSchema, UpdateOrderSchema } from "./schema";

export class OrderService {
  static async getAll(companyId: string, filters?: Partial<OrderFilters>) {
    const filterData: OrderFilters = {
      companyId,
      ...filters,
    };
    const rows = await orderQueries.getAll(filterData);
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
    const normalizedDate = new Date(input.orderDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const order = await orderQueries.create({
      companyId,
      orderDate: normalizedDate,
      orderItems: input.orderItems || [],
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
      orderDate: Date;
      orderItems: Array<{
        name: string;
        quantity: number;
        unit: string;
        checked: boolean;
      }> | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.orderDate !== undefined) {
      const normalizedDate = new Date(input.orderDate);
      normalizedDate.setHours(0, 0, 0, 0);
      updateData.orderDate = normalizedDate;
    }

    if (input.orderItems !== undefined) {
      updateData.orderItems = input.orderItems || null;
    }

    const order = await orderQueries.update(input.id, updateData);
    return order;
  }

  static async getByDate(companyId: string, orderDate: Date) {
    const normalizedDate = new Date(orderDate);
    normalizedDate.setHours(0, 0, 0, 0);
    return await orderQueries.getByDate(companyId, normalizedDate);
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
