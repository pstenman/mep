import { House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./form";
import { Text } from "@mep/ui";
import { useTranslations } from "next-intl";

export function LoginView() {
  const t = useTranslations("auth");
  return (
    <div className="container grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <House />
            MeP
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block rounded-xl overflow-hidden">
        <Image
          src="/images/hero-login.jpg"
          alt="Login illustration"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <Text className="text-3xl font-bold text-white drop-shadow-lg">
            {t("login.hero.title")}
          </Text>
          <Text className="mt-2 text-lg text-white/80 drop-shadow-sm">
            {t("login.hero.subtitle")}
          </Text>
        </div>
      </div>
    </div>
  );
}
