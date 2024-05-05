import type { Source } from "@dict/sources";
import type { Response } from "@infra/http";

import { Category } from "@/types";

export { Category };

export interface SuccessResponseBody {
  isSuccess: boolean;
  errorText: string | null;
  message: string;
  data: unknown;
}

export interface Token {
  token: string;
  expiration: string;
}

export interface LoginResponseBody extends SuccessResponseBody {
  token: Token;
}

export interface LoginResponse extends Response {
  data: LoginResponseBody;
}

export const isLoginResponseBody = (
  data: unknown,
): data is LoginResponseBody => {
  if (typeof data === "object" && data !== null) {
    if (
      "isSuccess" in data &&
      typeof data.isSuccess === "boolean" &&
      data.isSuccess
    ) {
      if (
        "token" in data &&
        typeof data.token === "object" &&
        data.token !== null
      ) {
        return "token" in data.token;
      }
    }
  }

  return false;
};

export interface Country {
  id: number;
  name: string;
  codeA2: string;
  codeA3: string;
}

export interface CountriesResponseBody {
  countries: Country[];
}

export interface CountriesResponse extends Response {
  data: CountriesResponseBody;
}

export const isCountryResponseBody = (
  data: unknown,
): data is CountriesResponseBody => {
  if (typeof data === "object" && data !== null) {
    return "countries" in data && Array.isArray(data.countries);
  }

  return false;
};

export enum FileType {
  Project = 1,
  Image = 5,
  Input = 3,
}

export enum OperationType {
  Deposit = 0,
  Withdrawal = 1,
}

export enum Status {
  Created = 0,
  Pending = 1,
  Processing = 2,
  Done = 3,
  Error = 4,
}

export enum DocType {
  ID = 0,
  Passport = 1,
  Bill = 2,
  DrivingLicense = 3,
  ResidencePermit = 4,
  Statement = 5,
  CreditCard = 6,
  Other = 7,
}

export interface TemplateFile {
  templateId: number;
  file: null;
  id: number;
  name: string;
  fileType: FileType | null;
}

export interface UserField {
  id: number;
  name: string;
  fieldName: string;
  isFile: boolean;
  source: Source;
  tag: string | null;
  autodataTemplate: string | null;
  displayOrder: number;
  needToReverseText: boolean;
  defaultValue: string | null;
  isHidden: boolean;
  customListId: number | null;
  childTemplateId: number | null;
  childTemplateResultLine: number | null;
}
export interface Template {
  id: number;
  name: string;
  createDate: string;
  isPublic: boolean;
  creatorName: string;
  category: Category;
  docType: DocType;
  subType: null | number;
  countryId: number;
  country: string;
  price: number;
  sampleTitle: null | string;
  sampleText: null | string;
  userFields: UserField[];
  parentTemplateId: number;
  files: TemplateFile[];
}

export interface TemplatesResponseBody {
  count: number;
  templates: Template[];
}

export interface TemplatesResponse extends Response {
  data: TemplatesResponseBody;
}

export const isTemplatesResponseBody = (
  data: unknown,
): data is TemplatesResponseBody => {
  if (typeof data === "object" && data !== null) {
    return "templates" in data && Array.isArray(data.templates);
  }

  return false;
};

// same as Template
export interface TemplateResponseBody extends Template {}

export interface TemplateResponse extends Response {
  data: TemplateResponseBody;
}

export const isTemplateResponseBody = (
  data: unknown,
): data is TemplateResponseBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "id" in data && typeof data.id === "number" &&
      "userFields" in data && Array.isArray(data.userFields)
    );
  }

  return false;
};

export interface CustomList {
  id: number;
  createDate: string;
  name: string;
  items: null;
}
export interface CustomListBody {
  count: number;
  lists: CustomList[];
}

export interface CustomListResponse extends Response {
  data: CustomListBody;
}

export const isCustomListBody = (data: unknown): data is CustomListBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "count" in data && typeof data.count === "number" &&
      "lists" in data && Array.isArray(data.lists)
    );
  }

  return false;
};

