import { DocType as DocTypeEnum, Status as StatusEnum } from "@services/types";
export { type SourceItem, Source } from "@dict/sources";

export interface MarkeredItem<T = number> {
  id: T;
  marker: string;
}

export interface DocType extends MarkeredItem<DocTypeEnum> {}

export interface Category {
  id: number;
  name: string;
}

export interface MRZType extends Category {}
export interface PNType extends Category {
  public: boolean;
}

export interface DayWeek extends MarkeredItem {}

export interface YearMonth extends MarkeredItem {}

export interface Status extends MarkeredItem<StatusEnum> {}
