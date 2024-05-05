<template>
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
import type { SelectItem } from "@/types";

interface Props {
  country?: string;
  countryId?: number;
  price?: number;
  countries?: SelectItem[];
  loading?: boolean;
}

defineProps<Props>();
defineEmits(["update:countryId", "update:price"]);
</script>
