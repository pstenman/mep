"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
} from "@mep/ui";
import { Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { parseAsBoolean } from "nuqs";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";

export const useOrderEditDialog = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "orderEditDialogOpen",
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

interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

interface OrderEditDialogProps {
  orderId: string;
  items: OrderItem[];
  orderDate: Date;
}

export function OrderEditDialog({
  orderId,
  items,
  orderDate,
}: OrderEditDialogProps) {
  const t = useTranslations("orders");
  const { isOpen, close } = useOrderEditDialog();
  const utils = trpc.useUtils();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<OrderItem | null>(null);

  const updateOrder = trpc.orders.update.useMutation({
    onSuccess: () => {
      utils.orders.getByDate.invalidate({ orderDate });
      utils.orders.getAll.invalidate();
      toast.success(t("editDialog.toast.updateSuccess"));
      setEditingIndex(null);
      setEditValues(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t("editDialog.toast.updateError"));
    },
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValues({ ...items[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValues(null);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editValues) return;

    const updatedItems = [...items];
    updatedItems[editingIndex] = editValues;

    await updateOrder.mutateAsync({
      id: orderId,
      orderItems: updatedItems,
    });
  };

  const handleDelete = async (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);

    await updateOrder.mutateAsync({
      id: orderId,
      orderItems: updatedItems,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("editDialog.empty")}
            </p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                {editingIndex === index ? (
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    <Input
                      value={editValues?.name || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues!,
                          name: e.target.value,
                        })
                      }
                      placeholder={t("form.placeholder.itemName")}
                      className="col-span-2"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={editValues?.quantity || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues!,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder={t("form.placeholder.quantity")}
                    />
                    <Input
                      value={editValues?.unit || ""}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues!,
                          unit: e.target.value,
                        })
                      }
                      placeholder={t("form.placeholder.unit")}
                    />
                    <div className="col-span-4 flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={updateOrder.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t("form.button.cancel")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={updateOrder.isPending}
                      >
                        {updateOrder.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        {t("form.button.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                        disabled={updateOrder.isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        disabled={updateOrder.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
