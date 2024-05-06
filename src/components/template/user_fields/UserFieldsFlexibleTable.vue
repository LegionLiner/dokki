<template>
  <FlexibleTable :headers="headers" :items="items" :isTemplate="isTemplate">
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
      v-if="!isShort"
        hide-details
        density="compact"
        :model-value="cell.value"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.needToReverseText="{ row: { id }, cell }">
      <v-checkbox
      v-if="!isShort"
        hide-details
        density="compact"
        :model-value="cell.value"
        @update:model-value="updateValue($event, cell.key, id)"
      />
    </template>
    <template #item.isHidden="{ row: { id }, cell }">
      <v-checkbox
      v-if="!isShort"
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
      <ItemActions @itemEdit="$emit(`edit`, id)" @itemDuplicate="$emit(`duplicate`, id)" @itemDelete="$emit(`delete`, id)"></ItemActions>
    </template>
  </FlexibleTable>
</template>

<script lang="ts" setup>
import { ref, watchEffect, computed } from "vue";
import type { UserField } from "@services/types";
import FlexibleTable from "@/components/FlexibleTable.vue";
import { Sources } from "@/dict";
import type { SourceItem } from "@/dict/types";
import ItemActions from "./ItemActions.vue";
import { useDisplay } from "vuetify";

interface Header {
  title: string;
  key: string;
  width?: string | number;
}

interface Props {
  headers: Header[];
  items: UserField[];
  isTemplate?: boolean;
}

type Memoized = Pick<UserField, "displayOrder">;

const props = defineProps<Props>();
defineEmits(["delete", "edit", "duplicate"]);

const sources = ref<SourceItem[]>(Sources);
const memoized = ref<Memoized[]>([]);
const { width } = useDisplay();
const isShort = computed<boolean>(() => width.value < 1450);

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

<style lang="scss">
.template-table > thead > tr:last-child {
  > th:nth-child(6), > th:nth-child(7), > th:nth-child(8) {
    @media (width < 1450px) {
      display: none;
    }
  }
}
.template-table > tbody > tr {
  > td:nth-child(6), > td:nth-child(7), > td:nth-child(8) {
    @media (width < 1450px) {
      display: none;
    }
  }
}
</style>