import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { LoginPayload } from "@infra/types";
import type { AuthInfra } from "@infra/api";
import type { Response } from "@infra/http";
import {
  isAccountBody,
  isLoginResponseBody,
  type Account,
} from "@services/types";
import type { AuthStorage, AuthBearer, AccountService } from "@/services";
import type { UserType } from "@/types";

interface JwtPayloadUser extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

export default class AuthService {
  constructor(
    private repository: AuthInfra,
    private storage: AuthStorage,
    private bearer: AuthBearer,
    private account: AccountService,
  ) {}

  private storeToken(token: string) {
    this.storage.storeToken(token);
    this.bearer.set(token);
  }

  private storeAccount(account?: Account, type?: UserType) {
    this.storage.setAccount(account, type);
  }

  public async fetchUser(): Promise<Account | undefined> {
    const response = await this.account.get();
    const { data } = response;

    if (isAccountBody(data)) {
      return data;
    }
  }

  public async login(payload: LoginPayload): Promise<Response> {
    const response = await this.repository.login(payload);
    const { meta, data } = response;
    const { success } = meta;

    if (success) {
      if (isLoginResponseBody(data)) {
        const {
          token: { token },
        } = data;

        this.storeToken(token);

        const account = await this.fetchUser();

        if (account) {
          const jwtData = jwtDecode<JwtPayloadUser>(token);
          const {
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
              roleRaw,
          } = jwtData;

          let role: UserType = "USER";

          if (roleRaw === "Administrator") {
            role = "ADMIN";
          }

          this.storeAccount(account, role);
        }
      }
    }

    return response;
  }

  public async register(payload: LoginPayload): Promise<Response> {
    return await this.repository.register(payload);
  }

  public async logout(): Promise<void> {
    this.storeToken("");
    this.storeAccount();
    this.bearer.remove();
  }
}
