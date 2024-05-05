<template>
  <v-list bg-color="transparent">
    <template v-for="(item, index) in modelValue" :key="item.id">
      <v-list-item>
        <FAQTreeItem
          :model-value="item"
          :index="`${majorIndex}${index + 1}`"
          @add="$emit(`add`, item)"
          @delete="$emit(`delete`, { item: modelValue, id: item.id })"
          @change="$emit(`change`, item)"
        />
        <v-divider :thickness="4" />
      </v-list-item>

      <v-list-item v-if="item?.children?.length">
        <FAQTree
          class="ml-8"
          :model-value="item.children"
          :order="`${majorIndex}${index + 1}`"
          @add="$emit(`add`, $event)"
          @delete="$emit(`delete`, $event)"
          @change="$emit(`change`, $event)"
        />
      </v-list-item>
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import type { FaqItem } from "@services/types";
import FAQTreeItem from "@components/faq/FAQTreeItem.vue";
import FAQTree from "@components/faq/FAQTree.vue";
import { computed } from "vue";

interface Props {
  modelValue: FaqItem[];
  order?: string;
}

const props = defineProps<Props>();
defineEmits(["add", "delete", "change"]);

const majorIndex = computed<string>(() =>
  props?.order ? `${props.order}.` : ``,
);
</script>
