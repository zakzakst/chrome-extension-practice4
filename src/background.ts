chrome.sidePanel
  .setPanelBehavior({
    openPanelOnActionClick: true,
  })
  .catch(console.error);

// NOTE: エラー出る。ちょっと詳細追えないのでいったんあきらめる
// chrome.commands.onCommand.addListener(async (command) => {
//   if (command === "toggle_side_panel") {
//     const currentWindow = await chrome.windows.getCurrent();
//     if (!currentWindow?.id) {
//       return;
//     }

//     await chrome.sidePanel.open({
//       windowId: currentWindow.id,
//     });
//   }
// });
