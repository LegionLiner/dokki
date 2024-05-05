import type { AutodataCityParams, AutodataNameParams } from "@infra/types";
import type { AutodataInfra } from "@infra/api";
import type { Response } from "@infra/http";
import { isAutodataDateBody } from "@services/types";
import { RANDOMIZED_DATE_FORMAT, DEFAULT_DATE_FORMAT } from "@/types";
import { date } from "@/utils";

export default class AutodataService {
  constructor(private repository: AutodataInfra) {}

  public async name(params: AutodataNameParams): Promise<Response> {
    return await this.repository.name(params);
  }

  public async date(id: number): Promise<Response> {
    const response = await this.repository.date(id);
    const { data, meta } = response;
    const { success } = meta;

    if (success) {
      if (isAutodataDateBody(data)) {
        data.dateString = date.convertFormat(
          data.dateString,
          RANDOMIZED_DATE_FORMAT,
          DEFAULT_DATE_FORMAT,
        );
      }
    }

    return response;
  }

  public async price(id: number): Promise<Response> {
    return await this.repository.price(id);
  }

  public async text(id: number): Promise<Response> {
    return await this.repository.text(id);
  }

  public async city(params: AutodataCityParams): Promise<Response> {
    return await this.repository.city(params);
  }
}
