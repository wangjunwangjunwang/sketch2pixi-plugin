var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/switchAll.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/fs/index.js":
/*!****************************************!*\
  !*** ./node_modules/@skpm/fs/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO: async. Should probably be done with NSFileHandle and some notifications
// TODO: file descriptor. Needs to be done with NSFileHandle
var Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer

function encodingFromOptions(options, defaultValue) {
  return options && options.encoding
    ? String(options.encoding)
    : (
      options
        ? String(options)
        : defaultValue
    )
}

module.exports.constants = {
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1
}

module.exports.accessSync = function(path, mode) {
  mode = mode | 0
  var fileManager = NSFileManager.defaultManager()

  switch (mode) {
    case 0:
      canAccess = module.exports.existsSync(path)
      break
    case 1:
      canAccess = Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
    case 2:
      canAccess = Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 3:
      canAccess = Boolean(Number(fileManager.isExecutableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 4:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path)))
      break
    case 5:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
    case 6:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 7:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path))) && Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
  }

  if (!canAccess) {
    throw new Error('Can\'t access ' + String(path))
  }
}

module.exports.appendFileSync = function(file, data, options) {
  if (!module.exports.existsSync(file)) {
    return module.exports.writeFileSync(file, data, options)
  }

  var handle = NSFileHandle.fileHandleForWritingAtPath(file)
  handle.seekToEndOfFile()

  var encoding = encodingFromOptions(options, 'utf8')

  var nsdata = Buffer.from(data, encoding === 'NSData' || encoding === 'buffer' ? undefined : encoding).toNSData()

  handle.writeData(nsdata)
}

module.exports.chmodSync = function(path, mode) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.setAttributes_ofItemAtPath_error({
    NSFilePosixPermissions: mode
  }, path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.copyFileSync = function(path, dest, flags) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.copyItemAtPath_toPath_error(path, dest, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.existsSync = function(path) {
  var fileManager = NSFileManager.defaultManager()
  return Boolean(Number(fileManager.fileExistsAtPath(path)))
}

module.exports.linkSync = function(existingPath, newPath) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.linkItemAtPath_toPath_error(existingPath, newPath, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.mkdirSync = function(path, mode) {
  mode = mode || 0o777
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, false, {
    NSFilePosixPermissions: mode
  }, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.mkdtempSync = function(path) {
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  var tempPath = path + makeid()
  module.exports.mkdirSync(tempPath)
  return tempPath
}

module.exports.readdirSync = function(path) {
  var fileManager = NSFileManager.defaultManager()
  var paths = fileManager.subpathsAtPath(path)
  var arr = []
  for (var i = 0; i < paths.length; i++) {
    arr.push(String(paths[i]))
  }
  return arr
}

module.exports.readFileSync = function(path, options) {
  var encoding = encodingFromOptions(options, 'buffer')
  var fileManager = NSFileManager.defaultManager()
  var data = fileManager.contentsAtPath(path)
  var buffer = Buffer.from(data)

  if (encoding === 'buffer') {
    return buffer
  } else if (encoding === 'NSData') {
    return buffer.toNSData()
  } else {
    return buffer.toString(encoding)
  }
}

module.exports.readlinkSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.destinationOfSymbolicLinkAtPath_error(path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }

  return String(result)
}

module.exports.realpathSync = function(path) {
  return String(NSString.stringByResolvingSymlinksInPath(path))
}

module.exports.renameSync = function(oldPath, newPath) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.moveItemAtPath_toPath_error(oldPath, newPath, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.rmdirSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.removeItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.statSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.attributesOfItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }

  return {
    dev: String(result.NSFileDeviceIdentifier),
    // ino: 48064969, The file system specific "Inode" number for the file.
    mode: result.NSFileType | result.NSFilePosixPermissions,
    nlink: Number(result.NSFileReferenceCount),
    uid: String(result.NSFileOwnerAccountID),
    gid: String(result.NSFileGroupOwnerAccountID),
    // rdev: 0, A numeric device identifier if the file is considered "special".
    size: Number(result.NSFileSize),
    // blksize: 4096, The file system block size for i/o operations.
    // blocks: 8, The number of blocks allocated for this file.
    atimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    mtimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    ctimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    birthtimeMs: Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000,
    atime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5), // the 0.5 comes from the node source. Not sure why it's added but in doubt...
    mtime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5),
    ctime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5),
    birthtime: new Date(Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000 + 0.5),
    isBlockDevice: function() { return result.NSFileType === NSFileTypeBlockSpecial },
    isCharacterDevice: function() { return result.NSFileType === NSFileTypeCharacterSpecial },
    isDirectory: function() { return result.NSFileType === NSFileTypeDirectory },
    isFIFO: function() { return false },
    isFile: function() { return result.NSFileType === NSFileTypeRegular },
    isSocket: function() { return result.NSFileType === NSFileTypeSocket },
    isSymbolicLink: function() { return result.NSFileType === NSFileTypeSymbolicLink },
  }
}

module.exports.symlinkSync = function(target, path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.createSymbolicLinkAtPath_withDestinationPath_error(path, target, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.truncateSync = function(path, len) {
  var hFile = NSFileHandle.fileHandleForUpdatingAtPath(sFilePath)
  hFile.truncateFileAtOffset(len || 0)
  hFile.closeFile()
}

module.exports.unlinkSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.removeItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.utimesSync = function(path, aTime, mTime) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.setAttributes_ofItemAtPath_error({
    NSFileModificationDate: aTime
  }, path, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.writeFileSync = function(path, data, options) {
  var encoding = encodingFromOptions(options, 'utf8')

  var nsdata = Buffer.from(
    data, encoding === 'NSData' || encoding === 'buffer' ? undefined : encoding
  ).toNSData()

  nsdata.writeToFile_atomically(path, true)
}


/***/ }),

