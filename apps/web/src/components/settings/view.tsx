import { SettingsDisplay } from "./display";
import { UserSheet } from "../users/sheet";

export function SettingsView() {
  return (
    <div className="max-w-4xl px-6 py-8">
      <SettingsDisplay />
      <UserSheet />
    </div>
  );
}
