import useTokenStore from "@stores/token";
import useUserStore from "@stores/user";
import pinia from "@plugins/pinia";
import type { AuthToken } from "@/services";
import type { Account } from "@services/types";
import type { UserType } from "@/types";

export default class AuthStorage {
  private _tokenStore = useTokenStore(pinia);
  private _userStore = useUserStore(pinia);

  constructor(private token: AuthToken) {}

  public getToken(): string | undefined {
    return this.token.get();
  }

  public storeToken(token: string) {
    this.token.store(token);
    this._tokenStore.setToken(token);
  }

  public clearToken() {
    this.token.clear();
    this._tokenStore.setToken();
  }

  public setAccount(account?: Account, type: UserType = "GUEST") {
    this._userStore.setAccount(account);
    this._userStore.setUserType(type);
  }
}
