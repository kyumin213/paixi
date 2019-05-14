/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath;

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'https://testcms.prise.shop/';
    // baseUrl = 'https://cms.prise.shop/';
    baseImgPath = 'https://upload.prise.shop/';
}
else if (process.env.NODE_ENV == 'testing') {
    baseUrl = 'https://testcms.prise.shop/';
    // baseUrl = 'https://cms.prise.shop/';
    baseImgPath = 'https://upload.prise.shop/';
}
else {
    // baseUrl = 'https://cms.prise.shop/';
    baseUrl = 'https://testcms.prise.shop/';
    baseImgPath = 'https://upload.prise.shop/';
}

export {
    baseUrl,
    routerMode,
    baseImgPath
}