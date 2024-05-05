<template>
  <v-text-field
    v-bind="props"
    hide-details
    readonly
    required
    density="compact"
    variant="outlined"
    prepend-inner-icon="mdi-calendar"
    class="bg-white"
    :id="id"
    :model-value="parsedDate"
    @click="menuOpen = true"
  >
    <template #prepend-inner>
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
      </v-menu>
    </template>
  </v-text-field>
</template>
<script lang="ts" setup>
import { watch, ref, computed, nextTick } from "vue";
import { DEFAULT_DATE_FORMAT } from "@/types";
import { date } from "@/utils";

interface Props {
  modelValue?: string | null;
  id?: string;
  format?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:model-value"]);

const menuOpen = ref<boolean>(false);
const exactFormat = computed<string>(() => props.format ?? DEFAULT_DATE_FORMAT);
const localDate = computed<Date>({
  get() {
    if (props.modelValue) {
      return utcToDate(props.modelValue);
    }

    const date = new Date();

    // we do update in parent on start if empty passed
    nextTick(() => emit("update:model-value", dateToUTC(date)));

    return date;
  },
  set(date) {
    emit("update:model-value", dateToUTC(date));
  },
});

const formatDate = (value: Date): string =>
  date.formatDate(value, exactFormat.value);
const utcToDate = (value: string): Date => date.utcToDate(value);
const dateToUTC = (value: Date): string => date.dateToUTC(value) ?? "";

const parsedDate = computed<string>(() => formatDate(localDate.value));

watch(localDate, () => {
  menuOpen.value = false;
});
</script>
