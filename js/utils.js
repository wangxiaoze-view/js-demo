class Utils {
    constructor() {
    }

    getEle(name) {
        if (!name) {
            throw new Error('元素 el-name 不能为空~');
        }
        return document.querySelector(name);
    }

    tirm(str) {
        return str.replace(/\s|\r|\n|\t/g, '');
    }

    logger(msg, type = 'info') {
        return console[type]('🚀🚀🚀🚀🚀🚀🚀 ', msg);
    }
}

const utils = new Utils();