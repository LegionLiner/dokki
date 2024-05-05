import type { Http, Response } from "@infra/http";

export default class CountriesInfra {
  constructor(private http: Http) {}

  public async get(): Promise<Response>;
  public async get(category?: number): Promise<Response>;
  public async get(category?: number): Promise<Response> {
    let withCategory = "";

    if (category !== undefined) {
      withCategory = `/${category}`;
    }

    return await this.http.request({
      url: `/admin/countries${withCategory}`,
    });
  }
}
