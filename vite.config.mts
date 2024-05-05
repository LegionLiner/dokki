import { readFileSync } from "node:fs";
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import VueRouter from "unplugin-vue-router/vite";

import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { resolve, dirname } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const firebaseConfig = readFileSync("firebase.json", { encoding: "utf8" });

  return {
    plugins: [
      VueRouter(),
      Layouts({
        defaultLayout: "default",
      }),
      Vue({
        template: { transformAssetUrls },
      }),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/vuetify/extend.scss",
        },
      }),
      Components(),
      ViteFonts({
        google: {
          families: [
            {
              name: "Roboto",
              styles: "wght@100;300;400;500;700;900",
            },
          ],
        },
      }),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**"),
        runtimeOnly: false,
        strictMessage: false,
      }),
    ],
    define: {
      "process.env": {},
      firebaseConfig,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
        "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
        "@plugins": fileURLToPath(new URL("./src/plugins", import.meta.url)),
        "@infra": fileURLToPath(new URL("./src/infra", import.meta.url)),
        "@dict": fileURLToPath(new URL("./src/dict", import.meta.url)),
        "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        "@user-fields": fileURLToPath(
          new URL("./src/components/template/user_fields", import.meta.url),
        ),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
      port: Number(env.VITE_SERVER_PORT),
      host: env.VITE_SERVER_HOST,
    },
    preview: {
      port: Number(env.VITE_SERVER_PORT),
      host: env.VITE_SERVER_HOST,
    },
    build: {
      minify: true,
    },
  };
});
