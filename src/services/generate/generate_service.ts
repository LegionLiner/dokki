import type { GenerateCodePayload } from "@infra/types";
import type { GenerateInfra } from "@infra/api";
import type { Response } from "@infra/http";

export default class GenerateService {
  constructor(private repository: GenerateInfra) {}

  public async generateCode(data: GenerateCodePayload): Promise<Response> {
    return await this.repository.generateCode(data);
  }
}
