import type { GenerateCodePayload } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class GenerateInfra {
  constructor(private http: Http) {}

  public async generateCode(data: GenerateCodePayload): Promise<Response> {
    return await this.http.request({
      url: `generate`,
      method: "POST",
      data,
    });
  }
}