export interface TemplateChild {
  id: number;
  name: string;
  createDate: string;
  isPublic: false;
  creatorName: null;
  category: 0;
  docType: null;
  subType: null;
  countryId: 0;
  country: null;
  price: 0;
  sampleTitle: null;
  sampleText: null;
  userFields: null;
  files: null;
}

export interface TemplateChildrenBody {
  count: number;
  templates: TemplateChild[];
}

export interface TemplateChildrenBodyResponse extends Response {
  data: TemplateChildrenBody;
}

export const isTemplateChildrenResponseBody = (
  data: unknown,
): data is TemplateChildrenBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "count" in data && typeof data.count === "number" &&
      "templates" in data && Array.isArray(data.templates)
    );
  }

  return false;
};

export interface FaqItem {
  answer: string;
  id: string;
  name: string;
  children?: FaqItem[];
}

export type FaqResponseBody = FaqItem[];

export interface FaqResponse extends Response {
  data: FaqResponseBody;
}

export const isFaqResponseBody = (data: unknown): data is FaqResponseBody => {
  if (Array.isArray(data) && data.length > 0) {
    const [first] = data;

    // prettier-ignore
    return (
      "answer" in first && typeof first.answer === "string" &&
      "id" in first && typeof first.id === "string" &&
      "name" in first && typeof first.name === "string"
    );
  }

  return false;
};

export interface UploadedFile {
  virtualFileId: number;
  oneTimeToken: string;
  file: null;
  id: number;
  name: string;
  fileType: number;
}

export interface Order {
  id: number;
  orderNumber: number;
  templateId: number | null;
  date: string;
  category: Category;
  docType: DocType;
  userName: string;
  country: string;
  count: number;
  price: number;
  amount: number;
  status: Status;
  files: UploadedFile[] | null;
}

export interface OrderListBody {
  count: number;
  orders: Order[];
}

export interface OrderListResponse extends Response {
  data: OrderListBody;
}

export const isOrderListBody = (data: unknown): data is OrderListBody => {
  if (typeof data === "object" && data !== null) {
    if ("count" in data && typeof data.count === "number") {
      return "orders" in data && Array.isArray(data.orders);
    }
  }

  return false;
};

export interface OrderBody extends Order {}

export interface OrderResponse extends Response {
  data: OrderBody;
}

export const isOrderBody = (data: unknown): data is OrderBody => {
  if (typeof data === "object" && data !== null) {
    // prettier-ignore
    return (
      "id" in data &&
      "orderNumber" in data &&
      "date" in data &&
      "status" in data
    );
  }

  return false;
};

export interface Balance {
  userName: string | null;
  email: string;
  balance: number;
  isSuccess: boolean;
  errorText: string | null;
}

export interface GetBalanceBody extends Balance {}

export interface GetBalanceResponse extends Response {
  data: GetBalanceBody;
}

export const isGetBalanceBody = (data: unknown): data is GetBalanceBody => {
  if (typeof data === "object" && data !== null) {
    // prettier-ignore
    return (
      "isSuccess" in data && typeof data.isSuccess === "boolean" &&
      "userName" in data &&
      "email" in data &&
      "balance" in data &&
      "errorText" in data
    );
  }

  return false;
};

export interface SetBalanceBody {
  isSuccess: boolean;
  errorText: string | null;
}

export interface SetBalanceResponse extends Response {
  data: SetBalanceBody;
}

export const isSetBalanceBody = (data: unknown): data is SetBalanceBody => {
  if (typeof data === "object" && data !== null) {
    if ("isSuccess" in data && typeof data.isSuccess === "boolean") {
      return "errorText" in data;
    }
  }

  return false;
};

export interface Account {
  name: string | null;
  email: string;
  balance: number;
  ordersCount: number;
}

export interface AccountBody extends Account {}

export interface AccountResponse extends Response {
  data: AccountBody;
}

