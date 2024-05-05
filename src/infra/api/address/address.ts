import type { GetAddressParams } from "@/infra/types";
import type { Http, Response } from "@infra/http";

export default class AddressInfra {
  constructor(private http: Http) {}

  public async get(params: GetAddressParams): Promise<Response> {
    return await this.http.request({
      url: `/adminaddress`,
      params,
    });
  }
}
