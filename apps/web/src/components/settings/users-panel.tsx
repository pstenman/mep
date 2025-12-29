"use client";

import { trpc } from "@/lib/trpc/client";
import { useTranslations } from "next-intl";
import { Checkbox, Text, Label } from "@mep/ui";
import { Role } from "@mep/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function UsersPanel() {
  const t = useTranslations("settings.users");
  const tUsers = useTranslations("users");
  const utils = trpc.useUtils();

  const { data: usersData, isLoading } = trpc.users.getAll.useQuery({});

  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>(
    {},
  );

  const updateUserRole = trpc.users.update.useMutation({
    onSuccess: (variables: { id: string; data: { role: Role } }) => {
      utils.users.getAll.invalidate();
      setUpdatingRoles((prev) => ({ ...prev, [variables.id]: false }));
      toast.success(t("updateSuccess") || "Role updated successfully");
    },
    onError: (
      error: Error,
      variables: { id: string; data: { role: Role } },
    ) => {
      setUpdatingRoles((prev) => ({ ...prev, [variables.id]: false }));
      toast.error(error.message || t("updateError") || "Failed to update role");
    },
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUpdatingRoles((prev) => ({ ...prev, [userId]: true }));
    updateUserRole.mutate({
      id: userId,
      data: { role: newRole },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <Text>{t("loading") || "Loading users..."}</Text>
      </div>
    );
  }

  const users = usersData?.data?.items || [];

  if (users.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <Text className="text-sm text-muted-foreground">
          {t("description") || "Manage user roles in your company."}
        </Text>
        <Text className="text-sm text-muted-foreground">
          {t("empty") || "No users found."}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-sm text-muted-foreground">
        {t("description") || "Manage user roles in your company."}
      </Text>

      <div className="space-y-4">
        {users.map((user: (typeof users)[number]) => {
          const membership = user.memberships?.[0];
          const currentRole = membership?.role || Role.USER;
          const isUpdating = updatingRoles[user.id] || false;

          return (
            <div
              key={user.id}
              className="flex flex-col gap-3 p-4 border rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <Text className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {user.email}
                </Text>
              </div>
              <div className="flex flex-col gap-2">
                <Text className="text-xs font-medium text-muted-foreground">
                  {t("columns.role") || "Role"}
                </Text>
                <div className="flex flex-wrap gap-4">
                  {Object.values(Role).map((role) => {
                    const isChecked = currentRole === role;
                    return (
                      <div key={role} className="flex items-center gap-2">
                        <Checkbox
                          id={`${user.id}-${role}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked && !isUpdating) {
                              handleRoleChange(user.id, role);
                            }
                          }}
                          disabled={isUpdating}
                        />
                        <Label
                          htmlFor={`${user.id}-${role}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {isUpdating && isChecked ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              {tUsers(`form.role.${role}`) || role}
                            </div>
                          ) : (
                            tUsers(`form.role.${role}`) || role
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
