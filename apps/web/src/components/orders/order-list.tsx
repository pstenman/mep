"use client";

import { trpc } from "@/lib/trpc/client";
import { Checkbox } from "@mep/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

interface OrderListProps {
  orderId: string;
  items: OrderItem[];
  orderDate: Date;
}

export function OrderList({ orderId, items, orderDate }: OrderListProps) {
  const t = useTranslations("orders");
  const utils = trpc.useUtils();
  const updateOrder = trpc.orders.update.useMutation({
    onSuccess: () => {
      utils.orders.getByDate.invalidate({ orderDate });
      utils.orders.getAll.invalidate();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("orderList.toast.updateError"));
    },
  });

  const handleToggleChecked = async (index: number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked,
    };

    await updateOrder.mutateAsync({
      id: orderId,
      orderItems: updatedItems,
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => handleToggleChecked(index)}
              disabled={updateOrder.isPending}
              className="mt-1"
            />
            <div className="flex-1">
              <span
                className={
                  item.checked
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }
              >
                {item.name}
              </span>
              <span className="text-muted-foreground ml-2">
                {item.quantity} {item.unit}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {updateOrder.isPending && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
    </div>
  );
}
