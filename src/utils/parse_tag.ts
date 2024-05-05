import { camelCase } from "lodash";
import type { Tag } from "@/types";

export const parseTag = (tag: string | null): Tag | undefined => {
  if (!tag) {
    return;
  }

  return Object.fromEntries(
    tag
      .split("&")
      .filter((string) => !!string)
      .map((string) => {
        const [k, v] = string.split("=");
        const key = camelCase(k);

        if ([undefined, "on"].includes(v)) {
          return [key, true];
        }

        if (v === "off") {
          return [key, false];
        }

        return [key, v];
      }),
  );
};
