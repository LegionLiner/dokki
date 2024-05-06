<template>
  <v-text-field
    v-bind="props"
    hide-details
    readonly
    required
    density="compact"
    variant="outlined"
    class="bg-white"
    :model-value="parsedDate"
    :rules="rules"
    @click="menuOpen = true"
  >
    <template #prepend-inner>
      <CalendarIcon />
      <v-menu
        offset-y
        v-model="menuOpen"
        transition="scale-transition"
        min-width="auto"
        activator="parent"
        :close-on-content-click="false"
        :close-on-back="true"
      >
        <v-date-picker v-model="localDate" />
        <!-- <DatePickerComponent :localDate="localDate"></DatePickerComponent> -->
      </v-menu>
    </template>
  </v-text-field>
</template>
<script lang="ts" setup>
import { watch, ref, computed } from "vue";
import { DEFAULT_DATE_FORMAT } from "@/types";
import { date } from "@/utils";
import { CalendarIcon } from "@components/icons";
import DatePickerComponent from "./DatePickerComponent.vue";

interface Props {
  modelValue: string | null;
  format?: string;
  rules?: Array<(v: string) => boolean>;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:model-value"]);

const menuOpen = ref<boolean>(false);
const exactFormat = computed<string>(() => props.format ?? DEFAULT_DATE_FORMAT);
const localDate = computed<Date | undefined>({
  get() {
    if (!props.modelValue) {
      return;
    }

    return stringToDate(props.modelValue);
  },
  set(date) {
    const result = date ? formatDate(date) : date;

    emit("update:model-value", result);
  },
});

const formatDate = (value: Date): string =>
  date.formatDate(value, exactFormat.value);
const stringToDate = (value: string): Date =>
  date.stringToDate(value, exactFormat.value);

const parsedDate = computed<string | undefined>(() =>
  localDate.value ? formatDate(localDate.value) : localDate.value,
);

watch(localDate, () => {
  menuOpen.value = false;
});
</script>
