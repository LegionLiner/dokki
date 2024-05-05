<template>
  <label for="user-field-random-text-template">
    {{ $t("labels.template") }}
  </label>
  <v-text-field
    v-model="template.Template"
    hide-details
    density="compact"
    variant="outlined"
    id="user-field-random-text-template"
    bg-color="#fff"
  />
</template>
<script lang="ts" setup>
import { watch, reactive } from "vue";
import { isAutodataTemplate, type AutoDataTemplateText } from "@/types";

interface Props {
  modelValue?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:model-value"]);

const defaultTemplate: AutoDataTemplateText = {
  Template: "",
};
const computeTemplate = (payload?: string | null): AutoDataTemplateText => {
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

const template = reactive<AutoDataTemplateText>(
  computeTemplate(props.modelValue),
);

watch(template, (data) => emit("update:model-value", JSON.stringify(data)));
</script>
