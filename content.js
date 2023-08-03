// content.js

// 假设要存储的数据是一个对象
const data = {
    username: 'john_doe',
    score: 100,
    level: 5,
  };
  
  // 发送消息给后台页，存储数据
  chrome.runtime.sendMessage({ action: 'saveData', data: data }, (response) => {
    console.log('Data saved:', response);
  });
  