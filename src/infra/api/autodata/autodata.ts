import type { AutodataCityParams, AutodataNameParams } from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class AutodataInfra {
  constructor(private http: Http) {}

  public async name(params: AutodataNameParams): Promise<Response> {
    return await this.http.request({
      url: `/autodata/name`,
      params,
    });
  }

  public async date(field: number): Promise<Response> {
    return await this.http.request({
      url: `/autodata/date`,
      params: {
        field,
      },
    });
  }

  public async price(field: number): Promise<Response> {
    return await this.http.request({
      url: `/autodata/price`,
      params: {
        field,
      },
    });
  }

  public async text(field: number): Promise<Response> {
    return await this.http.request({
      url: `/autodata/text`,
      params: {
        field,
      },
    });
  }

  public async city(params: AutodataCityParams): Promise<Response> {
    return await this.http.request({
      url: `/autodata/city`,
      params,
    });
  }
}
