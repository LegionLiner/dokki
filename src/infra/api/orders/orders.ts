import type { GetAdminOrdersParams, GetClientOrdersParams } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class OrdersInfra {
  constructor(private http: Http) {}

  public async getAdminList(params: GetAdminOrdersParams): Promise<Response> {
    return await this.http.request({
      url: `/adminorders/list`,
      params,
    });
  }

  public async getClientList(params: GetClientOrdersParams): Promise<Response> {
    return await this.http.request({
      url: `/order/list`,
      params,
    });
  }

  public async run(id: number): Promise<Response> {
    return await this.http.request({
      url: `/order/run/${id}`,
      method: "PUT",
    });
  }

  public async delete(id: number): Promise<Response> {
    return await this.http.request({
      url: `/order/${id}`,
      method: "DELETE",
    });
  }

  public async get(id: number): Promise<Response> {
    return await this.http.request({
      url: `/order/${id}`,
    });
  }

  public async fromTemplate(templateId: string): Promise<Response>;
  public async fromTemplate(
    templateId: string,
    orderId?: string,
  ): Promise<Response>;
  public async fromTemplate(
    templateId: string,
    orderId?: string,
  ): Promise<Response> {
    const orderSuffix = orderId ? `/${orderId}` : "";

    return await this.http.request({
      url: `/order/fromtemplate/${templateId}${orderSuffix}`,
    });
  }

  public async create(data: FormData): Promise<Response> {
    return await this.http.request({
      url: `/order/create`,
      method: "POST",
      data,
    });
  }
}
