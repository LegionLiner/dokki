import type { SubscriptionParams } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class SubscriptionInfra {
  constructor(private http: Http) {}

    public async getSubscriptions(): Promise<Response> {
        // получить все существующие подписки
        return await this.http.request({
            url: `/subscriptions`,
        });
    }
    public async getSubscription(): Promise<Response> {
        // получить список своих подписок
        return await this.http.request({
            url: `/subscriptions/my`,
        });
    }
    public async setSubscription(data: SubscriptionParams): Promise<Response> {
        // купить подписку
        return await this.http.request({
        url: `/subscriptions/buy`,
        method: "POST",
        data,
        });
    }
}