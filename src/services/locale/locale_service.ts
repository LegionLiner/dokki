import { availableLocales, fallbackLocale } from "@plugins/i18n";
import type { Locale } from "@/types";

export default class LocaleService {
  constructor(private key: string) {}

  public restoreLocale(): Locale {
    const restored = localStorage.getItem(this.key);

    if (restored && availableLocales.includes(restored)) {
      return restored as Locale;
    }

    return fallbackLocale.value as Locale;
  }

  public storeLocale(locale: Locale) {
    localStorage.setItem(this.key, locale);
  }
}
