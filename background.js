// // 当前浏览器窗口的标签页列表
// // 无法在background页面使用localStorage

// async function getTabs(){
//   const res = await chrome.tabs.query({ active: true }, (tabs) => {
//     if (!tabs.length) {
//       return [];
//     }
//     return tabs;
//   });
//   return res;
// }
// chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
//   // if (message.type === "getCurrentTab") {
//   //   const tabId = message.data.id;
    // chrome.webRequest.onBeforeRequest.addListener(
    //   function (details) {
    //     // 在控制台中打印响应结果
    //     if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
    //       const firstRaw = details.requestBody.raw[0];
    //       const decoder = new TextDecoder();
    //       // 将缓冲二进制字节转成文本，再转换成json对象
    //       const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
    //       // console.log("requestBody", requestBody)
    //       // chrome.storage.local.set({ dev_branch_name: JSON.stringify(requestBody.model.featureBranch) });
    //       chrome.runtime.sendMessage({ type: "getDevBranch", data: requestBody.model.featureBranch })
    //     }
    //   },
    //   {
    //     urls: ["<all_urls>"],
    //     tabId: tabId,
    //     types: ["xmlhttprequest"],
    //   },
    //   ["requestBody"]
    // );

//   //   // chrome.webRequest.onBeforeRequest.addListener(
//   //   //   function (details) {
//   //   //     // 在控制台中打印响应结果
//   //   //     if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
//   //   //       // console.log("dispatch request:", details.requestBody);
//   //   //       const firstRaw = details.requestBody.raw[0];
//   //   //       const decoder = new TextDecoder();
//   //   //       // 将缓冲二进制字节转成文本，再转换成json对象
//   //   //       const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
//   //   //       setLocalStorage(KEYS.DEV_BRANCH_NAME, JSON.stringify(requestBody.model.featureBranch))
//   //   //       // chrome.runtime.sendMessage({ type: "getDevBranch", data: requestBody.model.featureBranch })
//   //   //     }

//   //   //     // if (details.requestBody && details.requestBody.formData) {
//   //   //     //   console.log("Form data:", details.requestBody.formData);
//   //   //     // }
//   //   //   },
//   //   //   {
//   //   //     urls: ["<all_urls>"],
//   //   //     tabId: tabId,
//   //   //     types: ["xmlhttprequest"],
//   //   //   },
//   //   //   ["requestBody"]
//   //   // );
//   // }
  
//   if (message.type === 'contentToBackground') {
//     const tabsList = await getTabs();
//     console.log("tabs", tabsList);
//     console.log("contentToBackground", message.data.url);
//     const tabId = tabsList.find((d)=>d.url===message.data.url)?.id;
//     console.log("tabId",tabId)
//     chrome.webRequest.onBeforeRequest.addListener(
//       function (details) {
//         // 在控制台中打印响应结果
//         if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
//           const firstRaw = details.requestBody.raw[0];
//           const decoder = new TextDecoder();
//           // 将缓冲二进制字节转成文本，再转换成json对象
//           const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
//           console.log("requestBody", requestBody)
//           // chrome.storage.local.set({ dev_branch_name: JSON.stringify(requestBody.model.featureBranch) });
//           chrome.runtime.sendMessage({ type: "getDevBranch", data: requestBody.model.featureBranch })
//         }
//       },
//       {
//         urls: ["<all_urls>"],
//         tabId: tabId,
//         types: ["xmlhttprequest"],
//       },
//       ["requestBody"]
//     );
//   }
// });

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // 在控制台中打印响应结果
    if (details.type === "xmlhttprequest" && details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")) {
      const firstRaw = details.requestBody.raw[0];
      const decoder = new TextDecoder();
      // 将缓冲二进制字节转成文本，再转换成json对象
      const requestBody = JSON.parse(decoder.decode(firstRaw.bytes));
      // console.log("requestBody", requestBody);
      // chrome.runtime.sendMessage({ type: "getDevBranch", data: requestBody.model.featureBranch });
      chrome.storage.local.set({ dev_branch_name: requestBody.model.featureBranch }).then(() => {
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

