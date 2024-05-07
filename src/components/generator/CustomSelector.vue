<template>
  <v-combobox
          hide-details
          clearable
          v-model="selected"
          variant="outlined"
          density="compact"
          class="v-select-white"
          :label="$t(`selectCountry`)"
          :items="items"
        >
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="item.value" />
        </template>
        </v-combobox>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import type { SelectItem } from "@/types";

type Item = SelectItem<string> | string;

interface Props {
  items?: Item[];
}

defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const selected = ref<Item>();

watch(selected, (value) => {
  let newValue;

  if (typeof value === "object") {
    newValue = value;
  } else if (typeof value === "string") {
    newValue = value;
  } else {
    newValue = null;
  }

  emit("update:modelValue", newValue);
});
</script>
