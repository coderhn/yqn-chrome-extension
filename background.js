// 当前浏览器窗口的标签页列表
chrome.tabs.query({ active: true }, function (tabs) {
    // 获取最后一个标签页的 ID
    // 监听第一个激活的网页的网络请求
    const lastTabId = tabs[0]?.id;
    console.log('tabs',tabs);
  
    if (lastTabId) {
      // 监听指定标签页的网络请求
      chrome.webRequest.onCompleted.addListener(
        function (details) {
          // 在控制台中打印响应结果
          console.log("Received network response:", details);
        },
        {
          urls: ["<all_urls>"],
          tabId: lastTabId
        }
      );
    }
  });
  