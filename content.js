// 权限 ["webRequest", "webRequestBlocking", "storage"]
// chrome.webRequest.onCompleted.addListener(
//     function (details) {
//         console.log("details",details)
//         if (
//             details.type === "xmlhttprequest" &&
//             details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")
//         ) {
//             const responseBody = details.responseBody;
//             // 存储响应数据到 localStorage 或发送到 background.js
//             console.log('responseBody', responseBody)
//             // localStorage.setItem("page_schema_list", responseBody);
//             // chrome.runtime.sendMessage({ type: "apiResponse", data: responseBody });
//         }
//     },
//     { urls: ["<all_urls>"], types: ["xmlhttprequest"] }
// );

chrome.webRequest.onCompleted.addListener(
    function(details) {
        
    //   if (
    //     details.type === "xmlhttprequest" &&
    //     details.url.includes("/api/64104/doctor/findAllRouterPagesByAppId")
    //   ) {
    //     const responseBody = details.responseBody;
    //     // Send API response data to background.js
    //     chrome.runtime.sendMessage({ type: "apiResponse", data: responseBody });
    //   }
    const responseBody = details.responseBody;
    // Send API response data to background.js
    chrome.runtime.sendMessage({ type: "apiResponse", data: responseBody });
    },
    { urls: ["<all_urls>"], types: ["xmlhttprequest"] }
  );