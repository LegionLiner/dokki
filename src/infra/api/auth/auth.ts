import type { Http, Response } from "@infra/http";
import type { LoginPayload } from "@infra/types";

export default class AuthInfra {
  constructor(private http: Http) {}

  public async login(data: LoginPayload): Promise<Response> {
    return await this.http.request({
      url: `/account/login`,
      method: "POST",
      data,
    });
  }

  public async register(data: LoginPayload): Promise<Response> {
    return await this.http.request({
      url: `/account/register`,
      method: "POST",
      data,
    });
  }
}
