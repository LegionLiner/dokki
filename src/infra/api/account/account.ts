import type { Http, Response } from "@infra/http";

export default class AccountInfra {
  constructor(private http: Http) {}

  public async get(): Promise<Response> {
    return await this.http.request({
      url: `/account/info`,
    });
  }
}