/***/ "./src/switchAll.js":
/*!**************************!*\
  !*** ./src/switchAll.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/
var fs = __webpack_require__(/*! @skpm/fs */ "./node_modules/@skpm/fs/index.js");

var util = __webpack_require__(/*! ./util */ "./src/util.js");

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui"); // pixi识别的所有类型的元素


var types = [MSTextLayer, MSRectangleShape, MSBitmapLayer, MSLayerGroup, MSHotspotLayer]; // var Document = Dom.Document

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
  fonts: [{
    "name": "Didot-Bold",
    "src": "http://yun.media.bztone.com/prezi/asensio/font/Didot-Bold.ttf"
  }, {
    "name": "OpenSans",
    "src": "http://yun.media.bztone.com/prezi/asensio/font/OpenSans.ttf"
  }, {
    "name": "SourceHanSansCN",
    "src": "http://yun.media.bztone.com/prezi/asensio/font/asensio.ttf"
  }],
  main: {
    x: 1920,
    y: 1080,
    scale: 1,
    son: [],
    content: []
  }
};
var artboards = []; // var document = Document.getSelectedDocument()

var globalContent = null;
var allLayers = [];
var allArtboards = [];
/* harmony default export */ __webpack_exports__["default"] = (function (content) {
  globalContent = content;
  var doc = globalContent.document;
  var pages = doc.pages(); // log dir

  var logDir = getHomeFolder(globalContent) + 'logs/';
  fs.existsSync(logDir) || fs.mkdirSync(logDir);

  if (pages.length === 0) {
    UI.message('请选择一个page!');
    return;
  }

  var page = pages[0];
  var pageName = page.name();
  var artboards = page.layers();
  artboards.forEach(function (artboard) {
    allArtboards.push(artboard);
    var layers = artboard.layers();
    layers.forEach(function (layer) {
      return allLayers.push(layer);
    });
  });
  util.log(logDir, "allLayers length : ".concat(allLayers.length));
  util.log(logDir, "allArtboards length :  ".concat(allArtboards.length));
  artboards = page.layers();
  createLevel(artboards[0], json.main); // 把输出结果写入json文件

  var jsonsDir = getHomeFolder(globalContent) + 'jsons/';
  fs.existsSync(jsonsDir) || fs.mkdirSync(jsonsDir);
  var pixiFile = jsonsDir + "".concat(pageName, ".json");
  util.log(logDir, "jsonFileName : ".concat(pageName));
  fs.writeFileSync(pixiFile, JSON.stringify(json));
  UI.message('转换完成!');
});

function getHomeFolder(content) {
  var parts = content.scriptPath.split('/');
  parts.pop();
  parts.shift();
  var home = [];
  home.push(parts[0]);
  home.push(parts[1]);
  var homeDir = '/' + home.join('/') + '/sketch2pixi-plugin/';
  fs.existsSync(homeDir) || fs.mkdirSync(homeDir);
  return homeDir;
} // 判断artboard是否有下一级


