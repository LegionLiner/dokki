export enum Source {
  USER_TEXT = 1,
  USER_PHOTO = 2,
  USER_SIGNATURE = 3,
  RANDOMPHOTO = 4,
  RANDOMNAME = 5,
  USER_MONTHSELECTOR = 6,
  RANDOMDATE = 7,
  RANDOMPRICE = 8,
  USER_DATESELECTOR = 9,
  USER_GENDERSELECTOR = 10,
  RANDOMLASTNAME = 11,
  RANDOMCITY = 12,
  RANDOMTEXT = 13,
  RANDOMDATEWITHCALENDAR = 14,
  USER_COUNTRYSELECTOR = 15,
  RANDOMCUSTOMLIST = 16,
  USER_BOOLSELECTOR = 17,
  TEMPLATE_RESULTLINE = 18,
  TEMPLATE = 19,
  RANDOMFULLNAME = 20,
  TEMPLATE_RESULTLINE_MRZ = 21,
  TEMPLATE_RESULTLINE_PN = 22,
  RANDOMADDRESS = 23,
  TEMPLATE_MRZ = 24,
  TEMPLATE_PN = 25,
  RANDOMCUSTOMLIST_WITHBUTTON = 26,
}

export interface SourceItem {
  title: string;
  value: number;
}

export default <SourceItem[]>[
  {
    title: "RandomAddress",
    value: Source.RANDOMADDRESS,
  },
  {
    title: "RandomCity",
    value: Source.RANDOMCITY,
  },
  {
    title: "RandomCustomList",
    value: Source.RANDOMCUSTOMLIST,
  },
  {
    title: "RandomCustomList_WithButton",
    value: Source.RANDOMCUSTOMLIST_WITHBUTTON,
  },
  {
    title: "RandomDate",
    value: Source.RANDOMDATE,
  },
  {
    title: "RandomDateWithCalendar",
    value: Source.RANDOMDATEWITHCALENDAR,
  },
  {
    title: "RandomFullName",
    value: Source.RANDOMFULLNAME,
  },
  {
    title: "RandomLastName",
    value: Source.RANDOMLASTNAME,
  },
  {
    title: "RandomName",
    value: Source.RANDOMNAME,
  },
  {
    title: "RandomPhoto",
    value: Source.RANDOMPHOTO,
  },
  {
    title: "RandomPrice",
    value: Source.RANDOMPRICE,
  },
  {
    title: "RandomText",
    value: Source.RANDOMTEXT,
  },
  {
    title: "Template",
    value: Source.TEMPLATE,
  },
  {
    title: "Template_ResultLine",
    value: Source.TEMPLATE_RESULTLINE,
  },
  {
    title: "Template_ResultLine_MRZ",
    value: Source.TEMPLATE_RESULTLINE_MRZ,
  },
  {
    title: "Template_ResultLine_PN",
    value: Source.TEMPLATE_RESULTLINE_PN,
  },
  {
    title: "User_BoolSelector",
    value: Source.USER_BOOLSELECTOR,
  },
  {
    title: "User_CountrySelector",
    value: Source.USER_COUNTRYSELECTOR,
  },
  {
    title: "User_DateSelector",
    value: Source.USER_DATESELECTOR,
  },
  {
    title: "User_GenderSelector",
    value: Source.USER_GENDERSELECTOR,
  },
  {
    title: "User_MonthSelector",
    value: Source.USER_MONTHSELECTOR,
  },
  {
    title: "User_Photo",
    value: Source.USER_PHOTO,
  },
  {
    title: "User_Signature",
    value: Source.USER_SIGNATURE,
  },
  {
    title: "User_Text",
    value: Source.USER_TEXT,
  },
];
