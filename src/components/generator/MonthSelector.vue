<template>
  <v-radio-group
    :model-value="selected"
    inline
    hide-details
    @update:model-value="$emit(`update:modelValue`, $event)"
  >
    <v-radio
      v-for="month in croppedMonths"
      density="compact"
      class="mr-2"
      :key="month.value"
      :value="month.value"
      :label="month.title"
    />
  </v-radio-group>
</template>
<script lang="ts" setup>
import { computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { YearMonth } from "@/dict";
import { type SelectItem } from "@/types";

interface Props {
  modelValue: string | null;
}

type SelectMonthItem = SelectItem<string>;

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const MONTHS_WAYBACK = 3;

const { t } = useI18n();
const months = computed<SelectMonthItem[]>(() =>
  YearMonth.map(({ id, marker }) => ({
    value: `${id}`,
    title: t(marker),
  })),
);
const croppedMonths = computed<SelectMonthItem[]>(() => {
  const currentMonth = new Date().getMonth();
  const start = currentMonth - MONTHS_WAYBACK;
  const end = currentMonth;
  let result: SelectMonthItem[] = [];

  if (start < 0) {
    const tail = months.value.slice(start);

    result = months.value.toSpliced(0, 0, ...tail).slice(0, MONTHS_WAYBACK);
  } else {
    result = months.value.slice(start, end);
  }

  // correct value as staying on index (starting from 1)
  return result.map((item, index) => ({ ...item, value: `${index + 1}` }));
});
const selected = computed<string>(() => {
  if (!props.modelValue) {
    const [last] = croppedMonths.value.slice(-1);

    nextTick(() => emit(`update:modelValue`, last.value));

    return last.value;
  }

  return props.modelValue;
});
</script>
