// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'saveData') {
//     // 存储数据到 chrome.storage.local
//     chrome.storage.local.set({ myData: message.data }, () => {
//       console.log('Data saved to local storage.');
//     });
//   } else if (message.action === 'getData') {
//     // 读取数据从 chrome.storage.local
//     chrome.storage.local.get(['myData'], (result) => {
//       const data = result.myData;
//       sendResponse(data);
//     });
//     return true; // 必须返回 true，以保持长连接，以便异步获取数据
//   }
// });


chrome.runtime.onInstalled.addListener((_reason) => {
  // @DESC 安装完插件后新开一个页面显示demo/index.html
  // console.log('11111');
  // chrome.co
  // chrome.cookies.getAllCookieStores((cookies)=>{
  //   console.log("cookies",cookies)
  // })
  // chrome.cookies.getAllCookieStores((cookies)=>{
  //   console.log("cookies",cookies)
  // })
  // chrome.tabs.create({
  //   url: 'demo/index.html'
  // });
});