function createLevel(artboard, current) {
  UI.message('正在转换 : ' + artboard.name());
  var scale = current.scale;
  var layers = artboard.layers();
  layers.forEach(function (layer) {
    var type = layer.class();
    var name = layer.name();
    var format = getImageFormat(layer);

    if (name == 'BG') {
      json.background = 'http://pixi.bztone.com/' + name + '.' + (format ? format : 'JPG');
    } else if (types.indexOf(type) != -1 && layer.isVisible() == 1) {
      if (layer.flow() && layer.flow().destinationArtboardID()) {
        if (type === MSHotspotLayer) {
          // 当前元素是热点区,指向下一级页面(artboard),
          // 找是否存在指向同一个artboard的元素,如果存在,那是子级页面的入口
          var targetId = layer.flow().destinationArtboardID();
          var artboardLayer = getArtboard(targetId);

          if (artboardLayer) {
            var sonLayer = getSonByHotspot(layers, targetId);
            var son = {
              x: layer.frame().left(),
              y: layer.frame().top(),
              scale: artboardLayer.frame().width() / layer.frame().width(),
              son: [],
              content: []
            };

            if (sonLayer) {
              var sonContent = {
                x: (sonLayer.frame().left() - son.x) * son.scale,
                y: (sonLayer.frame().top() - son.y) * son.scale,
                width: sonLayer.frame().width() * son.scale,
                height: sonLayer.frame().height() * son.scale,
                data: {
                  type: getTypeByLayerType(sonLayer.class()),
                  look: 'son'
                }
              };
              sonContent = createElement(sonLayer, sonContent, 1 / scale);
              son.content.push(sonContent);
            }

            createLevel(artboardLayer, son);
            current.son.push(son);
          }
        }
      } else {
        var frame = layer.frame();
        var content = {
          x: frame.left(),
          y: frame.top(),
          width: frame.width(),
          height: frame.height(),
          data: {
            // alpha: style.opacity(),
            look: 'in',
            overSon: isOverSon(layer.name())
          }
        };

        if (layer.rotation()) {
          content.data.angle = layer.rotation();
        }

        content = createElement(layer, content, 1);
        current.content.push(content);
      }
    }
  });
} // 查询artboard


function getArtboard(targetId) {
  var data = null;

  for (var i = 0; i < allArtboards.length; i++) {
    var artboard = allArtboards[i];

    if ('' + artboard.objectID() == '' + targetId) {
      data = artboard;
      break;
    }
  }

  return data;
} // 在当前artboard里面找到与热点指向的下一级页面一样的元素


function getSonByHotspot(layers, targetId) {
  var sonLayer = null;

  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var type = layer.class();

    if (type != MSHotspotLayer && layer.flow() && layer.flow().destinationArtboardID() && '' + layer.flow().destinationArtboardID() == '' + targetId) {
      sonLayer = layer;
      break;
    }
  }

  return sonLayer;
} // layer的type => pixi的type


function getTypeByLayerType(layerType) {
  var type = 'rect';

  switch (layerType) {
    case MSTextLayer:
      type = 'text';
      break;

    case MSBitmapLayer:
      type = 'image';
      break;

    default:
      break;
  }

  return type;
} // layer => content


