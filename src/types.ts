import type { Category as CategoryType, Template } from "@services/types";
import type { DefineComponent } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";

export type UserType = "USER" | "GUEST" | "ADMIN";

export type Locale = "en" | "ru";

export type SelectItem<T = number> = {
  title: string;
  value: T;
};

export type NewTemplate = Omit<
  Template,
  "category" | "docType" | "countryId" | "price"
> & {
  category?: CategoryType;
  docType?: number;
  countryId?: number;
  price?: number;
};

export interface AutodataTemplateDate {
  Template: string;
  From: string;
  To: string;
  Days: number[];
}

export interface AutoDataTemplatePrice {
  Template: string;
  Format: string | null;
  Min: number;
  Max: number;
}

export interface AutoDataTemplateText {
  Template: string;
}

export type AutodataTemplate =
  | AutodataTemplateDate
  | AutoDataTemplatePrice
  | AutoDataTemplateText;

export const isAutodataTemplate = (data: unknown): data is AutodataTemplate => {
  if (typeof data === "object" && data !== null) {
    return ["Template", "From", "To", "Days", "Format", "Min", "Max"].some(
      (key) => Object.hasOwn(data, key),
    );
  }

  return false;
};

export const DEFAULT_NEW_FILE_ID = -2;

export const DEFAULT_DATE_TEMPLATE = "dd/MM/yyyy";
export const DEFAULT_DATE_FORMAT = "dd/LL/yyyy";
export const RANDOMIZED_DATE_FORMAT = "dd.LL.yyyy";

export interface Menu {
  title: string;
  value: string;
  icon: DefineComponent<{}, {}, any> | string;
  to?: LocationAsRelativeRaw;
  children?: Menu[];
  divider?: never;
}

export interface Divider {
  divider: boolean;
}

export enum Category {
  Doc = 0,
  MRZ = 1,
  AAMVA = 2,
  PN = 3,
  ParentTemplate = 4,
}

export interface FieldLangParams {
  id: string | null;
  lang: string | null;
  connectT: string | null;
  W: string | null;
  H: string | null;
}

export interface Tag {
  readonly dobUser?: boolean | string;
  readonly doiUser?: boolean | string;
  readonly dateSource?: string;
  readonly dateRange?: string;
  readonly format?: string;
  readonly len?: string;
}
