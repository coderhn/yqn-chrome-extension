// 获取当前标签页的URL
const lowCodeHost = "pr-ops.iyunquna.com";

function createAElement(data, port, schemaFeatureBranch, id) {
  const conatiner = document.querySelector(`#${id}`);
  const aElement = document.createElement("a");
  aElement.setAttribute(
    "href",
    `https://ops.iyunquna.com/63005/configuration?pageId=${data.pageId}&appId=${port}&layout_level=1&source=页面配置&email_key=${schemaFeatureBranch}`
  );
  aElement.setAttribute("target", "_blank");
  aElement.innerHTML = `前往<b style="color:#000000">${data.pageTitle || data.desc
    }</b>schema编辑页`;
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
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 *
 * @returns 获取最近一次打开的子页面
 */
const getCurChildrenPage = async () => {
  return await new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(["children_page"], (e) => {
        resolve(e.children_page);
      });
    } catch (error) {
      reject(error);
    }
  });
};

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
      xSourceAppId: url.port,
    },
    model: {
      appId: url.port,
      env: "qa4",
      featureBranch: devBranchName,
    },
  };

  return await fetch(requestUrl, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh,zh-CN;q=0.9",
      "content-type": "text/plain",
      "sec-ch-ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
    },
    referrer: "https://qa4-local-work.yqn.com:62100/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((res) => JSON.parse(res));
};

/**
 *
 * @param {*} devBranchName
 * @param {*} url
 * @returns 获取
 */
const findPageByPageId = async (devBranchName, url, pageId) => {
  const uuid = guid();
  const requestUrl = `https://gw-ops.iyunquna.com/api/64104/doctor/findPageByPageId?guid=${uuid}`;
  const body = {
    header: {
      guid: uuid,
      lang: "zh",
      timezone: "Asia/Shanghai",
      xSourceAppId: url.port,
    },
    model: {
      appId: url.port,
      env: "qa4",
      featureBranch: devBranchName,
      pageId,
    },
  };
  return await fetch(requestUrl, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh,zh-CN;q=0.9",
      "content-type": "text/plain",
      "sec-ch-ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
    },
    referrer: "https://qa4-local-work.yqn.com:62100/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify(body),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((res) => JSON.parse(res));
};

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
      return url.pathname.startsWith(d.path.split(":")[0]);
    }
    return d.path === url.pathname;
  });
};

const renderPopupElement = async (matchedCurrentPageUrls, url, devBranchName, cleanCache) => {
  if (matchedCurrentPageUrls.length) {
    const needRequestPageIds = matchedCurrentPageUrls.filter(
      (d) => cleanCache || !Boolean(localStorage.getItem(`${d.pageId}`))
    );

    const allChildrenPageConfig = await Promise.all(
      needRequestPageIds.map((d) =>
        findPageByPageId(devBranchName, url, d.pageId).then((res) => ({
          data: res.data,
          pageId: d.pageId,
        }))
      )
    );

    needRequestPageIds.forEach((d, i) =>
      localStorage.setItem(`${d.pageId}`, JSON.stringify(allChildrenPageConfig[i].data))
    );

    // 成功匹配到当前应用页面的schema开发页面
    matchedCurrentPageUrls.forEach((d) => {
      createAElement(d, url.port, devBranchName, "mainPageList");
      const curChildrenPageConfig =
        JSON.parse(localStorage.getItem(`${d.pageId}`)) ||
        allChildrenPageConfig.find((v) => v.pageId === d.pageId);
      if (Boolean(curChildrenPageConfig)) {
        findKeyAndSiblingData(curChildrenPageConfig, "pageId")
          .filter((d) => "desc" in d)
          .forEach((v) => createAElement(v, url.port, devBranchName, "childrenPageList"));
      }
    });
  }
};

/**
 *
 * @param {*} devBranchName
 * @param {*} curURL
 * @returns 通过调用shcema接口初始化主页路由节点
 */
const initMainPageByRequest = async (devBranchName, curURL, cleanCache) => {
  const schemaConfig = await getSchemaConfig(devBranchName, curURL);
  if (schemaConfig.code === 200 && Array.isArray(schemaConfig.data) && schemaConfig.data.length) {
    localStorage.setItem(`${devBranchName}`, JSON.stringify(schemaConfig.data));
    localStorage.setItem("devBranchName", JSON.stringify(devBranchName));
    const matchedCurrentPageUrls = matchCurrentPageUrl(schemaConfig.data, curURL);
    renderPopupElement(matchedCurrentPageUrls, curURL, devBranchName, cleanCache);
  }

};

/**
 *
 * @param {*} devBranchName
 * @param {*} curURL
 * @returns 通过缓存初始化主页路由节点
 */
const initMainPageByCache = async (pageSchemaList, devBranchName, curURL) => {
  const matchedCurrentPageUrls = matchCurrentPageUrl(pageSchemaList, curURL);
  renderPopupElement(matchedCurrentPageUrls, curURL, devBranchName);
};

/**
 * 初始化扩展页面
 */
const initPopupPage = async () => {
  chrome.tabs.query({ currentWindow: true, active: true }, async function (tabs) {
    if (!tabs.length) {
      // TODO 容错提示
      return;
    }
    const devBranchName = await getCurBranchName();
    const curURL = new URL(tabs[0].url);
    const pageSchemaList = JSON.parse(localStorage.getItem(`${devBranchName}`));

    await clearCache(devBranchName,curURL);
  

    if (Array.isArray(pageSchemaList) && pageSchemaList.length) {
      initMainPageByCache(pageSchemaList, devBranchName, curURL);
      return;
    }

    await initMainPageByRequest(devBranchName, curURL);

  });
};

async function clearCache(devBranchName,curURL){
  const btnElement = document.createElement('button');
  btnElement.innerText = '清空缓存';
  document.body.appendChild(btnElement);
  console.log("btnElement", btnElement);
  btnElement.addEventListener('click', async function () {
    const mainPageList = document.getElementById("mainPageList");

    while (mainPageList.firstChild) {
      mainPageList.removeChild(mainPageList.firstChild);
    }
    const childrenPageList = document.getElementById("childrenPageList");

    while (childrenPageList.firstChild) {
      childrenPageList.removeChild(childrenPageList.firstChild);
    }

    await initMainPageByRequest(devBranchName, curURL);
  })
}


initPopupPage();



