<template>
  <ContainerButton :disabled="disabled">
    <DatePicker
      :model-value="modelValue"
      :format="format"
      :id="id"
      :disabled="disabled"
      :rules="rules"
      @update:model-value="$emit(`update:modelValue`, $event)"
    />
    <template #button>
      <slot />
    </template>
  </ContainerButton>
</template>
<script lang="ts" setup>
import ContainerButton from "@components/generator/ContainerButton.vue";
import DatePicker from "@components/generator/GeneratorDatePicker.vue";

interface Props {
  modelValue: string | null;
  format?: string;
  id?: string;
  disabled?: boolean;
  rules?: Array<(v: string) => boolean>;
}

defineProps<Props>();
defineEmits(["update:modelValue"]);
</script>
