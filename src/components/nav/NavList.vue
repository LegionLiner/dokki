<template>
  <v-list
    dense
    nav
    :opened="opened"
    :selected="selected"
    :open-strategy="openStrategy"
    @update:opened="$emit(`update:opened`, $event)"
    @update:selected="$emit(`update:selected`, $event)"
  >
    <template v-for="(item, index) in items" :key="`${index}-${item.title}`">
      <NavItem v-if="item?.divider === undefined" :item="item" />
      <v-divider v-else="item.divider" />
    </template>
  </v-list>
</template>
<script lang="ts" setup>
import NavItem from "@components/nav/NavItem.vue";
import type { Menu, Divider } from "@/types";

type MenuItem = Menu | Divider;
type OpenStrategyProp = "single" | "multiple" | "list";

interface Props {
  items: MenuItem[];
  opened?: string[];
  selected?: string[];
  openStrategy?: OpenStrategyProp;
}

defineProps<Props>();
defineEmits(["update:opened", "update:selected"]);
</script>
