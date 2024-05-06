<template>
  <v-navigation-drawer :width="220" :model-value="show" @update:model-value="$emit(`update:show`, $event)">
    <div class="d-flex justify-space-around mb-4">
      <div class="navigation-drawer__wrapper">
        <div class="logo">
          <img src="@assets/img/logo.png" class="logo__img" alt="DOKKI.COM" />
        </div>
        <NavList open-strategy="multiple" :items="menu" :opened="opened" :selected="selected"
          @update:opened="$emit(`update:opened`, $event)" @update:selected="$emit(`update:selected`, $event)" />
        <v-divider />
        <v-list dense nav>
          <v-list-item link :title="$t(`logout`)" @click="$emit(`logout`, $emit)" class="logout">
            <template #prepend>
              <ExitIcon class="mr-2" />
            </template>
          </v-list-item>
        </v-list>
        <LangMenu />
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script lang="ts" setup>
import NavList from "@components/nav/NavList.vue";
import type { Menu, Divider } from "@/types";
import { ExitIcon } from "@components/icons";
import LangMenu from "@components/LangMenu.vue";

type MenuItem = Menu | Divider;

interface Props {
  menu: MenuItem[];
  show?: boolean;
  opened?: string[];
  selected?: string[];
}

defineProps<Props>();
defineEmits(["update:opened", "update:selected", "update:show", "logout"]);
</script>
<style lang="scss">
@import "src/styles/vuetify/vars.scss";

.v-navigation-drawer {
  .v-list-item {
    &__prepend {
      .v-list-item__spacer {
        width: 13px;
      }
    }
  }

  .v-list-group__items {
    .v-list-item {
      --indent-padding: 4px;
    }
  }

  &__content {
    padding: 0 6px 0 12px;
    margin-left: 0px !important;
  }
}

.logout {

  .v-list-item__content,
  .v-list-item-title {
    overflow: visible;
  }
}
</style>
<style lang="scss" scoped>
@import "src/styles/vuetify/vars.scss";

.v-navigation-drawer {
  &__wrapper {
    max-width: 158px;
    width: 100%;
  }
}

.logo {
  margin: 40px 0 9px 14px;
  max-width: 120px;

  &__img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
