// 获取当前标签页的URL
const lowCodeHost = "pr-ops.iyunquna.com";
chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    console.log("tabs", tabs)
    const { id } = tabs[0];
    var url = new URL(tabs[0].url);
    if (lowCodeHost !== url.host) {
        // chrome.storage.local.set({ "appId": url.port }).then(()=>{
        //     console.log("Value is set")
        // });
    }

    if (url.host === lowCodeHost) {
        // chrome.storage.local.get('appId', function(data) {
        //     console.log('从chrome.storage中读取的URL:', data.appId);
        //   });
        const buttonElement = document.createElement('button');
        buttonElement.innerText = "复制应用ID";
        document.body.appendChild(buttonElement);
        return;
    }

    const res = await getAllCookies('0');

    const uuid = guid();
    const requestUrl = `https://pr-gw-ops.iyunquna.com/api/64104/pageConfigs/findAll?guid=${uuid}`;
    const body = {
        header: {
            guid: uuid,
            lang: "zh",
            timezone: "Asia/Shanghai",
            xCallerId: "feature/f0fc2422_1_both",
            xSourceAppId: 63005
        },
        model: {
            appId: url.port,
            isModified: 0,
            page: 1,
            pageRouter: url.pathname,
            size: 20
        }
    }

    // fetch(requestUrl, {
    //     "headers": {
    //         "accept": "application/json, text/plain, */*",
    //         "accept-language": "zh,zh-CN;q=0.9",
    //         "content-type": "text/plain",
    //         "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"macOS\"",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-site",
    //         "cookie": "lk=de39808d-9017-471c-a15c-1c215dfa237e; fg=46562904e301821e533edd0db4643030; fgFlag=1; gitToken=-Qb75rfyjE7iaos-uxmG; qa_f_tid=6bd057e685d8b859243732c62e50e982; f_tid=661c542e9ba957c284d6481fb237ce8d; pr_f_tid=8d3df917a4a19fd18b5ba6efc143404c; JSESSIONID=3B08B63CB28CAE26E88F25E453F7A036; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%221948905%22%2C%22first_id%22%3A%2218899b0f4847ea-0bb3183afef24e-1c525634-1484784-18899b0f485113f%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTg4OTliMGY0ODQ3ZWEtMGJiMzE4M2FmZWYyNGUtMWM1MjU2MzQtMTQ4NDc4NC0xODg5OWIwZjQ4NTExM2YiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIxOTQ4OTA1In0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%221948905%22%7D%2C%22%24device_id%22%3A%2218899b0f4847ea-0bb3183afef24e-1c525634-1484784-18899b0f485113f%22%7D; acw_tc=b92e123b39587c92dfeb0dfa879f49b265c6b71e9165d81b990ee16d94941353",
    //         "Referer": "https://pr-ops.iyunquna.com/",
    //         "Referrer-Policy": "strict-origin-when-cross-origin"
    //     },
    //     "body": JSON.stringify(body),
    //     "method": "POST"
    // }).then((res) => {
    //     console.log("res", res.json());
    // });
});

async function getAllCookies(storeId) {
    const cookies = await chrome.cookies.getAll({ storeId });
    console.log("cookies", cookies);
    return cookies;
}




// chrome.storage.sync.set({"appId":})

