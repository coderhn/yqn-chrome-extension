// // 监听所有网络响应
// const currentUrl = window.location.href;

// chrome.runtime.sendMessage({ type: "contentToBackground", data: { url: currentUrl } });

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     alert('22211')
//     if (message.type === "getDevBranch") {
//         alert('111')
//         console.log("getDevBranch", message);
//         localStorage.setItem("dev_branch_name", "11111")
//     }
// });
