import vuetify from "@plugins/vuetify";
import i18n from "@plugins/i18n";
import pinia from "@plugins/pinia";
import router from "@/router";
import toast from "@plugins/toast";
import Vue3Signature from "vue3-signature";
import "@plugins/firebase";

import type { App } from "vue";

export const registerPlugins = (app: App): App =>
  app
    .use(vuetify)
    .use(i18n)
    .use(toast)
    .use(router)
    .use(pinia)
    .use(Vue3Signature);
