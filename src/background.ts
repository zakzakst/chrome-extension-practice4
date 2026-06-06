chrome.sidePanel
  .setPanelBehavior({
    openPanelOnActionClick: true,
  })
  .catch(console.error);

// ショートカット設定
let isOpen = false;

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle_side_panel") {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (!tab?.windowId) {
      return;
    }

    if (isOpen) {
      await chrome.sidePanel.close({
        windowId: tab.windowId,
      });

      isOpen = false;
    } else {
      await chrome.sidePanel.open({
        windowId: tab.windowId,
      });

      isOpen = true;
    }
  });
});
