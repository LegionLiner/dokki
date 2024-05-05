<template>
  <v-container fluid class="px-0">
    <v-row>
      <v-col cols="12" class="my-0 py-0">
        <h1 class="page-title">
          {{ $t("balanceTopUp") }}
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <div class="pr-lg-2 pr-xl-2">
          <div class="subtitle">
            <h3 class="subheader">{{ $t(`findUser`) }}</h3>
          </div>
          <v-form v-model="isEmailFormValid" :disabled="fetching" @submit.prevent="fetchBalance(email)">
            <div class="d-flex w-100 align-center flex-nowrap flex-row">
              <label for="find-email" class="mr-2">
                {{ $t(`email`) }}
              </label>
              <v-text-field v-model="email" density="compact" hide-details bg-color="#fff" id="find-email"
                rounded="0 s-lg" required :placeholder="$t(`username`)" :rules="[rules.required]" />
              <v-btn variant="elevated" color="primary" rounded="0 e-lg" height="34px" type="submit"
                :disabled="!isEmailFormValid" :loading="fetching" :text="$t(`find`)" />
            </div>
          </v-form>
          <div class="d-flex justify-space-between cursor-pointer mt-5 creds" v-if="balanceData">
            <div>{{ balanceData.email }}</div>
            <div>{{ balanceData.balance }}</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div v-if="balanceData" class="pl-lg-2 pl-xl-2">
          <div class="subtitle">
            <h3 class="subheader">
              {{ $t(`topUpBalance`) }}
            </h3>
          </div>
          <v-form v-model="isBalanceFormValid" :disabled="saving || fetching" @submit.prevent="saveBalance">
            <div class="balance mb-3">
              <div class="balance__field align-self-md-center align-self-lg-center align-self-xl-center">
                {{ $t(`email`) }}
              </div>
              <div class="balance__input">
                <v-text-field :model-value="balance.email" density="compact" hide-details bg-color="#fff" disabled
                  required :placeholder="$t(`email`)" :rules="[rules.required]" />
              </div>

              <div class="balance__field align-self-md-center align-self-lg-center align-self-xl-center">
                {{ $t(`amount`) }}
              </div>
              <div class="balance__input">
                <v-text-field v-model="balance.amount" density="compact" hide-details bg-color="#fff" required
                  :placeholder="$t(`amount`)" :rules="[rules.required]" />
              </div>

              <div class="balance__field">
                {{ $t(`comment`) }}
              </div>
              <div class="balance__input">
                <v-textarea v-model="balance.comment" density="compact" hide-details bg-color="#fff"
                  :placeholder="$t(`comment`)" />
              </div>
            </div>
            <v-btn variant="elevated" color="primary" type="submit" class="w-100" :disabled="!isBalanceFormValid"
              :loading="saving" :text="$t(`doTopUp`)" />
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import {
  isGetBalanceBody,
  type Balance,
  isSetBalanceBody,
} from "@services/types";
import { rules } from "@/utils";
import type { BalancePayload } from "@infra/types";
import { balanceService } from "@/bootstrap";

const { t } = useI18n();
const toast = useToast();
const email = ref<string>("");
const fetching = ref<boolean>(false);
const saving = ref<boolean>(false);
const isBalanceFormValid = ref<boolean>();
const isEmailFormValid = ref<boolean>();
const balanceData = ref<Balance>();
const balance = reactive<BalancePayload>({
  email: "",
  amount: "",
  comment: "",
});

const fetchBalance = async (email: string) => {
  fetching.value = true;

  const response = await balanceService.getBalance({ email });
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    fetching.value = false;

    return toast.error(message);
  }

  if (isGetBalanceBody(data)) {
    const { isSuccess, errorText } = data;

    if (isSuccess) {
      balanceData.value = data;
    } else if (errorText) {
      toast.error(errorText);
    }
  }

  fetching.value = false;
};

const saveBalance = async () => {
  saving.value = true;

  const response = await balanceService.setBalance(balance);
  const { meta, data } = response;
  const { success, message } = meta;

  if (!success) {
    saving.value = false;

    return toast.error(message);
  }

  if (isSetBalanceBody(data)) {
    const { isSuccess, errorText } = data;

    if (isSuccess) {
      toast.success(t(`successful`));
    } else if (errorText) {
      toast.error(errorText);
    }
  }

  saving.value = false;
};

watch(balanceData, (value) => {
  if (!value) {
    return;
  }

  balance.email = value.email;
});

watch(saving, (value) => {
  if (value) {
    return;
  }

  if (!balanceData.value) {
    return;
  }

  fetchBalance(balanceData.value?.email);
});
</script>
<style lang="scss">
@import "vuetify/lib/styles/settings/_variables";

.subtitle {
  margin-bottom: 10px;
}

.creds {
  background-color: #fff;
  padding: 16px;
  font-size: 1.08rem;
  border-radius: 10px;
  box-shadow: 0 0 4px #0000000a;
}

.balance {
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 20px;
  row-gap: 10px;

  &__input {
    &:not(:last-child) {
      @media (max-width: 780px) {
        margin-bottom: 12px;
      }
    }
  }

  @media (max-width: 780px) {
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
}

.v-input--density-compact {
  .v-field__outline {
    --v-border-color: rgba(205, 221, 245, 1);
    --v-field-border-opacity: 1;

    * {
      border-color: rgba(205, 221, 245, 1);

      *::after,
      *::before {
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

</style>
