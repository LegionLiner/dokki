<template>
  <label for="user-field-random-price-template">
    {{ $t("labels.template") }}
  </label>
  <v-text-field
    v-model="template.Template"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-price-template"
    bg-color="#fff"
  />
  <label for="user-field-random-price-format">
    {{ $t("labels.format") }}
  </label>
  <v-text-field
    v-model="template.Format"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-price-format"
    bg-color="#fff"
  />
  <label for="user-field-random-price-min">
    {{ $t("labels.min") }}
  </label>
  <v-text-field
    v-model.lazy.number="template.Min"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-price-min"
    bg-color="#fff"
    :rules="rulesMin"
  />
  <label for="user-field-random-price-max">
    {{ $t("labels.max") }}
  </label>
  <v-text-field
    v-model.lazy.number="template.Max"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-price-max"
    bg-color="#fff"
    :rules="rulesMax"
  />
</template>
<script lang="ts" setup>
import { watch, reactive, ref } from "vue";
import { isAutodataTemplate, type AutoDataTemplatePrice } from "@/types";
import { rules } from "@/utils";

interface Props {
  modelValue?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:model-value"]);

const minMaxLow = rules.minMax(0, Number.MAX_SAFE_INTEGER);
const minHight = rules.minMax(0.1, Number.MAX_SAFE_INTEGER);

const rulesMin = ref([minMaxLow]);
const rulesMax = ref([minHight]);

const defaultTemplate: AutoDataTemplatePrice = {
  Template: "",
  Format: "",
  Min: 0,
  Max: 10,
};
const computeTemplate = (payload?: string | null): AutoDataTemplatePrice => {
  if (!payload) {
    return { ...defaultTemplate };
  }

  try {
    const parsed = JSON.parse(payload);

    if (isAutodataTemplate(parsed)) {
      return {
        ...defaultTemplate,
        ...parsed,
      };
    }
  } catch (e) {}

  return { ...defaultTemplate };
};

const template = reactive<AutoDataTemplatePrice>(
  computeTemplate(props.modelValue),
);

watch(
  () => template.Min,
  (newValue, oldValue) => {
    if (!minMaxLow(newValue)) {
      template.Min = oldValue;
    }
  },
);
watch(
  () => template.Max,
  (newValue, oldValue) => {
    if (!minHight(newValue)) {
      template.Max = oldValue;
    }
  },
);
watch(template, (data) => emit("update:model-value", JSON.stringify(data)));
</script>
