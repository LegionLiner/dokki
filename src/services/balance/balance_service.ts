import type { BalanceParams, BalancePayload } from "@infra/types";
import type { BalanceInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class BalanceService {
  constructor(private repository: BalanceInfra) {}

  public async getBalance(params: BalanceParams): Promise<Response> {
    return await this.repository.getBalance(params);
  }

  public async setBalance(data: BalancePayload): Promise<Response> {
    return await this.repository.setBalance(data);
  }

  public async getHistory(
    start: number = 0,
    count: number = 12,
  ): Promise<Response> {
    return await this.repository.getHistory(start, count);
  }
}
