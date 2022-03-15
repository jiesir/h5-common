import INTERFACE from '@config/adapter.config';

const C_API = {
    BASE_URL: `${process.env.AXIOS_BASE_URL}${process.env.AXIOS_BASE_API}`,
    STATIC: '',
    HTTP_TIMEOUT: 60000,
    WITH_CREDENTIALS: true,
    IS_MOCK: `${process.env.IS_MOCK}`
};

const C_RESP = {
    ERR_HTTP_BAD_REQUEST: 400,
    ERR_HTTP_SESSION_TIMEOUT: 401,
    ERR_HTTP_FORBIDDEN: 403,
    ERR_HTTP_NOT_FOUND: 404,
    ERR_HTTP_NOT_ALLOWED: 405,
    ERR_HTTP_SERVER_ERROR: 500,
    ERR_HTTP_BAD_GATEWAY: 502,
    ERR_UNKNOWN: -9999,
    OK: 0,
    ERR_SM4: 5000,
    ERR_NOT_PROJECT_NO: 5014,
};

const AMAP = {
    KEY: process.env.AMAP_KEY,
    API_URL: 'https://webapi.amap.com/maps?v=1.3',
};

/**
    * 字母表
    */
const ALPHA_LIST = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '#',
];


export default {
    ...C_API,
    ...C_RESP,
    ...INTERFACE,
    AMAP,
    ALPHA_LIST
};
