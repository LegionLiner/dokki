<template>
  <label for="user-field-template-resultline-child">
    {{ $t("labels.childTemplate") }}
  </label>
  <v-select
    hide-details
    density="compact"
    bg-color="#fff"
    variant="outlined"
    id="user-field-template-resultline-child"
    :model-value="childTemplateId"
    :placeholder="$t(`labels.childTemplate`)"
    :loading="loading"
    :items="items"
    @update:model-value="$emit(`update:childTemplateId`, $event)"
  />
  <label for="user-field-template-resultline-line">
    {{ $t("labels.resultLineNumber") }}
  </label>
  <v-text-field
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-template-resultline-line"
    bg-color="#fff"
    :model-value="childTemplateResultLine"
    @update:model-value="
      $emit(`update:childTemplateResultLine`, Number($event))
    "
  />
  <label for="user-field-template-format">
    {{ $t("labels.format") }}
  </label>
  <v-text-field
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-template-format"
    bg-color="#fff"
    :model-value="autodataTemplate"
    @update:model-value="$emit(`update:autodataTemplate`, $event)"
  />
</template>
<script lang="ts" setup>
import { type SelectItem } from "@/types";

interface Props {
  items?: SelectItem[];
  loading?: boolean;
  autodataTemplate?: string | null;
  childTemplateId?: number | null;
  childTemplateResultLine?: number | null;
}

defineProps<Props>();
const emit = defineEmits([
  "update:childTemplateId",
  "update:childTemplateResultLine",
  "update:autodataTemplate",
]);
</script>
