import type { CustomListParams } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class CustomListInfra {
  constructor(private http: Http) {}

  public async getList(params: CustomListParams): Promise<Response> {
    return await this.http.request({
      url: `/customlist/all`,
      params,
    });
  }
}
