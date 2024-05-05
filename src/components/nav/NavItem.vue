<template>
  <v-list-group v-if="item?.children?.length" :value="item.title">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        class="v-list-item--pointer v-list-item--sidebar"
        :link="false"
        :title="item.title"
        :value="item.value"
      >
        <template #prepend>
          <component :is="item.icon" />
        </template>
      </v-list-item>
    </template>
    <NavItem
      v-for="(subitem, index) in item.children"
      :item="subitem"
      :key="`${index}-${item.title}`"
    />
  </v-list-group>
  <v-list-item
    v-else
    link
    exact
    class="v-list-item--sidebar"
    :to="item.to"
    :title="item.title"
    :value="item.value"
  >
    <template #prepend>
      <component :is="item.icon" />
    </template>
  </v-list-item>
</template>
<script lang="ts" setup>
import type { Menu } from "@/types";

interface Props {
  item: Menu;
}

defineProps<Props>();
</script>
<!-- <style lang="scss">
@import "src/styles/vuetify/vars.scss";

.v-list-item {
  $element: ".v-list-item";
  &--pointer {
    cursor: pointer;
  }

  &--nav {
    &#{$element} {
      &--sidebar {
        #{$element} {
          &-title {
            line-height: 1.2em;
          }
        }

        &#{$element}--active#{$element}--link {
          color: $nav-sidebar-active-color;

          svg {
            path {
              fill: $nav-bottom-active-color;
            }
          }
        }
      }
    }
  }
}
</style> -->
