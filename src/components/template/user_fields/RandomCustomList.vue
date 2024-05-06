<template>
  <label for="user-field-random-customlist-list">
    {{ $t("labels.list") }}
  </label>
  <v-select
    id="user-field-random-customlist-list"
    hide-details
    density="compact"
    bg-color="#fff"
    variant="outlined"
    :model-value="modelValue"
    :loading="loading"
    :placeholder="$t(`labels.list`)"
    :items="items"
    @update:model-value="$emit(`update:model-value`, $event)"
  />
</template>
<script lang="ts" setup>
import type { SelectItem } from "@/types";

interface Props {
  modelValue?: number | null;
  loading?: boolean;
  items?: SelectItem[];
}

defineProps<Props>();
defineEmits(["update:model-value"]);
</script>
