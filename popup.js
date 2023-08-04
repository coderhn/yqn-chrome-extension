// 获取当前标签页的URL
const lowCodeHost = "pr-ops.iyunquna.com";
const appFeatureBranch = 'feature/f0fc2422_1_both';
const schemaFeatureBranch = 'feature/051867dc_1_both';

chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    var url = new URL(tabs[0].url);


    const pageShcemaList = getLocalStorage(KEYS.PAGE_SCHEMA_LIST);

    if (pageShcemaList && getLocalStorage(KEYS.APP_BRANCH_NAME) === appFeatureBranch) {
        createAElement(pageShcemaList.find((d) => d.path === url.pathname), url.port, schemaFeatureBranch);
        return;
    }

    await initView(url);

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

async function initView(url) {
    const conatiner = document.querySelector("#container");
    const text = createLoadingElementByParent();
    const uuid = guid();
    const requestUrl = `https://gw-ops.iyunquna.com/api/64104/doctor/findAllRouterPagesByAppId?guid=${uuid}`;
    const body = {
        header: {
            guid: uuid,
            lang: "zh",
            timezone: "Asia/Shanghai",
            xCallerId: appFeatureBranch,
            xSourceAppId: url.port
        },
        model: {
            appId: url.port,
            env: "qa4",
            featureBranch: appFeatureBranch
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
            setLocalStorage(KEYS.APP_BRANCH_NAME,JSON.stringify(appFeatureBranch))
            createAElement(curPageSchemaConfig, url.port, schemaFeatureBranch)
        } else {
            setTimeout(() => {
                text.innerHTML = `初始化失败:在schema列表中没有找到当前页面的配置`
            }, 1000);
        }

        // const aElement = document.createElement('a');
        // aElement.setAttribute('href', `https://ops.iyunquna.com/63005/configuration?pageId=${curPageSchemaConfig.pageId}&appId=${url.port}&layout_level=1&source=页面配置&email_key=${schemaFeatureBranch}`);
        // aElement.setAttribute('target', '_blank');
        // aElement.innerText = `前往${curPageSchemaConfig.pageTitle || curPageSchemaConfig.desc}schema编辑页`;
        // conatiner.appendChild(aElement);
    } else {
        setTimeout(() => {
            text.innerHTML = `初始化失败:${schemaRes.msg}`
        }, 1000);
    }
}
