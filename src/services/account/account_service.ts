import type { AccountInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class AccountService {
  constructor(private repository: AccountInfra) {}

  public async get(): Promise<Response> {
    return await this.repository.get();
  }
}
