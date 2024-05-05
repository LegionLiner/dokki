<template>
  <v-data-table :items-per-page="0" :headers="headers" :items="items" :loading="loading"
    :sort-by="[{ key: `displayOrder`, order: `asc` }]"
    class="v-table--round v-table--spacing v-table--padding bg-transparent">
    <template #bottom />
    <template #item.displayOrder="{ item, index }">
      <v-text-field hide-details variant="plain" :model-value="item.displayOrder"
        @update:model-value="memoizeOrder(index, $event)" @blur="item.displayOrder = memoized[index].displayOrder"
        @keyup.enter="item.displayOrder = memoized[index].displayOrder" @keypress="passOnlyDigits" />
    </template>
    <template #item.name="{ item, column }">
      <v-text-field hide-details variant="plain" v-model="item.name" :placeholder="column.title" />
    </template>
    <template #item.fieldName="{ item, column }">
      <v-text-field hide-details variant="plain" v-model="item.fieldName" :placeholder="column.title" />
    </template>
    <template #item.defaultValue="{ item, column }">
      <v-text-field hide-details variant="plain" v-model="item.defaultValue" :placeholder="column.title" />
    </template>
    <template #item.tag="{ item, column }">
      <v-text-field hide-details variant="plain" v-model="item.tag" :placeholder="column.title" />
    </template>
    <template #item.isFile="{ item }">
      <v-checkbox v-model="item.isFile" hide-details density="compact" />
    </template>
    <template #item.needToReverseText="{ item }">
      <v-checkbox v-model="item.needToReverseText" hide-details density="compact" />
    </template>
    <template #item.isHidden="{ item }">
      <v-checkbox v-model="item.isHidden" hide-details density="compact" />
    </template>
    <template #item.source="{ item }">
      <v-select hide-details density="compact" bg-color="#fff" v-model="item.source" variant="plain"
        :placeholder="$t(`selectSource`)" :items="sources" />
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex flex-wrap ga-2 ga-sm-1 mb-2 my-lg-2">
        <v-btn color="success" class="v-btn-action" variant="flat" size="x-small" :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`edit`, item.id)">
        <PlayIcon v-if="isShort" />
          <template v-else>
            {{ $t("edit") }}
          </template>
          </v-btn>

        <v-btn color="primary" class="v-btn-action" variant="flat" size="x-small"  :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`duplicate`, item.id)">
          <CopyIcon v-if="isShort" />
          <template v-else>
            {{ $t("duplicate") }}
          </template>
        </v-btn>

        <v-btn color="red" variant="flat" size="x-small" class="v-btn-action" :class="{
          'v-btn-action__icon': isShort,
        }" @click="$emit(`delete`, item.id)">
          <TrashIcon v-if="isShort" />
          <template v-else>
            {{ $t("delete") }}
          </template>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>
<script lang="ts" setup>
import { ref, watchEffect, computed } from "vue";
import { Sources } from "@/dict";
import type { UserField } from "@services/types";
import type { SourceItem } from "@/dict/types";
import { useDisplay } from "vuetify";
import PlayIcon from "@components/icons/PlayIcon.vue";
import CopyIcon from "@components/icons/CopyIcon.vue";
import TrashIcon from "@components/icons/TrashIcon.vue";

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

watchEffect(() => {
  if (!props.items?.length) {
    memoized.value = [];

    return;
  }

  memoized.value = props.items.map(({ displayOrder }) => ({ displayOrder }));
});
</script>
