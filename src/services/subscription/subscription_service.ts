import type { SubscriptionParams } from "@infra/types";
import type { SubscriptionInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class SubscriptionService {
  constructor(private repository: SubscriptionInfra) {}

  public async getSubscriptions(): Promise<Response> {
    return await this.repository.getSubscriptions();
  }
  public async getSubscription(): Promise<Response> {
    return await this.repository.getSubscription();
  }

  public async buySubscription(data: SubscriptionParams): Promise<Response> {
    return await this.repository.setSubscription(data);
  }
}
