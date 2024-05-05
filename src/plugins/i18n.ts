import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";
import type { Locale } from "@/types";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: import.meta.env.VITE_I18N_LOCALE ?? "en",
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE ?? "en",
  messages,
});

export const setLocale = (locale: Locale) =>
  (i18n.global.locale.value = locale);

export const availableLocales = i18n.global.availableLocales;
export const fallbackLocale = i18n.global.fallbackLocale;

export default i18n;
