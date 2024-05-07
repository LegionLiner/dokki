import { AxiosClient, Http } from "@infra/http";
import {
  AuthInfra,
  CountriesInfra,
  TemplatesInfra,
  CustomListInfra,
  OrdersInfra,
  BalanceInfra,
  AccountInfra,
  AutodataInfra,
  TranslationInfra,
  GenerateInfra,
  AddressInfra,
  SubscriptionInfra,
} from "@infra/api";
import {
  AuthService,
  AuthBearer,
  AuthStorage,
  AuthToken,
  CountriesService,
  TemplatesService,
  FAQService,
  OrdersService,
  BalanceService,
  AccountService,
  LocaleService,
  AutodataService,
  TranslationService,
  GenerateService,
  AddressService,
  SubscriptionService,
} from "@/services";
import { FAQFirebaseInfra } from "@infra/firebase";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import CustomListService from "@services/customlist/customlist_service";
import { setLocale } from "@plugins/i18n";
import type { UserType } from "@/types";

interface JwtPayloadUser extends JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

const headers = { "ngrok-skip-browser-warning": true };

const apiAxios = new AxiosClient({
  baseURL: import.meta.env.VITE_API_ADDRESS,
  headers,
});
const client = apiAxios.getInstance();
const http = new Http(apiAxios);

const auth = new AuthInfra(http);
const authBearer = new AuthBearer(client);
const authToken = new AuthToken("auth");
const authStorage = new AuthStorage(authToken);
const account = new AccountInfra(http);
const accountService = new AccountService(account);
const authService = new AuthService(
  auth,
  authStorage,
  authBearer,
  accountService,
);
const countries = new CountriesInfra(http);
const countriesService = new CountriesService(countries);
const templates = new TemplatesInfra(http);
const templatesService = new TemplatesService(templates);
const customList = new CustomListInfra(http);
const customListService = new CustomListService(customList);
const faqInfra = new FAQFirebaseInfra();
const faqService = new FAQService(faqInfra);
const orders = new OrdersInfra(http);
const ordersService = new OrdersService(orders);
const balance = new BalanceInfra(http);
const balanceService = new BalanceService(balance);
const localeService = new LocaleService("locale");
const autodata = new AutodataInfra(http);
const autodataService = new AutodataService(autodata);
const subscription = new SubscriptionInfra(http);
const subscriptionService = new SubscriptionService(subscription);

const translation = new TranslationInfra(
  new Http(
    new AxiosClient({
      baseURL: import.meta.env.VITE_TRANSLATED_API_ADDRESS,
    }),
  ),
  import.meta.env.VITE_TRANSLATED_API_KEY,
);
const translationService = new TranslationService(translation);
const generate = new GenerateInfra(http);
const generateService = new GenerateService(generate);
const address = new AddressInfra(http);
const addressService = new AddressService(address);

const isJWTValid = (token: string): boolean => {
  if (!token) {
    return false;
  }

  const jwtData = jwtDecode<JwtPayload>(token);
  const expires = jwtData?.exp ?? 0;

  return new Date().getTime() / 1000 < expires;
};

export const resoreLocalSettings = () => {
  const locale = localeService.restoreLocale();

  setLocale(locale);
};

export const restoreLocalToken = async (): Promise<void> => {
  const token = authStorage.getToken();

  if (!token) {
    return;
  }

  if (!isJWTValid(token)) {
    return;
  }

  authStorage.storeToken(token);
  authBearer.set(token);

  const account = await authService.fetchUser();

  if (account) {
    const jwtData = jwtDecode<JwtPayloadUser>(token);
    const {
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roleRaw,
    } = jwtData;

    let role: UserType = "USER";

    if (roleRaw === "Administrator") {
      role = "ADMIN";
    }

    authStorage.setAccount(account, role);
  }
};

export {
  authService,
  authToken,
  countriesService,
  templatesService,
  customListService,
  faqService,
  ordersService,
  balanceService,
  accountService,
  localeService,
  autodataService,
  translationService,
  generateService,
  client as axiosInstance,
  addressService,
  subscriptionService,
};
