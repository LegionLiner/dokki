import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { LightTheme, defaults, aliases } from "./themes";

import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "LightTheme",
    themes: { LightTheme },
  },
  defaults,
  aliases,
});
