<template>
  <v-autocomplete
    hide-details
    clearable
    variant="outlined"
    density="compact"
    bg-color="#fff"
    :items="countries"
    :label="$t(`selectCountry`)"
  />
</template>
<script lang="ts" setup>
import type { SelectItem } from "@/types";
import { computed } from "vue";

interface Props {
  items?: SelectItem<string>[];
}

const props = defineProps<Props>();
const countries = computed<string[]>(() =>
  Array.isArray(props.items) ? props.items.map(({ title }) => title) : [],
);
</script>
