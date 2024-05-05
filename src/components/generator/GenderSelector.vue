<template>
  <v-radio-group
    hide-details
    inline
    direction="horizontal"
    density="compact"
    :model-value="selected"
    @update:model-value="$emit(`update:modelValue`, $event)"
  >
    <v-radio :label="$t(`male`)" :value="Gender.MALE" class="mr-2" />
    <v-radio :label="$t(`female`)" :value="Gender.FEMALE" />
  </v-radio-group>
</template>
<script lang="ts" setup>
import { computed, nextTick } from "vue";
import { Gender } from "@infra/types";

interface Props {
  modelValue: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const selected = computed<Gender | undefined>(() => {
  if (props.modelValue === null) {
    nextTick(() => emit("update:modelValue", Gender.FEMALE));

    return;
  }

  return props.modelValue as Gender;
});
</script>
