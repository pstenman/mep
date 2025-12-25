import { Combobox, type ComboboxOption } from "@mep/ui";

interface Menu {
  id: string;
  name?: string | null;
  isActive?: boolean;
}

interface MenuComboboxProps {
  menus: Menu[];
  value?: string;
  onChange: (menuId: string) => void;
  disabled?: boolean;
}

export function MenuCombobox({
  menus,
  value,
  onChange,
  disabled,
}: MenuComboboxProps) {
  const options: ComboboxOption<Menu>[] = menus.map((menu) => ({
    value: menu.id,
    label: menu.name ?? "Unnamed menu",
    meta: menu,
  }));

  return (
    <Combobox<Menu>
      value={value}
      options={options}
      placeholder="Search and select a menu..."
      disabled={disabled}
      onValueChange={onChange}
    />
  );
}
