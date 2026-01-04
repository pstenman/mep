import fs from "node:fs/promises";
import path from "node:path";

function getLocaleDir() {
  if (process.env.NODE_ENV === "production") {
    return path.join(process.cwd(), "apps", "web", "public", "locale");
  }
  return path.join(process.cwd(), "public", "locale");
}

const LOCALE_DIR = getLocaleDir();

export async function loadLocaleMessages(locale: string) {
  const folder = path.join(LOCALE_DIR, locale);
  const files = await fs.readdir(folder);

  const messages: Record<string, any> = {};

  for (const file of files) {
    if (file.endsWith(".json")) {
      const ns = file.replace(".json", "");
      const content = await fs.readFile(path.join(folder, file), "utf8");
      messages[ns] = JSON.parse(content);
    }
  }

  return messages;
}
