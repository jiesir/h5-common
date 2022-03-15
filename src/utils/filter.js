

export default {
    // 格式化显示距离
    formatDistance(distance) {
        if (!distance) {
            return '';
        }
        if (distance < 1000) {
            return `${distance}M`;
        }
        return `${(distance / 1000).toFixed(2)}KM`;
    },

    // 格式化金额数字 12,333.90
    formatMoney(s, n) {
        /*
         * 参数说明：
         * s：要格式化的数字
         * n：保留几位小数
         * */
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
        var l = s
            .split('.')[0]
            .split('')
            .reverse(),
            r = s.split('.')[1];
        let t = '';
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
        }
        return (
            t
                .split('')
                .reverse()
                .join('') +
            '.' +
            r
        );
    },

}