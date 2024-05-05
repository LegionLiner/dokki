import type {
  Category,
  FileType,
  Template,
  FaqItem,
  TemplateShort,
} from "@services/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface GetTemplatesParams {
  pageSize: number;
  start: number;
  countryId?: number | null;
  docType?: number | null;
}

export interface GetAdminOrdersParams {
  pageSize: number;
  start: number;
  countryId?: number | null;
  docType?: number | null;
  username?: string;
}

export interface GetClientOrdersParams {
  pageSize: number;
  start: number;
  countryId?: number | null;
  docType?: number | null;
}

export interface BalanceParams {
  email: string;
}

export interface BalancePayload {
  email: string;
  amount: string;
  comment: string;
}

export interface GetNewSampleParams {
  category: Category;
  subtype: number;
}

export interface CustomListParams {
  start?: number;
  pageSize?: number;
}

export type TemplatePayload = Omit<Template, "id"> & {
  id?: number;
};

export interface TemplateFilePayload {
  file: File;
  type: FileType;
  id: number;
}

export interface ResponseError {
  message: string;
  code: number;
}

export interface ResponseMeta {
  status: number;
  success: boolean;
  message: string;
  errors: ResponseError[];
}

export interface Response {
  data: unknown;
  meta: ResponseMeta;
}

export interface FAQInfra {
  get(): Promise<Response>;
  store(data: FaqItem[]): Promise<Response>;
}

export interface TemplateFileParams {
  id: number;
}

export interface OrderCreatePayload extends TemplateShort {}

export enum Gender {
  MALE = "M",
  FEMALE = "F",
}

export interface AutodataNameParams {
  gender?: Gender;
  country?: number;
  count: number;
}

export interface AutodataCityParams {
  country?: number;
  count: number;
}

export interface TranslationParams {
  q: string;
  langpair: string;
}

export type GenerateCodePayload = Pick<TemplateShort, "templateId" | "fields">;

export interface GetAddressParams {
  countryId: number;
  city?: string;
}
