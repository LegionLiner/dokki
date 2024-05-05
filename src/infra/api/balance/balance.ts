import type { BalanceParams, BalancePayload } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class BalanceInfra {
  constructor(private http: Http) {}

  public async getBalance(params: BalanceParams): Promise<Response> {
    return await this.http.request({
      url: `/admin/balance/user`,
      params,
    });
  }

  public async setBalance(data: BalancePayload): Promise<Response> {
    return await this.http.request({
      url: `/admin/balance/topup`,
      method: "POST",
      data,
    });
  }

  public async getHistory(start: number, count: number): Promise<Response> {
    return await this.http.request({
      url: `/balance/history/${start}/${count}`,
    });
  }
}
