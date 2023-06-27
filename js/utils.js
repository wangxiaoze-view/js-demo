class Utils {
    constructor() {
    }

    getEle(name, all = false, target = document) {
        if (!name) throw new Error('元素 el-name 不能为空~');
        if (!target) throw new Error('元素 target 不能为空~');
        return target[!all ? 'querySelector' : 'querySelectorAll'](name)
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

    downFile(url, name) {
        const _this = this
        const a = document.createElement('a')
        a.href = url;
        a.target = '_blank'
        a.download = name
        a.style.display = 'none';
        document.querySelector('body')
        _this.getEle('body').append(a)
        a.click()
        a.remove()
    }
}

const utils = new Utils();