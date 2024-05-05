<template>
  <div class="input-button ">
    <slot />
    <div
      class="input-button__button bg-white"
      :style="{
        right,
      }"
      :class="{
        'd-flex gc-2': !!$slots[`button`],
      }"
    >
      <slot name="button" />
      <v-btn
        variant="outlined"
        size="small"
        rounded="lg"
        color="primary"
        class="v-btn--inside v-btn--primary"
        :text="text"
        :disabled="disabled"
        :loading="loading"
        @click="$emit(`button:click`, $event)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  text?: string;
  disabled?: boolean;
  loading?: boolean;
  offset?: number;
}

const props = defineProps<Props>();
defineEmits(["button:click"]);

const right = computed<string>(() =>
  props.offset ? `calc(6px + ${props.offset}px)` : `6px`,
);
</script>
<style lang="scss" scoped>
.input-button {
  position: relative;
  flex: 1 1 auto;

  > .input-button__button {
    position: absolute;
    right: 6px;
    top: 6px;
    z-index: 890;
  }
}
</style>
