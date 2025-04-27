import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://2xbm7yga22.execute-api.ap-southeast-2.amazonaws.com",
    setupNodeEvents(on, config) {
      
    },
    supportFile: false,
  },
});
