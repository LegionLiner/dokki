import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import type { RequestSignature } from "@infra/http/types";
import type { Response, ResponseMeta } from "@infra/http";

export default class AxiosClient {
  private instance: AxiosInstance;

  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config);
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }

  async request({
    url,
    method,
    data,
    config,
    params,
  }: RequestSignature): Promise<Response> {
    try {
      // console.log(url, method, data, config, params, '---', this);
      
      const response = await this.instance.request({
        url,
        method,
        data,
        params,
        ...config,
      });

      const meta: ResponseMeta = {
        status: response.status,
        success: true,
        message: "ok",
        errors: [],
      };

      return {
        data: response.data,
        meta,
      };
    } catch (error) {
      const result: Response = {
        data: {},
        meta: {
          status: 404,
          success: false,
          message: "Network unreachable",
          errors: [
            {
              code: 0,
              message: "Network unreachable",
            },
          ],
        },
      };

      if (axios.isAxiosError(error)) {
        const message = error.toJSON() as { message: string };
        const errorMessage =
          message.message === "Network Error"
            ? "Network unreachable"
            : message.message;
        const { meta } = result;
        const code = error.response?.status ?? 500;

        result.data = error.response?.data ?? {};
        meta.status = code;
        meta.message = errorMessage;
        meta.errors = [
          {
            code,
            message: errorMessage,
          },
        ];
      }

      return result;
    }
  }
}
