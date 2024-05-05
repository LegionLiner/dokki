import type { FieldLangParams } from "@/types";

const parseFieldParams = (value: string | null): FieldLangParams => {
  const entries = ["en=", "id=", "W=", "H="];
  const makeEmpty =
    value === null || !entries.some((sought) => value.includes(sought));

  if (makeEmpty) {
    return {
      id: null,
      W: null,
      H: null,
      lang: null,
      connectT: null,
    };
  }

  const params = new URLSearchParams(value);
  const id = params.get("id");
  const W = params.get("W");
  const H = params.get("H");
  const lang = params.get("lang");
  const connectT = params.get("connectT");

  return { id, W, H, lang, connectT };
};

export default parseFieldParams;
