<template>
  <div class="item">
    <div class="item__index">Number: {{ index }}</div>
    <div class="item__title">
      {{ $t(`title`) }}:
      <span v-html="name" />
    </div>
    <div class="item__answer">
      {{ $t(`answer`) }}:
      <span v-html="answer" />
    </div>
    <div class="item__actions d-flex ga-3 ga-sm-2 my-3 my-sm-2 flex-wrap">
      <v-btn
        color="primary"
        density="compact"
        @click="$emit(`add`, $event)"
        :text="$t(`add`)"
      />
      <v-btn
        color="red"
        density="compact"
        @click="$emit(`delete`, $event)"
        :text="$t(`delete`)"
      />
      <v-btn
        color="success"
        density="compact"
        @click="$emit(`change`, $event)"
        :text="$t(`edit`)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { FaqItem } from "@/services/types";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { parseByLang } from "@/utils";

interface Props {
  modelValue: FaqItem;
  index: string;
}

const props = defineProps<Props>();
defineEmits(["add", "delete", "change"]);

const { locale } = useI18n();
const name = computed<string>(() =>
  parseByLang(props.modelValue.name, locale.value),
);
const answer = computed<string>(() =>
  parseByLang(props.modelValue.answer, locale.value),
);
</script>
<style lang="scss" scoped>
.item {
  &__index {
    font-weight: 700;
  }
}
</style>
