(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["form"] = factory();
	else
		root["CoCreate"] = root["CoCreate"] || {}, root["CoCreate"]["form"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "../CoCreate-components/CoCreate-form/src/CoCreate-form.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../CoCreate-components/CoCreate-form/src/CoCreate-form.js":
/*!*****************************************************************!*\
  !*** ../CoCreate-components/CoCreate-form/src/CoCreate-form.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nvar CoCreateForm = {\n  selectors: [],\n  modules: [],\n  __init: function __init() {\n    var forms = document.querySelectorAll('form');\n    var self = this;\n\n    this.__setSubmitEvent();\n\n    forms.forEach(function (form) {\n      self.__initAttribute(form);\n    });\n  },\n  initElement: function initElement(container) {\n    var __container = container || document;\n\n    if (!__container.querySelectorAll) {\n      return;\n    }\n\n    var forms = __container.querySelectorAll('form');\n\n    var self = this;\n\n    if (forms.length === 0 && __container != document && __container.tagName === \"FORM\") {\n      forms = [__container];\n    }\n\n    forms.forEach(function (form) {\n      // if (CoCreate.observer.getInitialized(form)) {\n      // \treturn;\n      // }\n      // CoCreate.observer.setInitialized(form);\n      self.__initAttribute(form);\n\n      self.disableAutoFill(form);\n    });\n  },\n  disableAutoFill: function disableAutoFill(element) {\n    if (element.tagName == \"TEXTAREA\") {\n      element.value = \"\";\n      element.setAttribute(\"autocomplete\", \"off\");\n    }\n\n    if (!element.hasAttribute(\"autocomplete\")) {\n      element.setAttribute('autocomplete', \"off\");\n    }\n  },\n  __initAttribute: function __initAttribute(form) {\n    var collection = form.getAttribute('data-collection') || \"\";\n    var dataRealTime = form.getAttribute('data-realtime');\n    var document_id = form.getAttribute('data-document_id') || \"\";\n    var elements = form.querySelectorAll('[name], [data-pass_to]');\n    elements.forEach(function (el) {\n      if (el.parentNode.classList.contains('template')) {\n        return;\n      }\n\n      if (el.getAttribute('data-realtime') == null && dataRealTime) {\n        // if (!['INPUT', 'TEXTAREA'].indexOf(el.tagName)) {\n        el.setAttribute('data-realtime', dataRealTime); // }\n      }\n\n      if (el.getAttribute('name') && !el.hasAttribute('data-collection') && collection) {\n        el.setAttribute('data-collection', collection);\n      }\n\n      if (el.getAttribute('data-pass_to') && !el.hasAttribute('data-pass_collection') && collection) {\n        el.setAttribute('data-pass_collection', collection);\n      }\n\n      if (el.getAttribute('name') && !el.getAttribute('data-document_id') && document_id) {\n        el.setAttribute('data-document_id', document_id);\n      }\n\n      if (!el.hasAttribute(\"data-document_id\") && document_id != null) {\n        el.setAttribute('data-document_id', document_id);\n      }\n    });\n  },\n  __setSubmitEvent: function __setSubmitEvent() {\n    var self = this;\n    document.addEventListener('clicked-submitBtn', function (event) {\n      var element = event.detail.element;\n      self.modules.forEach(function (_ref) {\n        var selector = _ref.selector,\n            callback = _ref.callback;\n\n        if (callback && element.matches(selector)) {\n          callback.call(null, element);\n        }\n      });\n    });\n  },\n  __checkFormValidate: function __checkFormValidate(form) {\n    if (typeof CoCreate.unique !== 'undefined') {\n      return CoCreate.unique.checkValidate(form);\n    }\n\n    return true;\n  },\n  __isTemplateInput: function __isTemplateInput(input) {\n    if (input.classList.contains('template')) return true;\n    var node = input.parentNode;\n\n    while (node) {\n      if (node.classList && node.classList.contains('template')) {\n        return true;\n      }\n\n      node = node.parentNode;\n    }\n\n    return false;\n  },\n  getFormData: function getFormData(form) {\n    var self = this;\n    var selectors = this.modules.map(function (m) {\n      return m.selector;\n    });\n    var elements = form.querySelectorAll(selectors.join(','));\n    var request_document_id = false;\n    var dataList = [];\n    elements.forEach(function (el) {\n      var collection = el.getAttribute('data-collection');\n      var document_id = el.getAttribute('data-document_id');\n      var name = el.getAttribute('name');\n\n      if (el.getAttribute('data-save_value') == 'false') {\n        return;\n      }\n\n      if (!document_id && name) {\n        request_document_id = true;\n        return;\n      }\n\n      var data = dataList.find(function (d) {\n        return d.collection == collection && d.document_id == document_id;\n      });\n    });\n  },\n  //. add information of modules\n  //. { selector, .... }\n  init: function init(_ref2) {\n    var name = _ref2.name,\n        selector = _ref2.selector,\n        callback = _ref2.callback;\n    this.modules.push({\n      name: name,\n      selector: selector,\n      callback: callback\n    });\n\n    if (selector) {\n      this.selectors.push(selector);\n    }\n  },\n  get: function get() {\n    return {\n      selectors: this.selectors\n    };\n  }\n};\n\nCoCreateForm.__init();\n\nCoCreate.core.registerInit(CoCreateForm.initElement, CoCreateForm);\nCoCreate.observer.add({\n  name: 'CoCreateForm',\n  observe: ['subtree', 'childList'],\n  include: 'form',\n  callback: function callback(mutation) {\n    CoCreateForm.initElement(mutation.target);\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoCreateForm);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZS5mb3JtLy4uL0NvQ3JlYXRlLWNvbXBvbmVudHMvQ29DcmVhdGUtZm9ybS9zcmMvQ29DcmVhdGUtZm9ybS5qcz9lOTAzIl0sIm5hbWVzIjpbIkNvQ3JlYXRlRm9ybSIsInNlbGVjdG9ycyIsIm1vZHVsZXMiLCJfX2luaXQiLCJmb3JtcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInNlbGYiLCJfX3NldFN1Ym1pdEV2ZW50IiwiZm9yRWFjaCIsImZvcm0iLCJfX2luaXRBdHRyaWJ1dGUiLCJpbml0RWxlbWVudCIsImNvbnRhaW5lciIsIl9fY29udGFpbmVyIiwibGVuZ3RoIiwidGFnTmFtZSIsImRpc2FibGVBdXRvRmlsbCIsImVsZW1lbnQiLCJ2YWx1ZSIsInNldEF0dHJpYnV0ZSIsImhhc0F0dHJpYnV0ZSIsImNvbGxlY3Rpb24iLCJnZXRBdHRyaWJ1dGUiLCJkYXRhUmVhbFRpbWUiLCJkb2N1bWVudF9pZCIsImVsZW1lbnRzIiwiZWwiLCJwYXJlbnROb2RlIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJkZXRhaWwiLCJzZWxlY3RvciIsImNhbGxiYWNrIiwibWF0Y2hlcyIsImNhbGwiLCJfX2NoZWNrRm9ybVZhbGlkYXRlIiwiQ29DcmVhdGUiLCJ1bmlxdWUiLCJjaGVja1ZhbGlkYXRlIiwiX19pc1RlbXBsYXRlSW5wdXQiLCJpbnB1dCIsIm5vZGUiLCJnZXRGb3JtRGF0YSIsIm1hcCIsIm0iLCJqb2luIiwicmVxdWVzdF9kb2N1bWVudF9pZCIsImRhdGFMaXN0IiwibmFtZSIsImRhdGEiLCJmaW5kIiwiZCIsImluaXQiLCJwdXNoIiwiZ2V0IiwiY29yZSIsInJlZ2lzdGVySW5pdCIsIm9ic2VydmVyIiwiYWRkIiwib2JzZXJ2ZSIsImluY2x1ZGUiLCJtdXRhdGlvbiIsInRhcmdldCJdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxJQUFNQSxZQUFZLEdBQUc7QUFF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O0FBQ0FvQyxRQUFRLENBQUNtQixJQUFULENBQWNDLFlBQWQsQ0FBMkIzRCxZQUFZLENBQUNZLFdBQXhDLEVBQXFEWixZQUFyRDtBQUVBdUMsUUFBUSxDQUFDcUIsUUFBVCxDQUFrQkMsR0FBbEIsQ0FBc0I7QUFDckJWLE1BQUksRUFBRSxjQURlO0FBRXJCVyxTQUFPLEVBQUUsQ0FBQyxTQUFELEVBQVksV0FBWixDQUZZO0FBR3JCQyxTQUFPLEVBQUUsTUFIWTtBQUlyQjVCLFVBQVEsRUFBRSxrQkFBUzZCLFFBQVQsRUFBbUI7QUFDNUJoRSxnQkFBWSxDQUFDWSxXQUFiLENBQXlCb0QsUUFBUSxDQUFDQyxNQUFsQztBQUNBO0FBTm9CLENBQXRCO0FBU2VqRSwyRUFBZiIsImZpbGUiOiIuLi9Db0NyZWF0ZS1jb21wb25lbnRzL0NvQ3JlYXRlLWZvcm0vc3JjL0NvQ3JlYXRlLWZvcm0uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmNvbnN0IENvQ3JlYXRlRm9ybSA9IHtcblx0XG5cdHNlbGVjdG9yczogW10sXG5cdFxuXHRtb2R1bGVzOiBbXSxcblxuXHRfX2luaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdGNvbnN0IGZvcm1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xuXHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdHRoaXMuX19zZXRTdWJtaXRFdmVudCgpO1xuXHRcdFxuXHRcdGZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcblx0XHRcdHNlbGYuX19pbml0QXR0cmlidXRlKGZvcm0pXG5cdFx0fSlcblx0fSxcblx0XG5cdGluaXRFbGVtZW50OiBmdW5jdGlvbihjb250YWluZXIpIHtcblx0XHRjb25zdCBfX2NvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBkb2N1bWVudFxuXHRcdFxuXHRcdGlmICghX19jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRsZXQgIGZvcm1zID0gX19jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpO1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRcblx0XHRpZiAoZm9ybXMubGVuZ3RoID09PSAwICYmIF9fY29udGFpbmVyICE9IGRvY3VtZW50ICYmIF9fY29udGFpbmVyLnRhZ05hbWUgPT09IFwiRk9STVwiKSB7XG5cdFx0XHRmb3JtcyA9IFtfX2NvbnRhaW5lcl07XG5cdFx0fVxuXHRcdFxuXHRcdGZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcblx0XHRcdC8vIGlmIChDb0NyZWF0ZS5vYnNlcnZlci5nZXRJbml0aWFsaXplZChmb3JtKSkge1xuXHRcdFx0Ly8gXHRyZXR1cm47XG5cdFx0XHQvLyB9XG5cdFx0XHQvLyBDb0NyZWF0ZS5vYnNlcnZlci5zZXRJbml0aWFsaXplZChmb3JtKTtcblxuXHRcdFx0c2VsZi5fX2luaXRBdHRyaWJ1dGUoZm9ybSk7XG5cdFx0XHRzZWxmLmRpc2FibGVBdXRvRmlsbChmb3JtKTtcblx0XHR9KVxuXHR9LFxuXHRcblx0ZGlzYWJsZUF1dG9GaWxsOiBmdW5jdGlvbihlbGVtZW50KSB7XG5cdFx0aWYgKGVsZW1lbnQudGFnTmFtZSA9PSBcIlRFWFRBUkVBXCIpIHtcblx0XHRcdGVsZW1lbnQudmFsdWUgPSBcIlwiO1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhdXRvY29tcGxldGVcIixcIm9mZlwiKVxuXHRcdH1cblx0XHRpZiAoIWVsZW1lbnQuaGFzQXR0cmlidXRlKFwiYXV0b2NvbXBsZXRlXCIpKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgXCJvZmZcIik7XG5cdFx0fVxuXHR9LFxuXG5cdF9faW5pdEF0dHJpYnV0ZTogZnVuY3Rpb24oZm9ybSkge1xuXHRcdFxuXHRcdGNvbnN0IGNvbGxlY3Rpb24gPSBmb3JtLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2xsZWN0aW9uJykgfHwgXCJcIjsgXG5cdFx0Y29uc3QgZGF0YVJlYWxUaW1lID0gZm9ybS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVhbHRpbWUnKTtcblx0XHRjb25zdCBkb2N1bWVudF9pZCA9IGZvcm0uZ2V0QXR0cmlidXRlKCdkYXRhLWRvY3VtZW50X2lkJykgfHwgXCJcIjtcblx0XHRsZXQgZWxlbWVudHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tuYW1lXSwgW2RhdGEtcGFzc190b10nKVxuXHRcdFxuXHRcdFx0XHRcdFxuXHRcdGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcblx0XHRcdGlmIChlbC5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucygndGVtcGxhdGUnKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAoZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXJlYWx0aW1lJykgPT0gbnVsbCAmJiBkYXRhUmVhbFRpbWUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGlmICghWydJTlBVVCcsICdURVhUQVJFQSddLmluZGV4T2YoZWwudGFnTmFtZSkpIHtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdkYXRhLXJlYWx0aW1lJywgZGF0YVJlYWxUaW1lKTtcblx0XHRcdFx0Ly8gfVxuXHRcdFx0fVxuXHRcdFx0aWYgKGVsLmdldEF0dHJpYnV0ZSgnbmFtZScpICYmICFlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtY29sbGVjdGlvbicpICYmIGNvbGxlY3Rpb24pIHtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdkYXRhLWNvbGxlY3Rpb24nLCBjb2xsZWN0aW9uKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXNzX3RvJykgJiYgIWVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1wYXNzX2NvbGxlY3Rpb24nKSAmJiAgY29sbGVjdGlvbikge1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtcGFzc19jb2xsZWN0aW9uJywgY29sbGVjdGlvbik7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSAmJiAhZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRvY3VtZW50X2lkJykgJiYgZG9jdW1lbnRfaWQpIHtcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdkYXRhLWRvY3VtZW50X2lkJywgZG9jdW1lbnRfaWQpXG5cdFx0XHR9XG5cdFx0XHRpZiAoIWVsLmhhc0F0dHJpYnV0ZShcImRhdGEtZG9jdW1lbnRfaWRcIikgJiYgZG9jdW1lbnRfaWQgIT0gbnVsbCkge1xuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZG9jdW1lbnRfaWQnLCBkb2N1bWVudF9pZClcblx0XHRcdH1cblxuXHRcdH0pXG5cdH0sXG5cblx0X19zZXRTdWJtaXRFdmVudDogZnVuY3Rpb24oKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXHRcdFxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrZWQtc3VibWl0QnRuJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRcdGNvbnN0IHtlbGVtZW50fSA9IGV2ZW50LmRldGFpbDtcblxuXHRcdFx0c2VsZi5tb2R1bGVzLmZvckVhY2goKHtzZWxlY3RvciwgY2FsbGJhY2t9KSA9PiB7XG5cdFx0XHRcdGlmIChjYWxsYmFjayAmJiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2suY2FsbChudWxsLCBlbGVtZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KVxuXHRcdFxuXHRcdFxuXHR9LFxuXHRcblx0X19jaGVja0Zvcm1WYWxpZGF0ZTogZnVuY3Rpb24oZm9ybSkge1xuXHRcdFxuXHRcdGlmICh0eXBlb2YgQ29DcmVhdGUudW5pcXVlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0cmV0dXJuIENvQ3JlYXRlLnVuaXF1ZS5jaGVja1ZhbGlkYXRlKGZvcm0pXG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXHRcblx0X19pc1RlbXBsYXRlSW5wdXQ6IGZ1bmN0aW9uIChpbnB1dCkge1xuXHRcdGlmIChpbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ3RlbXBsYXRlJykpIHJldHVybiB0cnVlO1xuXHRcdFxuXHRcdGxldCBub2RlID0gaW5wdXQucGFyZW50Tm9kZTtcblx0XHR3aGlsZSAobm9kZSkge1xuXHRcdFx0aWYgKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCd0ZW1wbGF0ZScpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0bm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXHRcblx0Z2V0Rm9ybURhdGE6IGZ1bmN0aW9uKGZvcm0pIHtcblx0XHRjb25zdCBzZWxmID0gdGhpczsgXG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gdGhpcy5tb2R1bGVzLm1hcChtID0+IG0uc2VsZWN0b3IpO1xuXHRcdGNvbnN0IGVsZW1lbnRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9ycy5qb2luKCcsJykpO1xuXHRcdFxuXHRcdGxldCByZXF1ZXN0X2RvY3VtZW50X2lkID0gZmFsc2U7XG5cdFx0bGV0IGRhdGFMaXN0ID0gW107XG5cdFx0XG5cdFx0XG5cdFx0ZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG5cdFx0XHRsZXQgY29sbGVjdGlvbiA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2xsZWN0aW9uJylcblx0XHRcdGxldCBkb2N1bWVudF9pZCA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1kb2N1bWVudF9pZCcpXG5cdFx0XHRsZXQgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnbmFtZScpXG5cdFx0XHRcblx0XHRcdGlmIChlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2F2ZV92YWx1ZScpID09ICdmYWxzZScpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoIWRvY3VtZW50X2lkICYmIG5hbWUpIHtcblx0XHRcdFx0cmVxdWVzdF9kb2N1bWVudF9pZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0bGV0IGRhdGEgPSBkYXRhTGlzdC5maW5kKGQgPT4gZC5jb2xsZWN0aW9uID09IGNvbGxlY3Rpb24gJiYgZC5kb2N1bWVudF9pZCA9PSBkb2N1bWVudF9pZCk7XG5cdFx0XHRcdFxuXHRcdH0pXG5cdH0sXG5cdFxuXHQvLy4gYWRkIGluZm9ybWF0aW9uIG9mIG1vZHVsZXNcblx0Ly8uIHsgc2VsZWN0b3IsIC4uLi4gfVxuXHRpbml0OiBmdW5jdGlvbih7bmFtZSwgc2VsZWN0b3IsIGNhbGxiYWNrfSkge1xuXHRcdFxuXHRcdHRoaXMubW9kdWxlcy5wdXNoKHtcblx0XHRcdG5hbWUsXG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdGNhbGxiYWNrXG5cdFx0fSk7XG5cdFx0XG5cdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHR0aGlzLnNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcblx0XHR9XG5cdH0sXG5cdFxuXHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZWxlY3RvcnM6IHRoaXMuc2VsZWN0b3JzXG5cdFx0fVxuXHR9XG5cdFxufVxuXG5Db0NyZWF0ZUZvcm0uX19pbml0KCk7XG5Db0NyZWF0ZS5jb3JlLnJlZ2lzdGVySW5pdChDb0NyZWF0ZUZvcm0uaW5pdEVsZW1lbnQsIENvQ3JlYXRlRm9ybSk7XG5cbkNvQ3JlYXRlLm9ic2VydmVyLmFkZCh7IFxuXHRuYW1lOiAnQ29DcmVhdGVGb3JtJywgXG5cdG9ic2VydmU6IFsnc3VidHJlZScsICdjaGlsZExpc3QnXSxcblx0aW5jbHVkZTogJ2Zvcm0nLCBcblx0Y2FsbGJhY2s6IGZ1bmN0aW9uKG11dGF0aW9uKSB7XG5cdFx0Q29DcmVhdGVGb3JtLmluaXRFbGVtZW50KG11dGF0aW9uLnRhcmdldClcblx0fVxufSlcblxuZXhwb3J0IGRlZmF1bHQgQ29DcmVhdGVGb3JtOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../CoCreate-components/CoCreate-form/src/CoCreate-form.js\n");

/***/ })

/******/ })["default"];
});