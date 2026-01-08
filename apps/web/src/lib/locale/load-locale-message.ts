// Import locale files directly as modules
import enAuth from "../../locale/en/auth.json";
import enAllergies from "../../locale/en/allergies.json";
import enCommon from "../../locale/en/common.json";
import enMenus from "../../locale/en/menus.json";
import enPages from "../../locale/en/pages.json";
import enPreparations from "../../locale/en/preparations.json";
import enPublic from "../../locale/en/public.json";
import enRecipes from "../../locale/en/recipes.json";
import enSettings from "../../locale/en/settings.json";
import enUsers from "../../locale/en/users.json";
import enOrders from "../../locale/en/orders.json";

import svAuth from "../../locale/sv/auth.json";
import svAllergies from "../../locale/sv/allergies.json";
import svCommon from "../../locale/sv/common.json";
import svMenus from "../../locale/sv/menus.json";
import svPages from "../../locale/sv/pages.json";
import svPreparations from "../../locale/sv/preparations.json";
import svPublic from "../../locale/sv/public.json";
import svRecipes from "../../locale/sv/recipes.json";
import svSettings from "../../locale/sv/settings.json";
import svUsers from "../../locale/sv/users.json";
import svOrders from "../../locale/sv/orders.json";

const localeMessages: Record<string, Record<string, any>> = {
  en: {
    auth: enAuth,
    allergies: enAllergies,
    common: enCommon,
    menus: enMenus,
    pages: enPages,
    preparations: enPreparations,
    public: enPublic,
    recipes: enRecipes,
    settings: enSettings,
    users: enUsers,
    orders: enOrders,
  },
  sv: {
    auth: svAuth,
    allergies: svAllergies,
    common: svCommon,
    menus: svMenus,
    pages: svPages,
    preparations: svPreparations,
    public: svPublic,
    recipes: svRecipes,
    settings: svSettings,
    users: svUsers,
    orders: svOrders,
  },
};

export async function loadLocaleMessages(locale: string) {
  return localeMessages[locale] || localeMessages.en;
}
