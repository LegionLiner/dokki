import type { FAQInfra } from "@infra/types";
import type { Response } from "@infra/http";
import type { FaqItem } from "@services/types";

export default class FAQService {
  constructor(private repository: FAQInfra) {}

  public async get(): Promise<Response> {
    return await this.repository.get();
  }

  public async save(data: FaqItem[]): Promise<Response> {
    return await this.repository.store(data);
  }
}
