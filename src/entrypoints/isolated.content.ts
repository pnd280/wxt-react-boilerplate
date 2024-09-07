import { injectMainWorldScript } from "@/utils/script-injection";

export default defineContentScript({
  matches: ["*://*.google.com/*"],
  async main() {
    console.log("Isolated content script loaded");

    injectMainWorldScript({
      url: browser.runtime.getURL("/unlisted.js"),
    });
  },
});