function createElement(layer, content, scale) {
  var style = layer.style();
  var fill = null;

  if (style.fills().length > 0) {
    fill = style.fills()[0];
  }

  var border = null;

  if (style.borders().length > 0) {
    border = style.borders()[0];
  }

  var type = layer.class();

  if (type === MSTextLayer) {
    // 字体
    var textColor = layer.textColor();
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      text: layer.stringValue() + '',
      fontFamily: layer.font().fontName() + '',
      fontSize: layer.fontSize() / scale,
      fill: util.rgb2hex(textColor.red(), textColor.green(), textColor.blue(), textColor.alpha()),
      lineHeight: layer.lineHeight(),
      leading: layer.leading(),
      align: layer.textAlignment() === 1 ? 'right' : layer.textAlignment() === 2 ? 'center' : 'left',
      wordWrap: true,
      breakWords: false,
      wordWrapWith: null
    });
  }

  if (type === MSRectangleShape) {
    // 方框
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      radius: layer.cornerRadiusFloat() / scale
    }); // 填充色

    content.data = Object.assign(content.data, {
      fill: fill ? util.rgb2hex(fill.color().red(), fill.color().green(), fill.color().blue()) : '0xFFFFFF',
      opacity: fill ? fill.color().alpha() : 1
    }); // 边框

    if (border) {
      content.data = Object.assign(content.data, {
        lineWidth: border.thickness() / scale,
        lineColor: util.rgb2hex(border.color().red(), border.color().green(), border.color().blue()),
        lineOpacity: border.color().alpha(),
        lineAlign: border.position() === 'Inside' ? 1 : border.position() === 'Center' ? 0.5 : 0
      });
    }
  }

  if (type === MSBitmapLayer) {
    // 照片
    // 同一张图片可以根据ID判断tempLayer.image.id
    // let base64 = tempLayer.image.nsdata.base64EncodedStringWithOptions(0)
    var name = layer.name();
    var format = getImageFormat(layer);
    content.data = Object.assign(content.data, {
      type: getTypeByLayerType(type),
      src: 'http://pixi.bztone.com/' + getName(name) + '.' + (format ? format : 'JPG')
    }); // tempLayer.image.nsdata.writeToFile_atomically(getScriptFolder(globalContent) + '/' + tempLayer.name + '.JPG', true)
  }

  if (type === MSLayerGroup) {
    var _format = getImageFormat(layer);

    if (_format) {
      // 此group存在presets
      content.data = Object.assign(content.data, {
        type: getTypeByLayerType(MSBitmapLayer),
        src: 'http://pixi.bztone.com/' + layer.name() + '.' + (_format ? _format : 'JPG')
      });
    }
  }

  return content;
} // get image format : png/jpg...


function getImageFormat(layer) {
  var format = null;
  var exportFormats = layer.exportOptions().exportFormats();

  if (exportFormats && exportFormats.length > 0) {
    format = exportFormats[0].fileFormat();
  }

  return format;
} // 元素名称是否含有overSon字符


function isOverSon(name) {
  return name.indexOf('_overSon') != -1;
} // 去除名称上的标记


function getName(name) {
  return name.replace('_overSon', '');
}

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! @skpm/fs */ "./node_modules/@skpm/fs/index.js"); // 获取hex里面的alpha


exports.getAlphaFromHex = function (hex) {
  hex = hex.replace(/^#/, '');
  var alpha = 1;

  if (hex.length === 8) {
    alpha = parseInt(hex.slice(6, 8), 16) / 255;
  }

  return alpha;
}; // 去除alpha


exports.getColor = function (hex) {
  var color = '';
  hex = hex.replace(/^#/, '');

  if (hex.length === 8) {
    color = hex.slice(0, 6);
  }

  return '0x' + color;
}; // rgb to hex


exports.rgb2hex = function (red, green, blue, alpha) {
  red = parseInt(red * 255);
  green = parseInt(green * 255);
  blue = parseInt(blue * 255);
  var isPercent = (red + (alpha || '')).toString().includes('%');

  if (typeof alpha === 'number') {
    if (!isPercent && alpha >= 0 && alpha <= 1) {
      alpha = Math.round(255 * alpha);
    } else if (isPercent && alpha >= 0 && alpha <= 100) {
      alpha = Math.round(255 * alpha / 100);
    } else {
      throw new TypeError("Expected alpha value (".concat(alpha, ") as a fraction or percentage"));
    }

    alpha = (alpha | 1 << 8).toString(16).slice(1);
  } else {
    alpha = '';
  }

  var rgb = (blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1) + alpha;
  return '0x' + rgb;
}; // append log to path


exports.log = function (logDir, string) {
  var dateFormatter = NSDateFormatter.alloc().init();
  dateFormatter.setDateFormat('YYYY-MM-dd');
  console.log(dateFormatter);
  var now = NSDate.alloc().init();
  var logFile = logDir + dateFormatter.stringFromDate(now) + '.log';
  dateFormatter.setDateFormat('YYYY-MM-dd hh:mm:ss');
  var timestamp = dateFormatter.stringFromDate(now) + ' --- ';
  if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, timestamp + string + '\n');else fs.appendFileSync(logFile, timestamp + string + '\n');
};

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=switchAll.js.map