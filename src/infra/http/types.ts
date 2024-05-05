import type { AxiosRequestConfig, Method } from "axios";

export interface RequestSignature {
  url: string;
  method?: Method;
  data?: unknown;
  params?: unknown;
  config?: AxiosRequestConfig<unknown>;
}
