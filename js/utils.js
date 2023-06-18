class Utils {
    constructor() {
    }

    getEle(name, all = false) {
        if (!name) {
            throw new Error('元素 el-name 不能为空~');
        }
        return !all ? document.querySelector(name) : document.querySelectorAll(name);
    }

    trim(str) {
        return str.replace(/\s|\r|\n|\t/g, '');
    }

    logger(msg, type = 'info') {
        return console[type]('🚀🚀🚀🚀🚀🚀🚀 ', msg);
    }

    base64(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader()
            fileReader.onload = function (e) {
                resolve(e.target.result)
            }

            fileReader.readAsDataURL(file)
        })

    }
}

const utils = new Utils();