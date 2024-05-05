import { createApp } from "vue";
import App from "@/App.vue";
import { registerPlugins } from "@/plugins";
import { authToken, resoreLocalSettings, restoreLocalToken } from "@/bootstrap";

(async () => {
  if (authToken.get()) {
    await restoreLocalToken();
  }

  registerPlugins(createApp(App)).mount("#app");
  resoreLocalSettings();
})();
