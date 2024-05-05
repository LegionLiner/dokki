import type { CountriesInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class CountriesService {
  constructor(private repository: CountriesInfra) {}

  public async get(): Promise<Response>;
  public async get(category?: number): Promise<Response>;
  public async get(category?: number): Promise<Response> {
    return await this.repository.get(category);
  }
}
