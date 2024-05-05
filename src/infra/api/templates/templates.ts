import type {
  GetNewSampleParams,
  GetTemplatesParams,
  TemplateFileParams,
} from "@infra/types";
import type { Http, Response } from "@infra/http";

export default class TemplatesInfra {
  constructor(private http: Http) {}

  public async getList(params: GetTemplatesParams): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates`,
      params,
    });
  }

  public async get(templateId: string): Promise<Response>;
  public async get(category: number, countryId: number): Promise<Response>;
  public async get(
    templateCategoryId: number | string,
    countryId?: number,
  ): Promise<Response> {
    let url = `/admin/templates/${templateCategoryId}`;

    if (arguments.length > 1) {
      url = `/admin/templates/${templateCategoryId}/${countryId}`;
    }

    return await this.http.request({
      url,
    });
  }

  public async getNewSample(params: GetNewSampleParams): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/new`,
      params,
    });
  }

  public async getChildren(): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/children`,
    });
  }

  public async create(data: FormData): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates`,
      method: "POST",
      data,
    });
  }

  public async update(data: FormData): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates`,
      method: "PUT",
      data,
    });
  }

  public async delete(templateId: number): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/${templateId}`,
      method: "DELETE",
    });
  }

  public async getFile(params: TemplateFileParams): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/file`,
      params,
      config: {
        responseType: "blob",
      },
    });
  }

  public async getFields(data: FormData): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/getfields`,
      method: "POST",
      data,
    });
  }

  public async parents(): Promise<Response> {
    return await this.http.request({
      url: `/admin/templates/parents`,
      method: "GET",
    });
  }
}
