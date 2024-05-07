<template>
  <label for="user-field-random-date-template">
    {{ $t("labels.template") }}
  </label>
  <v-text-field
    v-model="template.Template"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-date-template"
    bg-color="#fff"
    :placeholder="DEFAULT_DATE_TEMPLATE"
    :rules="[rules.required]"
  />
  <label for="user-field-random-date-from">
    {{ $t("labels.from") }}
  </label>
  <DatePicker
    v-model="template.From"
    id="user-field-random-date-from"
    :label="$t(`labels.from`)"
  />
  <label for="user-field-random-date-to">
    {{ $t("labels.to") }}
  </label>
  <DatePicker
    v-model="template.To"
    id="user-field-random-date-to"
    :label="$t(`labels.to`)"
  />
  <label for="user-field-days">
    {{ $t("labels.days") }}
  </label>
  <div class="day-week">
    <v-checkbox
      v-for="item in daysWeek"
      v-model="template.Days"
      hide-details
      multiple
      density="compact"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <div class="last-item"></div>
  </div>
</template>
<script lang="ts" setup>
import { watch, reactive, computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { DateTime } from "luxon";
import DatePicker from "@components/DatePicker.vue";
import {
  isAutodataTemplate,
  DEFAULT_DATE_TEMPLATE,
  type AutodataTemplateDate,
} from "@/types";
import { DayWeek } from "@/dict";
import { rules } from "@/utils";

interface Props {
  modelValue?: string | null;
}

interface InputItem {
  value: number;
  label: string;
}

const { t } = useI18n();
const props = defineProps<Props>();
const emit = defineEmits(["update:model-value"]);
const daysWeek = computed<InputItem[]>(() =>
  DayWeek.map(({ id: value, marker }) => ({ value, label: t(marker) })),
);

const dateToUTC = (date: Date): string =>
  DateTime.fromJSDate(date)
    .toUTC(DateTime.local().offset, { keepLocalTime: true })
    .toISO() ?? "";

const defaultTemplate: AutodataTemplateDate = {
  Template: DEFAULT_DATE_TEMPLATE,
  From: dateToUTC(new Date()),
  To: dateToUTC(new Date()),
  Days: [],
};

const computeTemplate = (payload?: string | null): AutodataTemplateDate => {
  let result: AutodataTemplateDate = { ...defaultTemplate };

  if (payload) {
    try {
      const parsed = JSON.parse(payload);

      if (isAutodataTemplate(parsed)) {
        const { Template: template } = parsed;

        parsed.Template = template ?? DEFAULT_DATE_TEMPLATE;

        result = {
          ...defaultTemplate,
          ...parsed,
        };
      }
    } catch (e) {}
  }

  return result;
};

const template = reactive<AutodataTemplateDate>(
  computeTemplate(props.modelValue),
);

watchEffect(() => {
  for (const [key, value] of Object.entries(
    computeTemplate(props.modelValue),
  )) {
    // there is no convinient method to describe type checking
    //@ts-ignore
    template[key] = value;
  }
});
watch(template, (data) => emit("update:model-value", JSON.stringify(data)), {
  immediate: true,
});
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";
.day-week {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.last-item {
  display: none;
  width: 100%;
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .last-item {
    display: block;
  }
}
</style>
