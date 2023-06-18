class Var extends Utils {

    // tabs 数据
    tabsData = [];
    // 基础，底图，后面是当前图片, 用于判断是否设置了底图
    baseImgUrl = '';
    // 图片层级
    defaultIndex = 0;
    // 图层数据
    layerData = []

    constructor() {
        super();
    }

    // 设置底图按钮
    get getSetBtn() {
        return this.getEle('#set_bg')
    }

    // 上传目录按钮
    get getUpFileBtn() {
        return this.getEle('#up_file')
    }

    // 下载目录文件
    get getDownDirBtn() {
        return this.getEle('#down_dir')
    }

    // 下载最终图片
    get getDownImageBtn() {
        return this.getEle('#down_image')
    }

    // 预览图片
    get getPreImage() {
        return this.getEle('#pre_image')
    }

    // 结果图片
    get getResultImage() {
        return this.getEle('#result_image')
    }


    // 左侧tabs
    get getContainerLeft() {
        return this.getEle('.view-container--left')
    }

    // y右侧控制图层
    get getContainerRight() {
        return this.getEle('.view-container--right')
    }

    get getLayerMove() {
        return this.getEle('.layer-item--right', true)
    }

    // 左侧tabs
    get getTabsItems() {
        return this.getEle('.tabs-item', true)
    }

    // 目录名
    get getDirName() {
        return this.getEle('#dir_name')
    }

    // 文件数
    get getFileNum() {
        return this.getEle('#file_num')
    }


    // 设置左侧tabs数据
    setTabsData(tabsData = []) {
        this.tabsData = tabsData

        if (tabsData.length > 0) {
            const webkitRelativePath = tabsData[0].webkitRelativePath
            const charIndex = webkitRelativePath.lastIndexOf('/')
            this.getDirName.innerHTML = webkitRelativePath.substring(0, charIndex)
            this.getFileNum.innerHTML = tabsData.length
        }
    }

    layerMove() {
        for (let i = 0; i < this.getLayerMove.length; i++) {
            this.getLayerMove[i].addEventListener('dragstart', function (e) {
                console.log('dragstart')
            })
            this.getLayerMove[i].addEventListener('drag', function (e) {
                console.log('drag')
            })
            this.getLayerMove[i].addEventListener('dragend', function (e) {
                console.log('dragend')
            })
        }
    }

    // 设置图层数据
    setLayerData(data) {
        if (!data) return
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="layer-item" draggable="true">
                <div class="layer-item--left">
                    <div class="layer-title" title="${data.name}">${data.name}</div>
                    <span class="layer-tip">蒙层${data.zIndex}</span>
                </div>
                ${data.zIndex !== 0 ? '<div class="layer-item--right" ></div>' : ''}
                
            </div>`
        this.getContainerRight.append(div)
        this.layerData.push(data)
        this.layerMove()
    }


    // 添加底图或者蒙层
    setBaseImgUrl(url = '', name = '', zIndex = 0) {
        if (!url || !name) return;

        const hasLayer = this.layerData.find(item => item.base64 === url)
        if (hasLayer) {
            return alert('蒙层已存在')
        }

        this.baseImgUrl = url
        const image = document.createElement('img')
        image.src = url
        image.style.zIndex = zIndex.toString()
        this.getResultImage.append(image)

        this.setLayerData({
            base64: url,
            name,
            zIndex: this.defaultIndex
        })

    }

}

// 预览图片
class Mark extends Var {
    constructor() {
        super()
    }


    renderMark(url = '', display = '') {
        this.getPreImage.innerHTML = ''
        if (!url || !display) return;
        const image = document.createElement('img')
        image.src = url
        this.getPreImage.append(image)
    }
}


// tabs
class Tabs extends Mark {
    tabActiveKey = 'tabs-item--active'

    constructor() {
        super()
    }

    // render
    render() {
        for (let i = 0; i < this.tabsData.length; i++) {
            const item = this.tabsData[i]
            const div = document.createElement('div')
            div.innerHTML = `<div class="tabs-item" data-base="${item.base64}" data-name="${item.name}">${item.name}</div>`
            this.getContainerLeft.append(div)
        }
    }

    clearActive(removeClass = '') {
        if (!removeClass) return
        for (let i = 0; i < this.getTabsItems.length; i++) {
            this.getTabsItems[i].classList.remove(removeClass)
        }
    }

    hoverTabItem() {
        const _this = this
        for (let i = 0; i < this.getTabsItems.length; i++) {
            this.getTabsItems[i].addEventListener('mouseover', function () {
                const url = this.getAttribute('data-base')
                _this.renderMark(url, 'block')
            })

            this.getTabsItems[i].addEventListener('click', function () {
                const url = this.getAttribute('data-base')
                const name = this.getAttribute('data-name')
                _this.clearActive(_this.tabActiveKey)
                this.classList.add(_this.tabActiveKey)
                if (!_this.baseImgUrl) return
                _this.defaultIndex++;
                _this.setBaseImgUrl(url, name, this.defaultIndex)

            })
        }
    }

}

class Handler extends Tabs {
    constructor() {
        super()
        this.upFileDirs()
        this.setBg()
    }

    upFileDirs() {
        const _this = this
        _this.getUpFileBtn.addEventListener('change', async function (e) {
            const files = e.target.files
            const tempFiles = []

            for (let file of files) {
                tempFiles.push({
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    webkitRelativePath: file.webkitRelativePath,
                    base64: await _this.base64(file)
                })
            }
            _this.setTabsData(tempFiles)
            _this.render()
            _this.hoverTabItem()
        })
    }

    setBg() {
        const _this = this

        this.getSetBtn.addEventListener('click', function () {
            if (_this.getTabsItems.length === 0) {
                return alert('请先上传目录')
            }

            if (_this.baseImgUrl) {
                return alert('已经添加过底图了')
            }

            for (let i = 0; i < _this.getTabsItems.length; i++) {
                const url = _this.getTabsItems[i].getAttribute('data-base')
                const name = _this.getTabsItems[i].getAttribute('data-name')
                const hasActive = _this.getTabsItems[i].className.indexOf(_this.tabActiveKey) === -1
                if (hasActive) continue
                _this.setBaseImgUrl(url, name, _this.defaultIndex)

            }
        })
    }


}

const {} = new Handler()



