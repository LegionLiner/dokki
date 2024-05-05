<template>
  <v-data-table
    :items-per-page="0"
    :headers="headers"
    :items="items"
    :loading="loading"
    :sort-by="[{ key: `displayOrder`, order: `asc` }]"
    class="v-table--round v-table--spacing v-table--padding bg-transparent"
  >
    <template #bottom />
    <template #item.displayOrder="{ item, index }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="item.displayOrder"
        @update:model-value="memoizeOrder(index, $event)"
        @blur="item.displayOrder = memoized[index].displayOrder"
        @keyup.enter="item.displayOrder = memoized[index].displayOrder"
        @keypress="passOnlyDigits"
      />
    </template>
    <template #item.name="{ item, column }">
      <v-text-field
        hide-details
        variant="plain"
        v-model="item.name"
        :placeholder="column.title"
      />
    </template>
    <template #item.fieldName="{ item, column }">
      <v-text-field
        hide-details
        variant="plain"
        v-model="item.fieldName"
        :placeholder="column.title"
      />
    </template>
    <template #item.defaultValue="{ item, column }">
      <v-text-field
        hide-details
        variant="plain"
        v-model="item.defaultValue"
        :placeholder="column.title"
      />
    </template>
    <template #item.tag="{ item, column }">
      <v-text-field
        hide-details
        variant="plain"
        v-model="item.tag"
        :placeholder="column.title"
      />
    </template>
    <template #item.isFile="{ item }">
      <v-checkbox v-model="item.isFile" hide-details density="compact" />
    </template>
    <template #item.needToReverseText="{ item }">
      <v-checkbox
        v-model="item.needToReverseText"
        hide-details
        density="compact"
      />
    </template>
    <template #item.isHidden="{ item }">
      <v-checkbox v-model="item.isHidden" hide-details density="compact" />
    </template>
    <template #item.source="{ item }">
      <v-select
        hide-details
        density="compact"
        bg-color="#fff"
        v-model="item.source"
        variant="plain"
        :placeholder="$t(`selectSource`)"
        :items="sources"
      />
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex gc-1 gr-2 py-2 flex-wrap">
        <v-btn
          color="primary"
          class="v-btn-action"
          variant="flat"
          size="x-small"
          @click="$emit(`edit`, item.id)"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          class="v-btn-action"
          variant="outlined"
          size="x-small"
          @click="$emit(`duplicate`, item.id)"
          >{{ $t("duplicate") }}</v-btn
        >
        <v-btn
          color="red"
          class="v-btn-action"
          variant="flat"
          size="x-small"
          @click="$emit(`delete`, item.id)"
          >{{ $t("delete") }}</v-btn
        >
      </div>
    </template>
  </v-data-table>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { Sources } from "@/dict";
import type { UserField } from "@services/types";
import type { SourceItem } from "@/dict/types";

interface Header {
  title: string;
  key: string;
  sortable?: boolean;
  width?: string | number;
}

type Memoized = Pick<UserField, "displayOrder">;

interface Props {
  items?: UserField[];
  headers?: Header[];
  loading?: boolean;
  perPage?: number;
}

const props = defineProps<Props>();
defineEmits(["delete", "duplicate", "edit"]);

const sources = ref<SourceItem[]>(Sources);
const memoized = ref<Memoized[]>([]);

const memoizeOrder = (index: number, value: string) => {
  if (/^[+-]?\d+$/.test(value)) {
    const mem = memoized.value;

    mem[index].displayOrder = Number(value);
  }
};

const passOnlyDigits = (e: KeyboardEvent) => {
  if (!/^[+-]?\d*$/.test(e.key)) {
    e.preventDefault();
  }
};

watchEffect(() => {
  if (!props.items?.length) {
    memoized.value = [];

    return;
  }

  memoized.value = props.items.map(({ displayOrder }) => ({ displayOrder }));
});
</script>
