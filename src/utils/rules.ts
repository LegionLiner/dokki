export const required = (v?: string | null): boolean => !!v;
export const noSpaces = (v?: string | null): boolean => {
  if (!v) {
    return false;
  }

  return !!v.trim();
};
export const min = (min: number, v: number): boolean => v >= min;
export const max = (max: number, v: number): boolean => v <= max;
export const minClosure =
  (mn: number) =>
  (v: number): boolean =>
    min(mn, v);
export const maxClosure =
  (mx: number) =>
  (v: number): boolean =>
    max(mx, v);
export const minMax =
  (mn: number, mx: number) =>
  (v: number): boolean =>
    min(mn, v) && max(mx, v);
export const minMaxLength = (v: string, min: number, max: number) =>
  v.length <= max && v.length >= min;
export const minMaxLengthClosure =
  (min: number, max: number) =>
  (v?: string | null): boolean => {
    if (!v) {
      return false;
    }

    return minMaxLength(v, min, max);
  };
