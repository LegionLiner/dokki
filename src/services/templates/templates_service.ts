import type { TemplatesInfra } from "@infra/api";
import type {
  GetNewSampleParams,
  GetTemplatesParams,
  TemplateFilePayload,
  TemplatePayload,
} from "@infra/types";
import type { Response } from "@infra/http";
import { Source } from "@dict/sources";
import { Category, type UserField } from "@services/types";
import type {
  AutoDataTemplatePrice,
  AutoDataTemplateText,
  AutodataTemplateDate,
} from "@/types";

export default class TemplatesService {
  constructor(private repository: TemplatesInfra) {}

  private prepairFields(fields: UserField[], fd: FormData): FormData {
    return fields.reduce(
      (result, field, index) => this.prepairField(field, index, result),
      fd,
    );
  }

  private prepairField(
    field: UserField,
    index: number,
    fd: FormData,
  ): FormData {
    fd.append(`UserFields[${index}].id`, "-1");
    fd.append(`UserFields[${index}].Name`, field.name);
    fd.append(`UserFields[${index}].FieldName`, field.fieldName);
    fd.append(`UserFields[${index}].IsFile`, `${field.isFile}`);
    fd.append(`UserFields[${index}].Source`, `${field.source}`);
    fd.append(
      `UserFields[${index}].needToReverseText`,
      `${field.needToReverseText}`,
    );

    if (field.defaultValue) {
      fd.append(`UserFields[${index}].defaultValue`, field.defaultValue);
    }

    if (field.customListId !== null) {
      fd.append(`UserFields[${index}].customListId`, `${field.customListId}`);
    }

    if (field.childTemplateId !== null) {
      fd.append(
        `UserFields[${index}].childTemplateId`,
        `${field.childTemplateId}`,
      );
    }

    if (field.childTemplateResultLine !== null) {
      fd.append(
        `UserFields[${index}].childTemplateResultLine`,
        `${field.childTemplateResultLine}`,
      );
    }

    fd.append(`UserFields[${index}].isHidden`, `${field.isHidden}`);
    fd.append(`UserFields[${index}].displayOrder`, `${field.displayOrder}`);
    fd.append(`UserFields[${index}].tag`, `${field.tag ?? ""}`);

    if (field.autodataTemplate) {
      fd.append(
        `UserFields[${index}].AutodataTemplate`,
        field.autodataTemplate,
      );
    } else {
      const isRandomDate = [
        Source.RANDOMDATE,
        Source.RANDOMDATEWITHCALENDAR,
      ].includes(field.source);

      if (isRandomDate) {
        const payload: AutodataTemplateDate = {
          Template: "",
          From: "",
          To: "",
          Days: [],
        };

        fd.append(
          `UserFields[${index}].AutodataTemplate`,
          JSON.stringify(payload),
        );
      }

      if (field.source === Source.RANDOMPRICE) {
        const payload: AutoDataTemplatePrice = {
          Template: "",
          Format: null,
          Min: 0,
          Max: 10,
        };

        fd.append(
          `UserFields[${index}].AutodataTemplate`,
          JSON.stringify(payload),
        );
      }

      if (field.source === Source.RANDOMTEXT) {
        const payload: AutoDataTemplateText = {
          Template: "",
        };

        fd.append(
          `UserFields[${index}].AutodataTemplate`,
          JSON.stringify(payload),
        );
      }
    }

    return fd;
  }

  private prepairPayload(
    template: TemplatePayload,
    files: TemplateFilePayload[],
  ) {
    const fd = new FormData();

    if (template.id) {
      // if update
      fd.append("id", `${template.id}`);
      fd.append("CreateDate", template.createDate);
      fd.append("CreatorName", template.creatorName);
    }

    fd.append("name", template.name);
    fd.append("IsPublic", `${template.isPublic}`);
    fd.append("subType", `${template.subType ?? ""}`);
    fd.append("Category", `${template.category}`);

    if (template.category === Category.Doc) {
      fd.append("Doctype", `${template.docType}`);
    }

    fd.append("CountryId", `${template.countryId}`);
    fd.append("SampleTitle", `${template.sampleTitle ?? ""}`);
    fd.append("SampleText", `${template.sampleText ?? ""}`);
    fd.append("Price", `${template.price ?? "0"}`);
    fd.append("ParentTemplateId", `${template.parentTemplateId}`);

    this.prepairFields(template.userFields, fd);

    files.forEach(({ file, type, id }, index) => {
      fd.append(`Files[${index}].templateId`, `0`);
      fd.append(`Files[${index}].id`, `${id}`);
      fd.append(`Files[${index}].FileType`, `${type}`);
      fd.append(`Files[${index}].file`, file);
      fd.append(`Files[${index}].name`, file.name);
    });

    return fd;
  }

  public async getList(params: GetTemplatesParams): Promise<Response> {
    return await this.repository.getList(params);
  }

  public async get(templateId: string): Promise<Response>;
  public async get(category: number, countryId: number): Promise<Response>;
  public async get(
    templateCategoryId: number | string,
    countryId?: number,
  ): Promise<Response> {
    if (
      //prettier-ignore
      typeof templateCategoryId === "number" &&
      typeof countryId === "number"
    ) {
      return await this.repository.get(templateCategoryId, countryId);
    }

    if (typeof templateCategoryId === "string") {
      return await this.repository.get(templateCategoryId);
    }

    throw new Error("Invalid agruments passed");
  }

  public async getNewSample(params: GetNewSampleParams): Promise<Response> {
    return await this.repository.getNewSample(params);
  }

  public async getChildren(): Promise<Response> {
    return await this.repository.getChildren();
  }

  public async create(
    data: TemplatePayload,
    files: TemplateFilePayload[],
  ): Promise<Response> {
    delete data.id;

    const payload = this.prepairPayload(data, files);

    return await this.repository.create(payload);
  }

  public async update(
    data: TemplatePayload,
    files: TemplateFilePayload[],
  ): Promise<Response> {
    const payload = this.prepairPayload(data, files);

    return await this.repository.update(payload);
  }

  public async delete(id: number): Promise<Response> {
    return await this.repository.delete(id);
  }

  public async getFile(id: number): Promise<Response> {
    return await this.repository.getFile({ id });
  }

  public async getFields(file: File, fields?: UserField[]): Promise<Response> {
    const payload = new FormData();

    if (fields?.length) {
      this.prepairFields(fields, payload);
    }

    payload.set("File", file);

    return await this.repository.getFields(payload);
  }

  public async parents(): Promise<Response> {
    return await this.repository.parents();
  }
}
