/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_ADDRESS: string;
  readonly VITE_SERVER_PORT: number;
  readonly VITE_SERVER_HOST: string;
  readonly VITE_I18N_LOCALE: string;
  readonly VITE_I18N_FALLBACK_LOCALE: string;
  readonly VITE_TRANSLATED_API_ADDRESS: string;
  readonly VITE_TRANSLATED_API_KEY: string;
  readonly FIREBASE_CONFIG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const firebaseConfig: string;
