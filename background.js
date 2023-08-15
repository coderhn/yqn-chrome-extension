chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // 在控制台中打印响应结果
    if (
      details.type === "xmlhttprequest" &&
      details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")
    ) {
      const firstRaw = details.requestBody.raw[0];
      const decoder = new TextDecoder();
      // 将缓冲二进制字节转成文本，再转换成json对象
      const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
      // console.log("requestBody", requestBody);
      chrome.storage.local.set({ dev_branch_name: requestBody.model.featureBranch }).then(() => {
        console.log("Value is set");
      });
    }
    if (
      details.type === "xmlhttprequest" &&
      details.url.includes("/api/64104/doctor/findPageByPageId")
    ) {
      const firstRaw = details.requestBody.raw[0];
      const decoder = new TextDecoder();
      // 将缓冲二进制字节转成文本，再转换成json对象
      const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
      chrome.storage.local.set({ children_page: requestBody.model.pageId }).then(() => {
        console.log("Value is set");
      });
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"],
  },
  ["requestBody"]
);



chrome.action.onClicked.addListener(openDemoTab);

function openDemoTab() {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason !== chrome.runtime.OnInstalledReason.INSTALL) {
      return;
    }
    chrome.tabs.create({ url: "./tutorial.html" });
  });

  // chrome.tabs.query({active: true, lastFocusedWindow: true},function(tabs){
  //   const [tab] = tabs;
  //   chrome.scripting.insertCSS({
  //     target: { tabId: tab.id },
  //     files: ["./content.css"]
  // })
  //     .then(() => {
  //         console.log("INJECTED THE FOREGROUND STYLES.");
  
  //         chrome.scripting.executeScript({
  //             target: { tabId: tab.id },
  //             files: ["./content.js"]
  //         })
  //             .then(() => {
  //                 console.log("INJECTED THE FOREGROUND SCRIPT.");
  //             });
  //     })
  //     .catch(err => console.log(err))
  // })
}











