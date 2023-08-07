// 当前浏览器窗口的标签页列表

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.eventName === "getCurrentTab") {
    console.log("收到来自popup页面的消息：", message);
    const tabId = message.data.id;
    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        // 在控制台中打印响应结果
        if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
          // console.log("dispatch request:", details.requestBody);
          const firstRaw = details.requestBody.raw[0];
          const decoder = new TextDecoder();
          // 将缓冲二进制字节转成文本，再转换成json对象
          const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
          setLocalStorage(KEYS.DEV_BRANCH_NAME, JSON.stringify(requestBody.model.featureBranch))
          // chrome.runtime.sendMessage({ eventName: "getDevBranch", data: requestBody.model.featureBranch })
        }

        // if (details.requestBody && details.requestBody.formData) {
        //   console.log("Form data:", details.requestBody.formData);
        // }
      },
      {
        urls: ["<all_urls>"],
        tabId: tabId,
        types: ["xmlhttprequest"],
      },
      ["requestBody"]
    );

    // chrome.webRequest.onBeforeRequest.addListener(
    //   function (details) {
    //     // 在控制台中打印响应结果
    //     if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
    //       // console.log("dispatch request:", details.requestBody);
    //       const firstRaw = details.requestBody.raw[0];
    //       const decoder = new TextDecoder();
    //       // 将缓冲二进制字节转成文本，再转换成json对象
    //       const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
    //       setLocalStorage(KEYS.DEV_BRANCH_NAME, JSON.stringify(requestBody.model.featureBranch))
    //       // chrome.runtime.sendMessage({ eventName: "getDevBranch", data: requestBody.model.featureBranch })
    //     }

    //     // if (details.requestBody && details.requestBody.formData) {
    //     //   console.log("Form data:", details.requestBody.formData);
    //     // }
    //   },
    //   {
    //     urls: ["<all_urls>"],
    //     tabId: tabId,
    //     types: ["xmlhttprequest"],
    //   },
    //   ["requestBody"]
    // );
  }
});
