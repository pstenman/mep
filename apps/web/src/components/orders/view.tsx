"use client";

import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Loader2, Pencil } from "lucide-react";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { DatePicker, Form, Button, useForm } from "@mep/ui";
import { OrderList } from "./order-list";
import { OrderItemsFieldArray } from "./items-field-array";
import { OrderEditDialog, useOrderEditDialog } from "./edit-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { parseAsBoolean } from "nuqs";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import type { z } from "zod";
import { orderItemsSchema } from "./schema";

export const useOrderAddForm = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "orderAddFormOpen",
    parseAsBoolean.withDefault(false),
  );

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
  };
};

export function OrdersView() {
  const t = useTranslations("orders");
  const utils = trpc.useUtils();
  const { isOpen: showAddForm, close: closeAddForm } = useOrderAddForm();
  const { open: openEditDialog } = useOrderEditDialog();
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);

  const { data: orderData, isLoading } = trpc.orders.getByDate.useQuery(
    {
      orderDate: selectedDate || today,
    },
    {
      enabled: !!selectedDate,
    },
  );

  const order = orderData?.data || null;

  const schema = orderItemsSchema(t);
  type OrderItemsFormValues = z.infer<typeof schema>;

  const form = useForm<OrderItemsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderItems: [],
    },
  });

  useEffect(() => {
    if (!showAddForm) {
      form.reset({ orderItems: [] });
    }
  }, [showAddForm, form]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      setSelectedDate(normalizedDate);
    } else {
      setSelectedDate(today);
    }
    closeAddForm();
  };

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      utils.orders.getByDate.invalidate({ orderDate: selectedDate || today });
      toast.success(t("view.toast.itemsAdded"));
      closeAddForm();
      form.reset({ orderItems: [] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("view.toast.addError"));
    },
  });

  const updateOrder = trpc.orders.update.useMutation({
    onSuccess: () => {
      utils.orders.getByDate.invalidate({ orderDate: selectedDate || today });
      toast.success(t("view.toast.itemsAdded"));
      closeAddForm();
      form.reset({ orderItems: [] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("view.toast.addError"));
    },
  });

  const onSubmit = async (data: OrderItemsFormValues) => {
    if (data.orderItems.length === 0) {
      toast.error(t("view.toast.pleaseAddItem"));
      return;
    }

    const itemsWithChecked = data.orderItems.map(
      (item: { name: string; quantity: number; unit: string }) => ({
        ...item,
        checked: false,
      }),
    );

    if (order?.id) {
      const currentItems = order.orderItems || [];
      await updateOrder.mutateAsync({
        id: order.id,
        orderItems: [...currentItems, ...itemsWithChecked],
      });
    } else {
      const normalizedDate = new Date(selectedDate || today);
      normalizedDate.setHours(0, 0, 0, 0);

      await createOrder.mutateAsync({
        orderDate: normalizedDate,
        orderItems: itemsWithChecked,
      });
    }
  };

  const isLoadingMutation = createOrder.isPending || updateOrder.isPending;

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              placeholder="Select date"
            />
            {order?.orderItems && order.orderItems.length > 0 ? (
              <DynamicButton
                icon={Pencil}
                tooltip={t("view.tooltip.editItems")}
                size="icon"
                variant="outline"
                onClick={openEditDialog}
                buttonClassName="rounded-full w-[32px] h-[32px]"
                type="button"
              />
            ) : null}
          </div>

          {showAddForm && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 p-4 border rounded-lg"
              >
                <OrderItemsFieldArray form={form} />
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeAddForm}
                    disabled={isLoadingMutation}
                  >
                    {t("form.button.cancel")}
                  </Button>
                  <Button type="submit" disabled={isLoadingMutation}>
                    {isLoadingMutation ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("form.button.saving")}
                      </>
                    ) : (
                      t("form.button.saveItems")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {order?.orderItems && order.orderItems.length > 0 ? (
            <>
              <OrderList
                orderId={order.id}
                items={order.orderItems}
                orderDate={selectedDate || today}
              />
              <OrderEditDialog
                orderId={order.id}
                items={order.orderItems}
                orderDate={selectedDate || today}
              />
            </>
          ) : (
            !showAddForm && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  {t("view.empty.noItems", {
                    date: selectedDate?.toLocaleDateString() || "selected date",
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("view.empty.clickToAdd")}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
