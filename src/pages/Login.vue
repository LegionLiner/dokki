<template>
  <div class="login w-100">
    <v-form
      v-model="valid"
      class="d-flex flex-column pa-6 w-100 gr-4"
      @submit.prevent="submit"
    >
      <div class="login__logo align-self-center my-5">
        <img
          src="@assets/img/welcome_dokki.png"
          alt=""
          class="login__logo-img"
        />
      </div>
      <div class="login__form">
        <v-text-field
          required
          v-model="payload.email"
          type="email"
          density="compact"
          bg-color="#fff"
          :rules="loginRules"
          :label="$t(`email`)"
        />
        <v-text-field
          required
          v-model="payload.password"
          bg-color="#fff"
          density="compact"
          type="password"
          :rules="passwordRules"
          :label="$t(`password`)"
        />
      </div>
      <div class="login__new">
        <router-link :to="{ name: `register` }">
          {{ $t("newAccount") }}
        </router-link>
      </div>
      <v-btn
        type="submit"
        color="primary"
        :disabled="!valid"
        :loading="loading"
        :style="{
          fontSize: `1rem`,
        }"
        >{{ $t("doLogin") }}</v-btn
      >
    </v-form>
  </div>
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification";
import { authService } from "@/bootstrap";
import type { LoginPayload } from "@/infra/types";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const valid = ref<boolean>(false);
const loading = ref<boolean>(false);
const payload = reactive<LoginPayload>({
  email: "",
  password: "",
});
const loginRules = [
  (value: string) => !!value || t("rules.required"),
  (value: string) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value,
    ) || t("rules.email"),
];
const passwordRules = [(value: string) => !!value || t("rules.required")];

const submit = async () => {
  loading.value = true;

  const response = await authService.login(payload);
  const { meta } = response;
  const { message, success } = meta;

  if (!success) {
    loading.value = false;

    return toast.error(message);
  }

  return router.push({ name: "index" });
};
</script>

<style lang="scss">
.login {
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;

  &__logo {
    max-width: 120px;

    &-img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  &__form .v-input--density-compact {
    .v-field__outline {
      --v-border-color: rgba(205, 221, 245, 1);
      --v-field-border-opacity: 1;
      * {
        border-color: rgba(205, 221, 245, 1);

        *::after, *::before {
          border-color: rgba(205, 221, 245, 1)red;
        }
      }
      &__notch::after {
        border-color: rgba(205, 221, 245, 1);
      }
      &__notch::before {
        border-color: rgba(205, 221, 245, 1);
      }
    }
    .v-field__input {
        border-radius: 10px;
        background: white !important;
    }
  }
}
</style>
