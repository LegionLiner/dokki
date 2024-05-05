import type { TranslationInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class TranslationService {
  constructor(private repository: TranslationInfra) {}

  public async translate(
    q: string,
    fromLang: string,
    toLang: string,
  ): Promise<Response> {
    return await this.repository.translate({
      q,
      langpair: `${fromLang}|${toLang}`,
    });
  }
}
