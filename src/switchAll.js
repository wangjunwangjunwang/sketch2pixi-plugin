// import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/
const fs = require('@skpm/fs')
const util = require('./util')
const UI = require('sketch/ui')
// pixi识别的所有类型的元素
const types = [
  MSTextLayer, MSRectangleShape, MSBitmapLayer, MSLayerGroup, MSHotspotLayer
]

// var Document = Dom.Document
var json = {
  screen: {
    width: 1920,
    height: 1080
  },
  background: '',
  backgroundColor: '0xFFFFFF',
  bgScale: 1.25,
  res: [],
  eases: {
    moveIn: "easeOutCubic",
    moveOut: "easeInCubic",
    zoomIn: "easeInCubic",
    zoomOut: "easeOutCubic"
  },
  fonts: [
    {
      "name": "Didot-Bold",
      "src": "http://yun.media.bztone.com/prezi/asensio/font/Didot-Bold.ttf"
    },
    {
      "name": "OpenSans",
      "src": "http://yun.media.bztone.com/prezi/asensio/font/OpenSans.ttf"
    },
    {
      "name": "SourceHanSansCN",
      "src": "http://yun.media.bztone.com/prezi/asensio/font/asensio.ttf"
    }
  ],
  main: {
    x: 1920,
    y: 1080,
    scale: 1,
    son: [],
    content: []
  }
}
var artboards = []
// var document = Document.getSelectedDocument()
var globalContent = null
var allLayers = []
var allArtboards = []

export default function (content) {
  globalContent = content
  const doc = globalContent.document;
  const pages = doc.pages()

  // log dir
  let logDir = getHomeFolder(globalContent) + 'logs/'
  fs.existsSync(logDir) || fs.mkdirSync(logDir)

  if (pages.length === 0) {
    UI.message('请选择一个page!')
    return
  }

  const page = pages[0]
  const pageName = page.name()

  let artboards = page.layers()
  artboards.forEach(artboard => {
    allArtboards.push(artboard)
    let layers = artboard.layers()
    layers.forEach(layer => allLayers.push(layer))
  })

  util.log(logDir,`allLayers length : ${allLayers.length}`)
  util.log(logDir,`allArtboards length :  ${allArtboards.length}`)

  artboards = page.layers()
  createLevel(artboards[0], json.main)
  // 把输出结果写入json文件
  let jsonsDir = getHomeFolder(globalContent) + 'jsons/'
  fs.existsSync(jsonsDir) || fs.mkdirSync(jsonsDir)
  let pixiFile = jsonsDir + `${pageName}.json`
  
  util.log(logDir, `jsonFileName : ${pageName}`)

  fs.writeFileSync(pixiFile, JSON.stringify(json))
  UI.message('转换完成!')
}

function getHomeFolder(content) {
  const parts = content.scriptPath.split('/')
  parts.pop()
  parts.shift()
  let home = []
  home.push(parts[0])
  home.push(parts[1])
  let homeDir = '/' + home.join('/') + '/sketch2pixi-plugin/'
  fs.existsSync(homeDir) || fs.mkdirSync(homeDir) 
  return homeDir
}

// 判断artboard是否有下一级
function createLevel(artboard, current) {
  UI.message('正在转换 : ' + artboard.name())
  let scale = current.scale
  let layers = artboard.layers()
  layers.forEach(layer => {
    let type = layer.class()
    let name = layer.name()
    let format = getImageFormat(layer)
    if (name == 'BG') {
      json.background = 'http://pixi.bztone.com/' + name + '.' + (format ? format : 'JPG')
    } else if (types.indexOf(type) != -1 && layer.isVisible() == 1) {
      if (layer.flow() && layer.flow().destinationArtboardID()) {
        if (type === MSHotspotLayer) {
          // 当前元素是热点区,指向下一级页面(artboard),
          // 找是否存在指向同一个artboard的元素,如果存在,那是子级页面的入口
          let targetId = layer.flow().destinationArtboardID()
          let artboardLayer = getArtboard(targetId)
          if (artboardLayer) {
            let sonLayer = getSonByHotspot(layers, targetId)
            let son = {
              x: layer.frame().left(),
              y: layer.frame().top(),
              scale: artboardLayer.frame().width() / layer.frame().width(),
              son: [],
              content: []
            }
            if (sonLayer) {
              let sonContent = {
                x: (sonLayer.frame().left() - son.x) * son.scale,
                y: (sonLayer.frame().top() - son.y) * son.scale,
                width: sonLayer.frame().width() * son.scale,
                height: sonLayer.frame().height() * son.scale,
                data: {
                  type: getTypeByLayerType(sonLayer.class()),
                  look: 'son'
                }
              }
              sonContent = createElement(sonLayer, sonContent, 1 / scale)
              son.content.push(sonContent)
            }

            createLevel(artboardLayer, son)
            current.son.push(son)
          }
        }
      } else {
        let frame = layer.frame()
        let content = {
          x: frame.left(),
          y: frame.top(),
          width: frame.width(),
          height: frame.height(),
          data: {
            // alpha: style.opacity(),
            look: 'in',
            overSon: isOverSon(layer.name())
          }
        }
        if (layer.rotation()) {
          content.data.angle = layer.rotation()
        }

        content = createElement(layer, content, 1)
        current.content.push(content)
      }
    }
  })
}

