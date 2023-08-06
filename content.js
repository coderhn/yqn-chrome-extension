// content_script.js

// 监听所有网络响应
fetch = window.fetch || fetch;
XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, {
  apply(target, thisArg, argumentsList) {
    thisArg.addEventListener("load", function () {
      const response = {
        url: thisArg.responseURL,
        status: thisArg.status,
        statusText: thisArg.statusText,
        responseText: thisArg.responseText
      };
      // 向background脚本发送响应信息
      chrome.runtime.sendMessage({ type: "response", response });
    });
    return target.apply(thisArg, argumentsList);
  }
});
