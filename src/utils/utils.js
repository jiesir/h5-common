import C from '@/utils/constants';

export default {
    /**
     * 格式化时间
     * @param time 被格式化的时间
     * @param format 格式描述字符串，如： 'YYYY-MM-DD HH:mm:ss.S'
     * @returns {string} 格式化之后的内容。
     */
    date2str(time, format) {
        if (!time || !format) return '';
        const date = time instanceof Date ? time : new Date(time);
        const values = {
            Y: `${date.getFullYear()}`.substr(new RegExp(/(Y+)/).test(format) && -RegExp.$1.length), // 年
            M: `${date.getMonth() + 1}`,                                     // 月
            D: `${date.getDate()}`,                                          // 日
            H: `${date.getHours()}`,                                         // 时
            h: `${date.getHours() % 12}`,                                    // 时（12小时制）
            m: `${date.getMinutes()}`,                                       // 分
            s: `${date.getSeconds()}`,                                       // 秒
            q: `${Math.floor((date.getMonth() + 3) / 3)}`,                   // 季度
            S: `${date.getMilliseconds()}`,                                  // 毫秒
        };
        let match;
        while ((match = /([YMDHhmsqS])+/g.exec(format))) {
            format = format.replace(match[0], values[match[1]].padStart(match[0].length, '0'));
        }
        return format;
    },
    /**
     *
     * @param {*} n 随机数位数
     */
    countRandomn(n) {
        if (n < 1) return null;
        if (n > 21) return null;
        return parseInt((Math.random() + 1) * Math.pow(10, n - 1));
    },

    /**
     *
     * @param {*} n 获取多少位
     */
    countTimeStamp(n) {
        return (new Date().getTime().toString()).substr(0, n);
    },

    /**
     *
     */
    isAndroid() {
        const userAgent = navigator.userAgent;
        return userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1; //android终端或者uc浏览器
    },

    /**
     * 获取一个url中的查询参数并返回参数对象
     * @param {*} url String
     */
    getUrlParam(url) {
        if (!url || url.indexOf('?') === -1) {
            return {};
        }
        const params = url.split("?")[1].split("&")
        const param = {}
        params.forEach(item => {
            param[item.split("=")[0]] = item.split("=")[1]
        });
        return param;
    },

    /**
     * 将base64字符串转为arrayBuffer
     * @param {String} base64String
     */
    base64ToArrayBuffer(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    },

    /**
     * arrayBuffer转成Base64
     * @param {ArrayBuffer} buffer
     */
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },

    // 是否为空对象判断
    isEmptyObj(obj) {
        for (let key in obj) {
            return false;
        }
        return true;
    },

    // 分页加载器
    makeLoader(loader, processor, mode = 'DESC') {
        class Loader {
            constructor(loader, processor, mode) {
                this.loader = loader;
                this.processor = processor;
                this.list = [];
                this.mode = mode;
                this.page = 1;
                this.count = 10;
                this.loading = false;
                this.hasMore = true;
                this.loadToken = 0;
            }

            next(param) {
                const NO_OP = () => '';
                // ignore if in loading.
                if (this.loading || !this.hasMore) return new Promise(NO_OP);
                this.loading = true;
                const p = Object.assign({
                    curPage: this.page,
                    pageNum: this.count,
                }, param);
                const token = this.loadToken;
                return this.loader(p).then(resp => {
                    if (token !== this.loadToken) {
                        // ignore if has been reset
                        return new Promise(NO_OP);
                    }
                    let meta = {};
                    if (resp.status === C.OK) {
                        if (resp.data && Array.isArray(resp.data)) {
                            let list = null;
                            // you can return a new array, or mutate the original array.
                            if (this.processor) list = this.processor(resp.data);
                            if (!list) list = resp.data;
                            this.list = this.mode === 'ASC' ? list.concat(this.list) : this.list.concat(list);
                            this.hasMore = resp.data.length === p._count;
                        } else if (typeof resp.data === 'object' && !Array.isArray(resp.data)) {
                            let { ARRAY_TRAN_RESULT: list, ...other } = resp.data;
                            let l = null;
                            if (this.processor) l = this.processor(list);
                            if (l) list = l;
                            this.list = this.mode === 'ASC' ? list.concat(this.list) : this.list.concat(list);
                            this.hasMore = resp.data.ARRAY_TRAN_RESULT.length === p.pageNum;
                            meta = other;
                        } else {
                            this.hasMore = false;
                        }
                        this.page += 1;
                        this.loading = false;
                        return {
                            status: C.OK,
                            data: {
                                list: this.list,
                                hasMore: this.hasMore,
                                ...meta,
                            },
                        };
                    } else {
                        this.loading = false;
                        return resp;
                    }
                });
            }

            reset() {
                this.list = [];
                this.page = 1;
                this.loading = false;
                this.hasMore = true;
                this.loadToken += 1;
            }
        }

        return new Loader(loader, processor, mode);
    },
}