export const isAccountBody = (data: unknown): data is AccountBody => {
  if (typeof data === "object" && data !== null) {
    // prettier-ignore
    return (
      "email" in data && typeof data.email === "string" &&
      "name" in data &&
      "balance" in data &&
      "ordersCount" in data
    );
  }

  return false;
};

export interface BalanceHistoryItem {
  date: string;
  amount: number;
  balance: number;
  operationType: OperationType;
  enrollersName: string;
  comment: string;
}

export interface BalanceHistory {
  balance: {
    balance: number;
  };
  count: number;
  history: BalanceHistoryItem[];
}

export interface BalanceHistoryBody extends BalanceHistory {}

export interface BalanceHistoryResponse extends Response {
  data: BalanceHistoryBody;
}

export const isBalanceHistoryBody = (
  data: unknown,
): data is BalanceHistoryBody => {
  if (typeof data === "object" && data !== null) {
    // prettier-ignore
    return (
      "balance" in data && typeof data.balance === "object" &&
      data.balance !== null && "balance" in data.balance &&
      "count" in data &&
      "history" in data && Array.isArray(data.history)
    );
  }

  return false;
};

export interface UserFieldValue {
  id: number;
  created: string;
  value: string;
  description: string | null;
}

export interface UserFieldShort {
  id: number;
  name: string;
  fieldName: string;
  isFile: boolean;
  source: Source;
  displayOrder: number;
  needToReverseText: boolean;
  tag: string | null;
  values: UserFieldValue[] | null;
  childTemplateId: number;
  subFields: UserFieldShort[] | null;
  value: string | null;
  file: File | null;
}
export interface TemplateShort {
  templateId: number;
  templateName: string;
  price: number;
  count: number;
  sampleTitle: string;
  sampleText: string;
  previewFileId: number;
  countryId: number;
  docType: DocType;
  canGenerate: boolean;
  fields: UserFieldShort[];
}

export interface TemplateShortBody extends TemplateShort {}

export interface TemplateShortResponse extends Response {
  data: TemplateShortBody;
}

export const isTemplateShortBody = (
  data: unknown,
): data is TemplateShortBody => {
  if (typeof data === "object" && data !== null) {
    // prettier-ignore
    return (
      "templateId" in data && typeof data.templateId === "number" &&
      "templateName" in data && typeof data.templateName === "string" &&
      "countryId" in data && typeof data.countryId === "number" &&
      "fields" in data && Array.isArray(data.fields)
    );
  }

  return false;
};

export interface AutodataName {
  id: number;
  gender: number;
  name: string;
  lastName: string;
  middleName: string | null;
  countryId: number;
}

export interface AutodataNameBody {
  names: AutodataName[];
}

export interface AutodataNameResponse extends Response {
  data: AutodataNameBody;
}

export const isAutodataNameBody = (data: unknown): data is AutodataNameBody => {
  if (typeof data === "object" && data !== null) {
    return "names" in data && Array.isArray(data.names);
  }

  return false;
};

export interface AutodataDate {
  dateString: string;
}

export interface AutodataDateBody extends AutodataDate {}

export interface AutodataDateResponse extends Response {
  data: AutodataDateBody;
}

export const isAutodataDateBody = (data: unknown): data is AutodataDateBody => {
  if (typeof data === "object" && data !== null) {
    return "dateString" in data && typeof data.dateString === "string";
  }

  return false;
};

export interface AutodataPrice {
  priceString: string;
}

export interface AutodataPriceBody extends AutodataPrice {}

export interface AutodataPriceResponse extends Response {
  data: AutodataPriceBody;
}

export const isAutodataPriceBody = (
  data: unknown,
): data is AutodataPriceBody => {
  if (typeof data === "object" && data !== null) {
    return "priceString" in data && typeof data.priceString === "string";
  }

  return false;
};

export interface AutodataText {
  text: string;
}

export interface AutodataTextBody extends AutodataText {}

export interface AutodataTextResponse extends Response {
  data: AutodataTextBody;
}

export const isAutodataTextBody = (data: unknown): data is AutodataTextBody => {
  if (typeof data === "object" && data !== null) {
    return "text" in data && typeof data.text === "string";
  }

  return false;
};

