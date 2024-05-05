<template>
  <FlexibleTable :headers="headers" :items="items">
    <template #item.displayOrder="{ row: { id, index }, cell }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="cell.value"
        @update:model-value="memoizeOrder(index, $event)"
        @blur="updateValue(memoized[index].displayOrder, cell.key, id)"
        @keyup.enter="updateValue(memoized[index].displayOrder, cell.key, id)"
        @keypress="passOnlyDigits"
      />
    </template>
    <template #item.name="{ row: { id }, cell }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="cell.value"
        :placeholder="cell.title"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.fieldName="{ row: { id }, cell }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="cell.value"
        :placeholder="cell.title"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.tag="{ row: { id }, cell }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="cell.value"
        :placeholder="cell.title"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.defaultValue="{ row: { id }, cell }">
      <v-text-field
        hide-details
        variant="plain"
        :model-value="cell.value"
        :placeholder="cell.title"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.isFile="{ row: { id }, cell }">
      <v-checkbox
        hide-details
        density="compact"
        :model-value="cell.value"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.needToReverseText="{ row: { id }, cell }">
      <v-checkbox
        hide-details
        density="compact"
        :model-value="cell.value"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.isHidden="{ row: { id }, cell }">
      <v-checkbox
        hide-details
        density="compact"
        :model-value="cell.value"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.source="{ row: { id }, cell }">
      <v-select
        hide-details
        density="compact"
        bg-color="#fff"
        variant="plain"
        :model-value="cell.value"
        :placeholder="$t(`selectSource`)"
        :items="sources"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.actions="{ row: { id } }">
      <div class="d-flex gc-1 gr-2 flex-wrap">
        <v-btn
          color="primary"
          class="v-btn-action"
          variant="flat"
          size="x-small"
          @click="$emit(`edit`, id)"
          >{{ $t("edit") }}</v-btn
        >
        <v-btn
          class="v-btn-action"
          variant="outlined"
          size="x-small"
          @click="$emit(`duplicate`, id)"
          >{{ $t("duplicate") }}</v-btn
        >
        <v-btn
          color="red"
          class="v-btn-action"
          variant="flat"
          size="x-small"
          @click="$emit(`delete`, id)"
          >{{ $t("delete") }}</v-btn
        >
      </div>
    </template>
  </FlexibleTable>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import type { UserField } from "@services/types";
import FlexibleTable from "@/components/FlexibleTable.vue";
import { Sources } from "@/dict";
import type { SourceItem } from "@/dict/types";

interface Header {
  title: string;
  key: string;
  width?: string | number;
}

interface Props {
  headers: Header[];
  items: UserField[];
}

type Memoized = Pick<UserField, "displayOrder">;

const props = defineProps<Props>();
defineEmits(["delete", "edit", "duplicate"]);
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

const updateValue = (
  newValue: string | number | null,
  key: string,
  id: number,
) => {
  const item = props.items.find(({ id: itemId }) => itemId === id);

  if (!item) {
    return;
  }

  //@ts-ignore
  item[key] = newValue;
};

watchEffect(() => {
  if (!props.items?.length) {
    memoized.value = [];

    return;
  }

  memoized.value = props.items.map(({ displayOrder }) => ({ displayOrder }));
});
</script>
