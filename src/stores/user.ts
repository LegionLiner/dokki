import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Account } from "@services/types";
import type { UserType } from "@/types";

export default defineStore("user", () => {
  const userType = ref<UserType>("GUEST");
  const account = ref<Account>();
  const isLoggedIn = computed<boolean>(() => !!account.value);
  const name = computed<string | null | undefined>(() => account.value?.name);
  const email = computed<string | null | undefined>(() => account.value?.email);
  const ordersCount = computed<number | null | undefined>(
    () => account.value?.ordersCount,
  );
  const balance = computed<number | null | undefined>(
    () => account.value?.balance,
  );
  const setAccount = (newAccount?: Account) =>
    (account.value = structuredClone(newAccount));
  const setUserType = (type: UserType) => (userType.value = type);

  return {
    userType,
    setAccount,
    isLoggedIn,
    name,
    email,
    balance,
    ordersCount,
    setUserType,
  };
});
