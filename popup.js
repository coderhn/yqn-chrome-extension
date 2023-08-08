// 获取当前标签页的URL
const lowCodeHost = "pr-ops.iyunquna.com";

function createAElement(data, port, schemaFeatureBranch) {
    const conatiner = document.querySelector("#container");
    const aElement = document.createElement('a');
    aElement.setAttribute('href', `https://ops.iyunquna.com/63005/configuration?pageId=${data.pageId}&appId=${port}&layout_level=1&source=页面配置&email_key=${schemaFeatureBranch}`);
    aElement.setAttribute('target', '_blank');
    aElement.innerText = `前往${data.pageTitle || data.desc}schema编辑页`;
    conatiner.appendChild(aElement);
    return aElement;
}

/**
 * 
 * @returns 获取background缓存的分支名
 */
const getCurBranchName = async () => {
    return await new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(["dev_branch_name"], (e) => {
                resolve(e.dev_branch_name);
            })
        } catch (error) {
            reject(error)
        }

    });
}

/**
 * 
 * @param {*} devBranchName 
 * @param {*} url 
 * @returns 获取指定分支的schema配置
 */
const getSchemaConfig = async (devBranchName, url) => {
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

    return await fetch(requestUrl, {
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
    }).then((res) => res.text()).then((res) => JSON.parse(res));
}

/**
 * 
 * @param {*} data 
 * @param {*} url 
 * @returns 匹配当前的页面对应的schema列表
 */
const matchCurrentPageUrl = (data, url) => {
    return data.filter((d) => {
        // 兼容路由带参数
        if (/:/.test(d.path)) {
            return url.pathname.startsWith(d.path.split(":")[0])
        }
        return d.path === url.pathname
    })
}

const renderPopupElement = (matchedCurrentPageUrls, url, devBranchName) => {
    if (matchedCurrentPageUrls.length) {
        // 成功匹配到当前应用页面的schema开发页面
        matchedCurrentPageUrls.forEach((d) => createAElement(d, url.port, devBranchName));
    }
}

/**
 * 初始化扩展页面
 */
const initPopupPage = async () => {
    const devBranchName = await getCurBranchName()
    console.log("devBranchName", devBranchName);
    chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
        if (!tabs.length) {
            // TODO 容错提示
            return;
        }
        const curURL = new URL(tabs[0].url);
        const schemaConfig = await getSchemaConfig(devBranchName, curURL);
        if (schemaConfig.code === 200 && Array.isArray(schemaConfig.data) && schemaConfig.data.length) {
            localStorage.setItem('page_schema_list',JSON.stringify(schemaConfig.data));
            const matchedCurrentPageUrls = matchCurrentPageUrl(schemaConfig.data, curURL);
            renderPopupElement(matchedCurrentPageUrls, curURL, devBranchName);
        }
    })
}

initPopupPage();

// function createLoadingElementByParent() {
//     const conatiner = document.querySelector("#container");
//     const text = document.createElement('span');
//     text.innerHTML = '初始化获取schema配置中....'
//     conatiner.appendChild(text);
//     return text;
// }



