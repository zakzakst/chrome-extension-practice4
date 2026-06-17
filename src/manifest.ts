/// <reference types="chrome" />
import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "CHROME MEMO",
  version: "1.0.0",

  permissions: ["storage", "sidePanel"],

  // action: {
  //   default_popup: "src/pages/popup/index.html",
  //   default_icon: {
  //     "16": "icons/icon-16.png",
  //     "32": "icons/icon-32.png",
  //   },
  // },

  side_panel: {
    default_path: "src/pages/side-panel/index.html",
  },

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

  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },

  commands: {
    toggle_side_panel: {
      suggested_key: {
        default: "Ctrl+Shift+Q",
        mac: "Command+Shift+Q",
      },

      description: "メモを開閉する",
    },
  },
});
