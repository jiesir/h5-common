
/**
 * 结构定义：
 *   type Method = string | Function | {
 *    name: string,
 *    param: any,
 *    message?: string,
 *  };
 *
 *    type Rule = {
 *       value: any,
 *       method: Method | Array<Method>,
 *       param?: any,
 *       message: string,
 *    }
 */
import * as Rules from './rules';
import { Toast } from 'vant';

/**
 * 表单校验
 * @param rules
 * @returns {*}
 */
const validate = (rules) => {
    const checkRule = (rule) => Array.isArray(rule.method)
        ? rule.method.every(item => typeof item === 'object'
            ? doCheck(rule.value, item.name, item.param, item.message || rule.message)
            : doCheck(rule.value, item, rule.param, rule.message))
        : doCheck(rule.value, rule.method, rule.param, rule.message);
    return Array.isArray(rules) ? rules.every((item) => checkRule(item)) : checkRule(rules);
};

const doCheck = (value, method, param, message) => {
    let valid = false;
    const func = typeof method === 'string' ? Rules[method] : method;
    if (typeof func === 'function') {
        valid = func(value, param);
        if (!valid) {
            Toast.fail(message);
        }
    } else {
        console.error(`未定义的校验规则:${method}`);
    }
    return valid;
};

export default validate;
