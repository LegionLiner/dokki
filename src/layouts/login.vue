<template>
  <v-app>
    <header>
      <div class="header">
        <div class="header__logo">
          <img src="@assets/img/logo.png" class="header__logo-img" alt="DOKKI.COM" />
        </div>
        <LangMenu class="lang"></LangMenu>
      </div>
    </header>
    <v-main>
      <v-container fluid class="h-100 pa-0">
        <div class="bg d-flex align-center justify-center h-100">
          <router-view />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
<script lang="ts" setup>
import { setLocale } from "@plugins/i18n";
import type { Locale } from "@/types";
</script>
<style lang="scss" scoped>
.bg {
  display: flex;
  background: url("@assets/img/bg.png") center/cover no-repeat;
  align-items: center;
  height: calc(100vh - 53px);
}

.header {
  display: flex;
  justify-content: space-between;
  padding-top: 2px;

  &__logo {
    max-width: 112px;
    margin-left: 12px;
    height: 54px;
    display: flex;
    align-items: center;

    &-img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .lang {
    position: absolute;
    right: 20px;
    padding-bottom: 0px;
    border-radius: 6px;
  }
}
</style>
