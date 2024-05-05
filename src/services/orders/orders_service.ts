import type {
  GetAdminOrdersParams,
  GetClientOrdersParams,
  OrderCreatePayload,
} from "@infra/types";
import type { OrdersInfra } from "@infra/api";
import type { Response } from "@infra/http";
import type { UserFieldShort } from "@services/types";
import i18n from "@plugins/i18n";

export default class OrdersService {
  constructor(private repository: OrdersInfra) {}

  private prepairOrderCreateField(
    field: UserFieldShort,
    path: string,
    fd: FormData,
  ) {
    fd.append(`${path}.Id`, `${field.id}`);
    fd.append(`${path}.FieldName`, field.fieldName);

    if ("childTemplateId" in field) {
      fd.append(`${path}.ChildTemplateId`, `${field.childTemplateId}`);
    }

    fd.append(`${path}.isFile`, `${field.isFile}`);

    if (field.file instanceof File) {
      fd.append(`${path}.file`, field.file);
    } else {
      fd.append(`${path}.file`, `${field.file}`);
    }

    fd.append(`${path}.source`, `${field.source}`);
    fd.append(`${path}.name`, field.name);
    fd.append(`${path}.needToReverseText`, `${field.needToReverseText}`);

    if (field.value) {
      const value = field.file instanceof File ? field.file : field.value;

      fd.append(`${path}.value`, value);
    }

    if (field?.subFields?.length) {
      field.subFields.forEach((field, index) =>
        this.prepairOrderCreateField(field, `${path}.SubFields[${index}]`, fd),
      );
    }
  }

  private prepairOrderCreatePayload(data: OrderCreatePayload): FormData {
    const fd = new FormData();

    fd.append("TemplateName", data.templateName);
    fd.append("Price", `${data.price}`);
    fd.append("Count", `${data.count}`);
    fd.append("TemplateId", `${data.templateId}`);

    data.fields.forEach((field, index) =>
      this.prepairOrderCreateField(field, `Fields[${index}]`, fd),
    );

    return fd;
  }

  public async getAdminList(
    params: GetAdminOrdersParams = { start: 0, pageSize: 12 },
  ): Promise<Response> {
    return await this.repository.getAdminList(params);
  }

  public async getClientList(
    params: GetClientOrdersParams = { start: 0, pageSize: 12 },
  ): Promise<Response> {
    return await this.repository.getClientList(params);
  }

  public async run(id: number): Promise<Response> {
    return await this.repository.run(id);
  }

  public async delete(id: number): Promise<Response> {
    return await this.repository.delete(id);
  }

  public async get(id: number): Promise<Response> {
    return await this.repository.get(id);
  }

  public async fromTemplate(templateId: string): Promise<Response>;
  public async fromTemplate(
    templateId: string,
    orderId?: string,
  ): Promise<Response>;
  public async fromTemplate(
    templateId: string,
    orderId?: string,
  ): Promise<Response> {
    return await this.repository.fromTemplate(templateId, orderId);
  }

  public async create(payload: OrderCreatePayload): Promise<Response> {
    const response = await this.repository.create(
      this.prepairOrderCreatePayload(payload),
    );

    const { meta } = response;

    if (meta.status === 400) {
      meta.message = i18n.global.t("error.provideValidPhoto");
    }

    return response;
  }
}
