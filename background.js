chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // 在控制台中打印响应结果
    if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
      const firstRaw = details.requestBody.raw[0];
      const decoder = new TextDecoder();
      // 将缓冲二进制字节转成文本，再转换成json对象
      const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
      // console.log("requestBody", requestBody);
      chrome.storage.local.set({ dev_branch_name: requestBody.model.featureBranch }).then(() => {
        console.log("Value is set");
      });
    }
    if(details.type === 'xmlhttprequest'&&details.url.includes("/api/64104/doctor/findPageByPageId")){
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

// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
//   const msg = `Navigation to ${e.request.url} redirected on tab ${e.request.tabId}.`;
//   console.log(msg);
// });



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "apiResponse") {
    const apiResponse = message.data;
    console.log("API Response in background.js:", apiResponse);
    // Here you can process the API response as needed
  }
});