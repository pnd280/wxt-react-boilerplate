import { WxtAppConfig, defineAppConfig } from "wxt/sandbox";

declare module "wxt/sandbox" {
  export interface WxtAppConfig {
    isDev: boolean;
  }
}

const appConfig: WxtAppConfig = {
  isDev:
    typeof process !== "undefined"
      ? process.env.NODE_ENV === "development"
      : import.meta.env.DEV,
};

export default defineAppConfig(appConfig);

export { appConfig };
