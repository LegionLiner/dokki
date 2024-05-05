import type { AxiosInstance } from "axios";

export default class AuthBearer {
  constructor(private client: AxiosInstance) {}

  public set(token: string) {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  public remove() {
    delete this.client.defaults.headers.common.Authorization;
  }
}
