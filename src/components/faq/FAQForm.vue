<template>
  <div class="form">
    <v-form :disabled="disabled">
      <div class="editor d-flex flex-column gr-2">
        <div
          class="editor__actions d-flex ga-2 justify-space-between justify-sm-start"
        >
          <v-btn
            size="small"
            color="red"
            class="br-8"
            :disabled="disabled"
            @click="$emit(`clear`)"
            >{{ $t(`clear`) }}</v-btn
          >
          <v-btn
            size="small"
            class="br-8"
            color="success"
            :disabled="disabled"
            :loading="saving"
            @click="$emit(`submit`)"
            >{{ $t(`save`) }}</v-btn
          >
        </div>
        <div class="editor__inputs d-flex flex-column gr-2">
          <v-text-field
            v-model="item.name"
            hide-details
            density="compact"
            variant="filled"
            :autofocus="true"
            :placeholder="$t(`title`)"
          />
          <v-textarea
            v-model="item.answer"
            hide-details
            density="compact"
            variant="filled"
            :placeholder="$t(`answer`)"
          />
        </div>
      </div>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import type { FaqItem } from "@/services/types";
import { computed } from "vue";

interface Props {
  modelValue?: FaqItem;
  saving?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["submit", "clear", "update:modelValue"]);

const disabled = computed(() => !props.modelValue || props?.saving);
const item = computed<Pick<FaqItem, "answer" | "name">>({
  get() {
    return props.modelValue ?? { answer: "", name: "" };
  },

  set(value) {
    emit(`update:modelValue`, value);
  },
});
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";
.editor {
  position: fixed;
  padding: 16px;
  bottom: 16px;
  border-radius: 10px;
  right: 16px;
  z-index: 100;
  min-width: 360px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.22);

  @media #{map-get($display-breakpoints, 'md-and-down')} {
    bottom: 72px;
    min-width: initial;
    max-width: calc(100vw - 32px);
  }
}
</style>