// 查询artboard
function getArtboard(targetId) {
  let data = null
  for (let i = 0; i < allArtboards.length; i++) {
    let artboard = allArtboards[i]
    if ('' + artboard.objectID() == '' + targetId) {
      data = artboard
      break
    }
  }
  return data
}

// 在当前artboard里面找到与热点指向的下一级页面一样的元素
function getSonByHotspot(layers, targetId) {
  let sonLayer = null
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i]
    let type = layer.class()
    if (type != MSHotspotLayer &&
      layer.flow() && layer.flow().destinationArtboardID()
      && ('' + layer.flow().destinationArtboardID()) == ('' + targetId)) {
      sonLayer = layer
      break
    }
  }
  return sonLayer
}

// layer的type => pixi的type
function getTypeByLayerType(layerType) {
  let type = 'rect'
  switch (layerType) {
    case MSTextLayer:
      type = 'text'
      break
    case MSBitmapLayer:
      type = 'image'
      break
    default:
      break
  }
  return type
}

// layer => content
function createElement(layer, content, scale) {
  let style = layer.style()
  let fill = null
  if (style.fills().length > 0) {
    fill = style.fills()[0]
  }
  let border = null
  if (style.borders().length > 0) {
    border = style.borders()[0]
  }

  let type = layer.class()
  if (type === MSTextLayer) {
    // 字体
    let textColor = layer.textColor()
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      text: layer.stringValue() + '',
      fontFamily: layer.font().fontName() + '',
      fontSize: layer.fontSize() / scale,
      fill: util.rgb2hex(textColor.red(), textColor.green(), textColor.blue(), textColor.alpha()),
      lineHeight: layer.lineHeight(),
      leading: layer.leading(),
      align: layer.textAlignment() === 1 ? 'right' : (layer.textAlignment() === 2 ? 'center' : 'left'),
      wordWrap: true,
      breakWords: false,
      wordWrapWith: null
    })
  }
  if (type === MSRectangleShape) {
    // 方框
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      radius: layer.cornerRadiusFloat() / scale
    })
    // 填充色
    content.data = Object.assign(content.data, {
      fill: fill ? util.rgb2hex(fill.color().red(), fill.color().green(), fill.color().blue()) : '0xFFFFFF',
      opacity: fill ? fill.color().alpha() : 1
    })
    // 边框
    if (border) {
      content.data = Object.assign(content.data, {
        lineWidth: border.thickness() / scale,
        lineColor: util.rgb2hex(border.color().red(), border.color().green(), border.color().blue()),
        lineOpacity: border.color().alpha(),
        lineAlign: border.position() === 'Inside' ? 1 : (border.position() === 'Center' ? 0.5 : 0)
      })
    }
  }
  if (type === MSBitmapLayer) {
    // 照片
    // 同一张图片可以根据ID判断tempLayer.image.id
    // let base64 = tempLayer.image.nsdata.base64EncodedStringWithOptions(0)
    let name = layer.name()

    let format = getImageFormat(layer)
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      src: 'http://pixi.bztone.com/' + getName(name) + '.' + (format ? format : 'JPG')
    })
    // tempLayer.image.nsdata.writeToFile_atomically(getScriptFolder(globalContent) + '/' + tempLayer.name + '.JPG', true)

  }

  if (type === MSLayerGroup) {
    let format = getImageFormat(layer)
    if (format) {
      // 此group存在presets
      content.data = Object.assign(content.data, {
        type: getTypeByLayerType(MSBitmapLayer),
        src: 'http://pixi.bztone.com/' + layer.name() + '.' + (format ? format : 'JPG')
      })
    }
  }

  return content
}

// get image format : png/jpg...
function getImageFormat(layer) {
  let format = null
  let exportFormats = layer.exportOptions().exportFormats()
  if (exportFormats && exportFormats.length > 0) {
    format = exportFormats[0].fileFormat()
  }
  return format
}

// 元素名称是否含有overSon字符
function isOverSon(name) {
  return name.indexOf('_overSon') != -1
}

// 去除名称上的标记
function getName(name) {
  return name.replace('_overSon', '')
}