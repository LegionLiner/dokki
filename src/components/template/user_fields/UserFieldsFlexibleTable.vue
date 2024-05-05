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
      <div class="d-flex flex-wrap ga-2 ga-sm-1 mb-2 my-lg-2">
        <v-btn color="primary" class="v-btn-action" variant="flat" size="x-small" :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`edit`, id)">
        <EditIcon v-if="isShort" />
          <template v-else>
            {{ $t("edit") }}
          </template>
          </v-btn>
        <v-btn class="v-btn-action" color="primary" variant="flat" size="x-small"  :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`duplicate`, id)">
          <CopyIcon v-if="isShort" />
          <template v-else>
            {{ $t("duplicate") }}
          </template>
        </v-btn>
        <v-btn color="red" variant="flat" size="x-small" class="v-btn-action" :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`delete`, id)">
          <TrashIcon v-if="isShort" />
          <template v-else>
            {{ $t("delete") }}
          </template>
        </v-btn>
      </div>
    </template>
  </FlexibleTable>
</template>
<script lang="ts" setup>
import { ref, watchEffect, computed } from "vue";
import type { UserField } from "@services/types";
import FlexibleTable from "@/components/FlexibleTable.vue";
import { Sources } from "@/dict";
import type { SourceItem } from "@/dict/types";
import EditIcon from "@components/icons/EditIcon.vue";
import CopyIcon from "@components/icons/CopyIcon.vue";
import TrashIcon from "@components/icons/TrashIcon.vue";
import { useDisplay } from "vuetify";

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

const display = useDisplay();
const isShort = computed<boolean>(() => display.width.value < 1600);

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
