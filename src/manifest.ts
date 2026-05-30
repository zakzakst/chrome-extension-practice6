/// <reference types="chrome" />
import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Extension Template",
  version: "1.0.0",

  permissions: ["storage"],

  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },

  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
    },
  },

  // side_panel: {
  //   default_path: "src/pages/side-panel/index.html",
  // },

  options_ui: {
    page: "src/pages/options/index.html",
    open_in_tab: true,
  },

  background: {
    service_worker: "src/background.ts",
    type: "module",
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.ts"],
    },
  ],
});