export interface City {
  name: string;
}

export interface AutodataCity {
  cities: City[];
}

export interface AutodataCityBody extends AutodataCity {}

export interface AutodataCityResponse extends Response {
  data: AutodataCityBody;
}

export const isAutodataCityBody = (data: unknown): data is AutodataCityBody => {
  if (typeof data === "object" && data !== null) {
    return "cities" in data && Array.isArray(data.cities);
  }

  return false;
};

export interface TranslatedResponseData {
  translatedText: string;
  match: number;
}
export interface TranslatedMatch {
  id: number;
  segment: string;
  translation: string;
  source: string;
  target: string;
  quality: number;
  reference: string;
  "usage-count": number;
  subject: boolean;
  "created-by": string;
  "last-updated-by": string;
  "create-date": string;
  "last-update-date": string;
  match: number;
  model: string;
}

export interface TranslatedBody {
  responseData: TranslatedResponseData;
  matches: TranslatedMatch[];
  quotaFinished: boolean;
  mtLangSupported: boolean | null;
  responseDetails: string;
  responseStatus: number;
  responderId: number | null;
  exception_code: number | null;
}

export interface TranslatedResponse extends Response {
  data: TranslatedBody;
}

export const isTranslatedBody = (data: unknown): data is TranslatedBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "responseData" in data && typeof data.responseData === "object" && data.responseData !== null &&
      "matches" in data && Array.isArray(data.matches)
    );
  }

  return false;
};

export interface GenerateCodeResponse extends Response {
  data: string;
}

export const isGenerateCodeBody = (data: unknown): data is string =>
  ["string", "number"].includes(typeof data);

export interface CreateOrderBody {
  id: number;
  isSuccess: boolean;
  errorText: string | null;
}

export interface CreateOrderResponse extends Response {
  data: CreateOrderBody;
}

export const isCreateOrderBody = (data: unknown): data is CreateOrderBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "isSuccess" in data && typeof data.isSuccess === "boolean" &&
      "id" in data && typeof data.id === "number"
    );
  }

  return false;
};

export interface GeneratedFieldsBody {
  fields: UserField[];
  file: null;
}

export interface GeneratedFieldsResponse extends Response {
  data: GeneratedFieldsBody;
}

export const isGeneratedFields = (
  data: unknown,
): data is GeneratedFieldsBody => {
  if (typeof data === "object" && data !== null) {
    return "fields" in data && Array.isArray(data.fields);
  }

  return false;
};

export interface Address {
  id: number;
  countryId: number;
  country: string;
  city: string;
  street: string;
  house: string;
  postCode: string;
  state: string | null;
}

export interface AddressBody extends Address {}

export interface GetAddressResponse extends Response {
  data: AddressBody;
}

export const isAddressBody = (data: unknown): data is AddressBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "country" in data && typeof data.country === "string" &&
      "city" in data && typeof data.country === "string" &&
      "street" in data && typeof data.street === "string" &&
      "house" in data && typeof data.house === "string" &&
      "postCode" in data && typeof data.postCode === "string"
    )
  }

  return false;
};

export interface ParentTemplate {
  id: number;
  name: string;
  createDate: string;
  isPublic: boolean;
  creatorName: null;
  category: number;
  docType: null;
  subType: null;
  countryId: number;
  country: null;
  price: number;
  sampleTitle: null;
  sampleText: null;
  parentTemplateId: number;
  userFields: null;
  files: null;
}

export interface ParentTemplatesBody {
  count: number;
  templates: ParentTemplate[];
}

export interface ParentTemplatesResponse extends Response {
  data: ParentTemplatesBody;
}

export const isParentTemplatesBody = (
  data: unknown,
): data is ParentTemplatesBody => {
  if (typeof data === "object" && data !== null) {
    //prettier-ignore
    return (
      "count" in data && typeof data.count === "number" &&
      "templates" in data && Array.isArray(data.templates)
    )
  }

  return false;
};
