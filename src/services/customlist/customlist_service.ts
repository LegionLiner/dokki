import type { CustomListInfra } from "@infra/api";
import type { CustomListParams } from "@infra/types";
import type { Response } from "@infra/http";

export default class CustomListService {
  constructor(private repository: CustomListInfra) {}

  public async getList(
    params: CustomListParams = { start: 0, pageSize: 1000 },
  ): Promise<Response> {
    return await this.repository.getList(params);
  }
}
