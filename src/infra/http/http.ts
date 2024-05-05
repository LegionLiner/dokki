import type AxiosClient from "@infra/http/axios";
import type { RequestSignature } from "@infra/http/types";
import type { Response } from "@/infra/http";

export default class Http {
  constructor(private client: AxiosClient) {}

  async request({
    url,
    method = "get",
    data,
    params,
    config,
  }: RequestSignature): Promise<Response> {
    return this.client.request({
      url,
      method,
      data,
      params,
      config,
    });
  }
}
