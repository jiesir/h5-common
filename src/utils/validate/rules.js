/**
 * rules.js 表单校验规则
 */

/**
 * 校验数据是否为空
 * @param value
 * @returns {boolean}
 */
export const empty = (value) => value === undefined
    || value === ''
    || value === null
    || (Array.isArray(value) && value.length === 0)                     // empty array
    || (typeof value === 'object' && Object.keys(value).length === 0)   // empty object
    || (typeof value === 'number' && isNaN(value));                    // is NaN

/**
 * 校验必要数据
 * @param value
 * @returns {boolean}
 */
export const required = value => value !== undefined
    && value !== null
    && !(typeof value === 'string' && value.trim().length === 0)        // not empty string
    && !(typeof value === 'number' && isNaN(value));                     // not NaN


/**
 * 校验数组元素不能重复
 * @param value
 * @returns {boolean}
 */
export const noRepeat = value => !Array.isArray(value)
    || value.every((item, index, arr) => !arr.includes(item, index + 1));

/**
 * 校验范围，包含左、右界限
 * @param value
 * @param param
 * @returns {boolean}
 */
export const range = (value, param) => !empty(value)
    && value >= param[0]
    && value <= param[1];


/**
 * 校验数据是否低于最小值
 * @param value
 * @param param
 * @returns {boolean}
 */
export const min = (value, param) => !empty(value) && value >= param;

/**
 * 校验数据是否高于最大值
 * @param value
 * @param param
 * @returns {boolean}
 */
export const max = (value, param) => !empty(value) && value <= param;

/**
 * 校验数据是否存在于指定数组中
 * @param value
 * @param param
 * @returns {boolean}
 */
export const contains = (value, param) => !empty(value) && param.includes(value);

/**
 * 校验数据是否等于某个值
 * @param value
 * @param param
 * @returns {boolean}
 */
export const equal = (value, param) => value === param;

/**
 * 校验数字
 * @param value
 * @returns {boolean}
 */
export const isNumber = value => {
    const regex = /^[-+]?\d+(\.(\d+)?)?$/;
    return (typeof value === 'number' && !isNaN(value))
        || (typeof value === 'string' && regex.test(value));
};

/**
 * 校验身份证号
 * @param value
 * @returns {boolean}
 */
export const isIdcard = value => {
    const regex = /^[1-9]\d{5}[12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9X]$/;
    return typeof value === 'string' && regex.test(value);
};

/**
 * 校验整数
 * @param value
 * @returns {boolean}
 */
export const isDigit = value => {
    const regex = /^\d+$/;
    return (typeof value === 'string' && regex.test(value))
        || (typeof value === 'number' && regex.test(String(value)));
};

/**
 * 校验金额数字
 * @param value
 * @returns {boolean}
 */
export const isMoney = (value) => {
    const regex = /^(0|[1-9]\d*|[1-9]\d{0,2}(,\d{3})*)(\.(\d{0,3}))?$/;
    return (typeof value === 'string' && regex.test(value))
        || (typeof value === 'number' && regex.test(String(value)));
};

/**
 * 校验日期
 * @param value
 * @returns {boolean}
 */
export const isDate = value => !/Invalid|NaN/.test(new Date(value).toString());

/**
 * 校验 ISO 日期字符串
 * @param value
 * @returns {boolean}
 */
export const isIsoDate = value => {
    const regex = /^([+-]\d{2})?\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-4]):([0-5]\d):([0-5]\d)\.\d{3}\w/;
    return regex.test(String(value));
};

/**
 * 校验网址
 * @param value
 * @returns {boolean}
 */
export const isUrl = value => {
    const regex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return empty(value) || regex.test(value);
};

/**
 * 校验电话号码
 * @param value
 * @returns {boolean}
 */
export const isTel = value => {
    const regex = /^((\+\d+[ -]?)?1[3-9]\d{9}|(\+\d+-)?([0-9]{3,4}-)?[0-9]{7,8})$/;
    return empty(value) || regex.test(value);
};

/**
 * 校验email
 * @param value
 * @returns {boolean}
 */
export const isEmail = value => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return empty(value) || regex.test(value);
};

/**
 * 校验是否是字母
 * @param value
 * @returns {boolean}
 */
export const isAlpha = value => {
    const regex = /^[a-zA-Z]+$/;
    return empty(value) || regex.test(value);
};