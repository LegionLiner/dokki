import { DocType as DocTypeEnum } from "@services/types";
import type { DocType } from "@dict/types";

const docTypes: DocType[] = [
  {
    id: DocTypeEnum.ID,
    marker: "docType.idCard",
  },
  {
    id: DocTypeEnum.Passport,
    marker: "docType.passport",
  },
  {
    id: DocTypeEnum.Bill,
    marker: "docType.utilityBill",
  },
  {
    id: DocTypeEnum.DrivingLicense,
    marker: "docType.drivingLicense",
  },
  {
    id: DocTypeEnum.ResidencePermit,
    marker: "docType.residencePermit",
  },
  {
    id: DocTypeEnum.Statement,
    marker: "docType.statement",
  },
  {
    id: DocTypeEnum.CreditCard,
    marker: "docType.creditCard",
  },
  {
    id: DocTypeEnum.Other,
    marker: "docType.other",
  },
];

export default docTypes;
