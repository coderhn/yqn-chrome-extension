// 获取当前标签页的URL
const lowCodeHost = "pr-ops.iyunquna.com";

chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
    if (!tabs.length) {
        return;
    }

    chrome.runtime.sendMessage({ eventName: "getCurrentTab", data: tabs[0] });

    // chrome.runtime.onMessage.addListener(async function (message) {
    //     var url = new URL(tabs[0].url);
    //     if (message.eventName === "getDevBranch" && message.data) {
    //         const devBranchName = message.data;
    //         console.log("成功获取到对应开发分支", devBranchName);
            // const cacheSchemaList = getLocalStorage(KEYS.PAGE_SCHEMA_LIST);
            // const cacheDevBranchName = getLocalStorage(KEYS.DEV_BRANCH_NAME);

            // // INFO 如果缓存中存在当前用户选择的分支并且存在当前分支的schemaList则直接读取缓存
            // if (cacheDevBranchName === devBranchName && Array.isArray(cacheSchemaList) && cacheSchemaList.length) {
            //     const curPageSchema = cacheSchemaList.find((d) => d.path === url.pathname)
            //     if (curPageSchema) {
            //         createAElement(curPageSchema, url.port, devBranchName)
            //     } else {
            //         await initView(url, devBranchName);
            //     }
            //     return;
            // }
            // await initView(url, devBranchName);
    //     }
    // });
    var url = new URL(tabs[0].url);
    const cacheSchemaList = getLocalStorage(KEYS.PAGE_SCHEMA_LIST);
    const cacheDevBranchName = getLocalStorage(KEYS.DEV_BRANCH_NAME);

    // INFO 如果缓存中存在当前用户选择的分支并且存在当前分支的schemaList则直接读取缓存
    if (cacheDevBranchName && Array.isArray(cacheSchemaList) && cacheSchemaList.length) {
        const curPageSchema = cacheSchemaList.find((d) => d.path === url.pathname)
        if (curPageSchema) {
            createAElement(curPageSchema, url.port, cacheDevBranchName)
        } else {
            await initView(url, cacheDevBranchName);
        }
        return;
    }
    await initView(url, cacheDevBranchName);

});

function createAElement(data, port, schemaFeatureBranch) {
    const conatiner = document.querySelector("#container");
    const aElement = document.createElement('a');
    aElement.setAttribute('href', `https://ops.iyunquna.com/63005/configuration?pageId=${data.pageId}&appId=${port}&layout_level=1&source=页面配置&email_key=${schemaFeatureBranch}`);
    aElement.setAttribute('target', '_blank');
    aElement.innerText = `前往${data.pageTitle || data.desc}schema编辑页`;
    conatiner.appendChild(aElement);
    return aElement;
}

function createLoadingElementByParent() {
    const conatiner = document.querySelector("#container");
    const text = document.createElement('span');
    text.innerHTML = '初始化获取schema配置中....'
    conatiner.appendChild(text);
    return text;
}

async function initView(url, devBranchName) {
    const conatiner = document.querySelector("#container");
    const text = createLoadingElementByParent();
    const uuid = guid();
    const requestUrl = `https://gw-ops.iyunquna.com/api/64104/doctor/findAllRouterPagesByAppId?guid=${uuid}`;
    const body = {
        header: {
            guid: uuid,
            lang: "zh",
            timezone: "Asia/Shanghai",
            xCallerId: devBranchName,
            xSourceAppId: url.port
        },
        model: {
            appId: url.port,
            env: "qa4",
            featureBranch: devBranchName
        }
    }


    const res = await fetch(requestUrl, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh,zh-CN;q=0.9",
            "content-type": "text/plain",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        "referrer": "https://qa4-local-work.yqn.com:62100/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then((res) => res.text());

    const schemaRes = JSON.parse(res);

    if (schemaRes.code === 200) {
        const curPageSchemaConfig = schemaRes.data.find((d) => d.path === url.pathname);
        if (curPageSchemaConfig) {
            setTimeout(() => {
                text.innerHTML = '初始化成功'
                conatiner.removeChild(text)
            }, 1000);
            setLocalStorage(KEYS.PAGE_SCHEMA_LIST, JSON.stringify(schemaRes.data));
            // setLocalStorage(KEYS.DEV_BRANCH_NAME, JSON.stringify(devBranchName))
            createAElement(curPageSchemaConfig, url.port, devBranchName)
        } else {
            setTimeout(() => {
                text.innerHTML = `初始化失败:在schema列表中没有找到当前页面的配置`
            }, 1000);
        }
    } else {
        setTimeout(() => {
            text.innerHTML = `初始化失败:${schemaRes.msg}`
        }, 1000);
    }
}

