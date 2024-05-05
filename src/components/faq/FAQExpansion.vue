<template>
  <ul class="question">
    <li
      v-for="(item, itemIndex) in modelValue"
      class="question__item"
      :key="item.id"
    >
      <div v-if="item?.children?.length">
        <div
          class="question__header d-flex"
          :class="{ 'active-tree': selectedId === item.id }"
          @click="clickHeader(item, itemIndex)"
        >
          <div
            class="question__title w-100"
            v-html="
              `${majorIndex}${itemIndex + 1}. ${parseByLang(item.name, locale)}`
            "
          />
          <div class="question__arrow ml-0">
            <svg
              :style="{
                transform: !!opened[itemIndex] ? '' : 'rotate(180deg)',
              }"
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 7L7 1L1 7"
                stroke="#188BF1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <template
          v-if="smAndDown && selectedId === item.id && !!opened[itemIndex]"
        >
          <div
            class="question__answer"
            v-html="parseByLang(item.answer, locale)"
          />
          <v-divider />
        </template>
        <FAQExpansion
          v-show="!!opened[itemIndex]"
          :model-value="item.children"
          :selected="selected"
          :index="`${majorIndex}${itemIndex + 1}`"
          @update:selected="$emit(`update:selected`, $event)"
        />
      </div>
      <template v-else>
        <div
          class="question__question"
          v-html="
            `${majorIndex}${itemIndex + 1}. ${parseByLang(item.name, locale)}`
          "
          :class="{ 'active-tree': selectedId === item.id }"
          @click="$emit(`update:selected`, item)"
        />
        <template v-if="smAndDown && selectedId === item.id">
          <div
            class="question__answer"
            v-html="parseByLang(item.answer, locale)"
          />
          <v-divider />
        </template>
      </template>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import type { FaqItem } from "@services/types";
import FAQExpansion from "@components/faq/FAQExpansion.vue";
import { parseByLang } from "@/utils";

interface Props {
  modelValue: FaqItem[];
  selected?: FaqItem;
  index?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:selected"]);

const { locale } = useI18n();
const { smAndDown } = useDisplay();
const opened = ref<Array<boolean>>([]);
const majorIndex = computed<string>(() =>
  props.index ? `${props.index}.` : ``,
);
const selectedId = computed<string | undefined>(() => props.selected?.id);

const clickHeader = (item: FaqItem, index: number) => {
  opened.value[index] = !opened.value[index];
  emit(`update:selected`, item);
};
</script>
<style lang="scss" scoped>
@import "vuetify/lib/styles/settings/_variables";
.question {
  @mixin item {
    padding: 12px;
    border-radius: 10px;

    &:hover:not(.active-tree) {
      background: #eaf4fa;
    }

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      padding: 8px;
    }
  }
  list-style: none;

  &__item {
    display: block;
    margin: 4px 8px;
    cursor: pointer;
  }

  &__header {
    @include item;
    cursor: pointer;
  }

  &__question {
    @include item;
  }

  &__answer {
    padding: 8px 16px;
  }
}
</style>
<style lang="scss">
.active-tree {
  background-color: #188bf1;
  color: #fff;

  svg path {
    stroke: #fff;
  }
}
</style>
