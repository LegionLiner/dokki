<template>
  <v-app>
    <Header :active="!sidebarShow" />
    <Sidebar
      v-model:opened="opened"
      v-model:selected="selected"
      v-model:show="sidebarShow"
      :menu="menu"
      @logout="logout"
    />

    <View />
    <BottomNavigation
      v-model:opened="opened"
      v-model:selected="selected"
      :menu="menu"
      :active="!sidebarShow"
      @logout="logout"
    />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, markRaw, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import * as Icon from "@components/icons";
import Sidebar from "@layouts/default/Sidebar.vue";
import View from "@layouts/default/View.vue";
import BottomNavigation from "@layouts/default/BottomNavigation.vue";
import Header from "@layouts/default/Header.vue";
import type { Menu, Divider } from "@/types";
import { authService } from "@/bootstrap";
import useUserStore from "@stores/user";

type MenuItem = Menu | Divider;

const { t } = useI18n();
const userStore = useUserStore();
const openedAtStart = computed<string[]>(() => [t("links.services")]);
const isAdmin = computed<boolean>(() => userStore.userType === "ADMIN");
const opened = ref<string[]>(openedAtStart.value);
const selected = ref<string[]>(['docs']);
const sidebarShow = ref<boolean>();
const router = useRouter();

const logout = async () => {
  await authService.logout();
  await router.push({ name: "logout" });
};
const menu = computed<MenuItem[]>(() => {
  const routes = [
    {
      title: t("links.home"),
      value: "home",
      icon: markRaw(Icon.HomeIcon),
      to: { name: "index" },
    },
    {
      title: t("links.services"),
      value: "client.services",
      icon: markRaw(Icon.GridIcon),
      children: [
        {
          title: t("links.docs"),
          value: "client.docs",
          icon: markRaw(Icon.Grid3IconV2),
          to: { name: "docs" },
        },
        {
          title: t("links.mrz"),
          value: "client.mrz",
          icon: markRaw(Icon.Grid3Icon),
          to: { name: "mrz" },
        },
        {
          title: t("links.pid"),
          value: "client.pid",
          icon: markRaw(Icon.Grid3IconV4),
          to: { name: "pn" },
        },
        {
          title: t("links.aamva"),
          value: "client.aamva",
          icon: markRaw(Icon.Grid3IconV3),
          to: { name: "aamva" },
        },
      ],
    },
    {
      title: t("links.orders"),
      value: "client.orders",
      icon: markRaw(Icon.OrderIcon),
      to: { name: "orders" },
    },
    {
      title: t("links.balance"),
      value: "client.balance",
      icon: markRaw(Icon.BalanceIcon),
      to: { name: "balance" },
    },
    {
      title: t("links.support"),
      value: "client.support",
      icon: markRaw(Icon.HeartIcon),
      to: { name: "support" },
    },
  ];

  if (isAdmin.value) {
    routes.push({
      title: t("links.admin.panel"),
      value: "admin.panel",
      icon: markRaw(Icon.AdminIcon),
      children: [
        {
          title: t("links.admin.orders"),
          value: "admin.orders",
          icon: markRaw(Icon.OrderIcon),
          to: { name: "admin.orders" },
        },
        {
          title: t("links.admin.balance"),
          value: "admin.balance",
          icon: markRaw(Icon.BalanceIcon),
          to: { name: "admin.balance" },
        },
        {
          title: t("links.admin.templates"),
          value: "admin.templates",
          icon: markRaw(Icon.TemplateIcon),
          to: { name: "admin.templates.list" },
        },
        {
          title: t("links.admin.faq"),
          value: "admin.faq",
          icon: markRaw(Icon.FolterIcon),
          to: { name: "admin.faq" },
        },
      ],
    });
  }

  return routes;
});
</script>
