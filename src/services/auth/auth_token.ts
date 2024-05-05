export default class AuthToken {
  private token: string = "";

  constructor(private key: string) {}

  public get(): string {
    if (!this.token) {
      this.token = localStorage.getItem(this.key) ?? "";
    }

    return this.token;
  }

  public store(token: string) {
    this.token = token;

    localStorage.setItem(this.key, String(this.token));
  }

  public clear() {
    if (this.token) {
      this.token = "";
      localStorage.removeItem(this.key);
    }
  }
}
