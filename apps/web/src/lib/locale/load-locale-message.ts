import fs from "node:fs/promises";
import path from "node:path";

const LOCALE_DIR = path.join(process.cwd(), "locale");

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

