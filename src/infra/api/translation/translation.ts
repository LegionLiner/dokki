import type { TranslationParams } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class TranslationInfra {
  constructor(
    private http: Http,
    private key: string,
  ) {}

  public async translate(params: TranslationParams): Promise<Response> {
    return await this.http.request({
      url: `get`,
      params: {
        ...params,
        key: this.key,
      },
    });
  }
}
