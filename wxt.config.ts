import { defineConfig } from "wxt";

import appConfig from "./src/app.config";

import path from "path";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: `WXT React Boilerplate${appConfig.isDev ? " ➡️ Dev" : ""}`,
    version: "0.0.1",
    web_accessible_resources: [
      {
        resources: [
          "GeistVF.woff2",
          "GeistMonoVF.woff2",
          "popup.html",
          "*.js",
          "*.css",
        ],
        matches: ["*://*.google.com/*"],
      },
    ],
  },
  imports: {
    eslintrc: {
      enabled: 8,
    },
    dirs: ["components/ui/*"],
    imports: [
      {
        name: "default",
        as: "$",
        from: "jquery",
      },
      {
        name: "cn",
        from: path.posix.join(
          ...path.resolve(__dirname, "src/utils/cn").split(path.sep),
        ),
      },
    ],
  },
});
