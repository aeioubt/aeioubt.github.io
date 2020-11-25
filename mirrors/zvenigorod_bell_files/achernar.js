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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Achernar.js":
/*!*************************!*\
  !*** ./src/Achernar.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nclass Achernar {\n  constructor(config) {\n    _defineProperty(this, \"rotations\", 0);\n\n    this.config = config;\n    this.processRotationWeights();\n  }\n\n  processRotationWeights() {\n    if (!this.config.rotations) return;\n    this.rotationWeights = this.config.rotations.mappedWeights.filter(String);\n  }\n\n  init() {\n    this.defineSlot();\n    this.bindEventListeners();\n    this.render();\n  }\n\n  defineSlot() {\n    this.slot = googletag.defineSlot(this.config.adUnitPath, this.config.slotSizes, this.config.slotId).addService(googletag.pubads()).setCollapseEmptyDiv(true, true);\n  }\n\n  bindEventListeners() {\n    const supportedEvents = ['slotRequested', 'slotResponseReceived', 'slotRenderEnded', 'slotOnload', 'slotVisibilityChanged', 'impressionViewable'];\n    supportedEvents.forEach(eventName => {\n      googletag.pubads().addEventListener(eventName, event => {\n        if (event.slot !== this.slot) return;\n        const eventNameCapitalized = eventName.charAt(0).toUpperCase() + eventName.slice(1);\n        const methodName = `on${eventNameCapitalized}`;\n        this[methodName] && this[methodName](event);\n      });\n    });\n  }\n\n  render() {\n    googletag.pubads().enableSingleRequest();\n    this.setTargetings();\n    this.setRotationTargeting();\n    googletag.enableServices();\n    googletag.display(this.slot);\n  }\n\n  setTargetings() {\n    const targetings = this.config.targetings;\n    if (!targetings) return;\n    Object.keys(targetings).forEach(targetingKey => {\n      this.slot.setTargeting(targetingKey, targetings[targetingKey]);\n    });\n  }\n\n  setRotationTargeting() {\n    if (!this.config.rotations || !this.hasRotationWeights()) return;\n    const value = this.rotationWeights.shift();\n    this.slot.setTargeting(this.config.rotations.targetingKey, value);\n  }\n\n  hasRotationWeights() {\n    return this.rotationWeights && this.rotationWeights.length > 0;\n  } // noinspection JSUnusedGlobalSymbols\n\n\n  onSlotRenderEnded(event) {\n    if (event.isEmpty) {\n      this.backfill();\n    } else {\n      this.fireTrackingPixel(); // noinspection JSIgnoredPromiseFromCall\n\n      this.scheduleRefresh();\n    }\n  }\n\n  backfill() {\n    if (this.hasRotationWeights()) {\n      this.rotate();\n      return;\n    }\n\n    if (this.rotations === 0) {\n      this.passback();\n    }\n  } // noinspection JSMethodCanBeStatic\n\n\n  rotate() {\n    this.setRotationTargeting();\n    this.refresh();\n  }\n\n  refresh() {\n    googletag.pubads().refresh([this.slot]);\n  }\n\n  passback() {\n    this.config.passback && this.config.passback();\n  }\n\n  fireTrackingPixel() {\n    new Image().src = this.config.tracking;\n  }\n\n  async scheduleRefresh() {\n    await this.impressionViewable();\n    await this.refreshTimeout();\n    this.refresh();\n  }\n\n  impressionViewable() {\n    return new Promise(resolve => {\n      this.resolveImpressionViewable = resolve;\n    });\n  }\n\n  refreshTimeout() {\n    return new Promise(resolve => {\n      setTimeout(resolve, this.config.refreshTimeout);\n    });\n  } // noinspection JSUnusedGlobalSymbols\n\n\n  onSlotOnload() {\n    this.rotations++;\n  } // noinspection JSUnusedGlobalSymbols\n\n\n  onImpressionViewable() {\n    this.resolveImpressionViewable();\n  }\n\n  destroy() {\n    return googletag.destroySlots([this.slot]);\n  }\n\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Achernar);\n\n//# sourceURL=webpack:///./src/Achernar.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Achernar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Achernar */ \"./src/Achernar.js\");\n\nwindow.Achernar = _Achernar__WEBPACK_IMPORTED_MODULE_0__[\"default\"];\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });