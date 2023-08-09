const KEYS = {
    PAGE_SCHEMA_LIST: 'page_schema_list', // 业务应用从schema获取到的页面配置相关信息
    DEV_BRANCH_NAME: 'dev_branch_name',// 业务应用分支
}

const guid = () => {
    let d = Date.now();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = (d + Math.random() * 16) % 16 | 0;

        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

const setLocalStorage = (k,d) => {
    try {
        localStorage.setItem(k, d);
        return true;
    } catch (error) {
        return false;
    }
}

const getLocalStorage = (k) => {
    const res = localStorage.getItem(k);
    try {
        return JSON.parse(res);
    } catch (error) {
        console.error(error)
    }
}



async function getAllCookies(storeId) {
    const cookies = await chrome.cookies.getAll({ storeId });
    console.log("cookies", cookies);
    return cookies;
}

/**
 * 
 * @param {*} obj 
 * @param {*} targetKey 
 * @returns 递归查找pageId
 */
function findKeyAndSiblingData(obj, targetKey) {
    let result = [];

    if (typeof obj === 'object' && obj !== null) {
        if (targetKey in obj) {
            // 如果找到目标键，将目标键和值添加到结果中
            // const key = String(obj[targetKey]);
            result.push(JSON.parse(JSON.stringify(obj)));
        }

        for (const key in obj) {
            if (obj.hasOwnProperty(key) && key !== targetKey) {
                // 递归遍历子对象，并将子对象和其父对象传递给下一层级
                result = result.concat(findKeyAndSiblingData(obj[key], targetKey, obj));
            }
        }
    }

    return result;
}

