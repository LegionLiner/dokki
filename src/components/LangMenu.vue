<template>
  <v-list dense :opened="opened" :selected="selected" class="lang-menu-list">
    <v-list-group class="v-list-group__rounded">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          class="v-list-item--pointer v-list-item--sidebar background"
          :link="false"
          :title="currentLanguage"
          :value="locale"
        >
          <template #prepend>
            <EarthIcon />
          </template>
        </v-list-item>
      </template>
      <v-list-item @click="changeLang(`ru`)" value="ru">Русский</v-list-item>
      <v-list-item @click="changeLang(`en`)" value="en">English</v-list-item>
    </v-list-group>
  </v-list>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Locale } from "@/types";
import { localeService } from "@/bootstrap";
import { setLocale } from "@plugins/i18n";
import { EarthIcon } from "@components/icons";

const { locale, t } = useI18n();
const opened = ref<string[]>([]);
const selected = ref<string[]>([locale.value]);
const changeLang = (locale: Locale) => {
  setLocale(locale);
  localeService.storeLocale(locale);
  opened.value = [];
  selected.value = [locale];
};
const currentLanguage = computed<string>(() =>
  locale.value === "en" ? t("english") : t("russian"),
);
</script>
<style lang="scss">
.v-list-group {
  &__rounded {
    .v-list-group__items {
      border: 1px #e3f1fd solid;
      border-radius: 5px;
    }
  }
  .background {
    background: #E3F1FD;
    padding-right: 8px !important;

    @media (width < 1280px) {
      background: none;

      &.v-list-item--active {
        background: #E3F1FD;
      }
    }
  }
  .v-list-item {
    border-radius: 5px !important;
    transition: background 0.1s ease-in-out;

    &:active {
      background: #9CCDF9;
    }

    &__overlay {
      background: #9CCDF9;
    }

    &[tabindex="-2"].v-list-item--active {
      background: white;
      color: #188BF1;
    }

    .v-list-item__content {
      margin-left: 10px;
    }
  }
  // .v-list-item:not(.v-list-group__items > .v-list-item) {
  //   color: #188BF1;
  // }

  &__items {
    margin-top: 4px;
    .v-list-item {
      padding-inline-start: 20px !important;
      background: white;
    }
  }

  i::before {
    color: #188BF1;
  }

  .v-list-group__items .v-list-item {
    padding-inline-start: 20px !important;
  }
}

.lang-menu-list {
  width: 191px;
  padding-bottom: 0px;
  background: none;

  .v-list-group {
    &__header {
      color: #188BF1;
    }
  }

  @media (width < 1280px) {
    width: auto;
  }
}
</style>

