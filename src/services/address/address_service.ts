import type { AddressInfra } from "@/infra/api";
import type { GetAddressParams } from "@/infra/types";
import type { Response } from "@infra/http";

export default class AddressService {
  constructor(private repository: AddressInfra) {}

  public async get(params: GetAddressParams): Promise<Response> {
    return this.repository.get(params);
  }
}
