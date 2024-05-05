<template>
  <label for="pnType">{{ $t("labels.pnType") }}</label>
  <v-select
    hide-details
    clearable
    variant="outlined"
    density="compact"
    id="pnType"
    bg-color="#fff"
    :model-value="subType"
    :label="$t(`selectPNType`)"
    :items="pnTypes"
    :disabled="disabled"
    @update:model-value="$emit(`update:subType`, $event)"
  />
  <label for="country">{{ $t("labels.country") }}</label>
  <v-select
    hide-details
    clearable
    variant="outlined"
    density="compact"
    id="country"
    bg-color="#fff"
    :model-value="countryId"
    :label="$t(`selectCountry`)"
    :items="countries"
    :loading="loading"
    @update:model-value="$emit(`update:countryId`, $event)"
  />
  <label for="price">{{ $t("labels.price") }}</label>
  <v-text-field
    density="compact"
    variant="outlined"
    hide-details
    id="price"
    bg-color="#fff"
    :model-value="price"
    :placeholder="$t(`labels.price`)"
    @update:model-value="$emit(`update:price`, $event)"
  />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { PNTypes } from "@/dict";
import type { SelectItem } from "@/types";

interface Props {
  subType?: number | null;
  countryId?: number;
  price?: number;
  disabled?: boolean;
  countries?: SelectItem[];
  loading?: boolean;
}

defineProps<Props>();
const emit = defineEmits([
  "update:subType",
  "update:countryId",
  "update:price",
]);
const pnTypes = ref<SelectItem[]>(
  PNTypes.filter(({ public: isPublic }) => isPublic).map(
    ({ id: value, name: title }) => ({
      title,
      value,
    }),
  ),
);
</script>
