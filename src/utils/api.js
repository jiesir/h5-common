import { Toast } from "vant";
import axios from "axios";
import qs from "qs";
import C from "./constants";
import router from '@router';

/**
 * 发起请求
 * @param {String} code 接口号
 * @param {Object} data 上送数据
 * @param {Object} options 请求配置
 */
export const rpc = (
    code,
    data = {},
    options = { method: "POST", hideloading: true }
) => {
    if (options.hideloading) {
        Toast.loading({
            duration: 0,
            message: "加载中...",
            forbidClick: true
        });
    }
    if (C.IS_MOCK === 'true') {
        return new Promise((resolve, reject) => {
            const data = require(`@mock/${code}.json`);
            if (options.hideloading) {
                Toast.clear();
            }
            if (data) {
                resolve(data);
            } else {
                reject(new Error("MOCK未找到", "mock failed"));
            }
        });
    }

    let url = `${C.BASE_URL}${C.MAPPING[code]}?_t=${new Date().getTime()}`;
    console.warn(url)
    const reqConfig = {
        url: `${url}`,
        method: options.method.toUpperCase() || 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    if (reqConfig.method.toUpperCase() == 'POST') {
        reqConfig.body = qs.stringify(data);
    } else {
        url = `${url}&${qs.stringify(data)}`;
    }

    return new Promise((resolve, reject) => {
        axios(reqConfig)
            .then(res => {
                if (options.hideloading) {
                    Toast.clear();
                }
                if (res.ok == true) {
                    resolve(res.json());
                } else {
                    switch (res.status) {
                        case 500: reject(new Error("网络请求超时", "fetch")); break;
                        default: reject(new Error("网络错误", "fetch")); break;
                    }
                }
            })
            .catch(err => {
                if (options.hideloading) {
                    Toast.clear();
                }
                reject(new Error("请求服务错误", "fetch"));
            });
    });
};

/**
 * 打开页面
 * @param {String} url 页面地址
 * @param {Object} params 页面传参
 */
export const pushWindow = (url, params = {}) => {
    router.push({ path: url, query: params });
};

/**
 * 获取参数
 * @param {Object} that 页面实例
 */
export const params = that => {
    const _this = that;
    return _this.$route.query;
};

/**
 * 关闭页面
 * @param {Object} params 返回参数
 * @param {Boolean} flush 返回是否刷新页面
 */
export const back = (params = {}, flush = true) => {
    if (flush) {
        // 后退刷新
        router.go(-1);
    } else {
        // 后退不刷新
        router.back();
    }
};

/**
 * 生成样式名称
 */
export function bem() {
    const pageName = location.hash.split("?")[0].split("/")[2];
    const args = Array.from(arguments);
    if (args.length !== 0) {
        let buffer = "";
        args.forEach(item => {
            buffer += "-" + item;
        });
        return `${pageName}${buffer}`;
    } else {
        return `${pageName}`;
    }
}

/**
 * 设置数据缓存
 * @param {String} key 键
 * @param {Object} value 值
 */
export const setSessionStorage = (key, value) => {
    sessionStorage.setItem(key, value);
};

/**
 * 获取数据缓存
 * @param {String} key 键
 */
export const getSessionStorage = key => {
    return sessionStorage.getItem(key);
};

/**
 * 删除数据缓存
 * @param {String} key 键
 */
export const deleteSessionStorage = key => {
    return sessionStorage.removeItem(key);
};

/**
 * 设置本地数据缓存
 * @param {String} key 键
 * @param {Object} value 值
 */
export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

/**
 * 获取本地数据缓存
 * @param {String} key 键
 */
export const getLocalStorage = key => {
    return localStorage.getItem(key);
};

/**
 * 删除本地数据缓存
 * @param {String} key 键
 */
export const deleteLocalStorage = key => {
    return localStorage.removeItem(key);
};
