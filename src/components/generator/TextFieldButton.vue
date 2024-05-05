<template>
  <ContainerButton :disabled="disabled">
    <TextField
      class="v-input-button"
      :model-value="modelValue"
      :id="id"
      :disabled="disabled"
      :rules="rules"
      @update:model-value="$emit(`update:modelValue`, $event)"
      @change="$emit(`change`, modelValue)"
    />
    <template #button>
      <slot />
    </template>
  </ContainerButton>
</template>
<script lang="ts" setup>
import TextField from "@components/generator/TextFieldBase.vue";
import ContainerButton from "@components/generator/ContainerButton.vue";

interface Props {
  modelValue: string | null;
  id?: string;
  disabled?: boolean;
  rules?: Array<(v: string) => boolean>;
}

defineProps<Props>();
defineEmits(["update:modelValue", "change"]);
</script>
<style lang="scss" scoped>
.input-button {
  position: relative;

  > .input-button__button {
    position: absolute;
    right: 6px;
    top: 6px;
  }
}
</style>
