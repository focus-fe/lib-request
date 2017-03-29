(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var fnAddHeaders = function (headers, xmlhttp) {
	    var key, val;
	    for (key in headers) {
	        if (!headers.hasOwnProperty(key)) {
	            continue;
	        }
	        val = headers[key];
	        xmlhttp.setRequestHeader(key, val);
	    }
	};

	var fnIsCrossDomain = function (url) {
	    if (url.match(/^\/\//)) {
	        url = window.location.protocol + url;
	    }

	    var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
	    var ajaxLocParts = rurl.exec(window.location.href.toLowerCase()) || [];
	    var parts = rurl.exec(url.toLowerCase());

	    return crossDomain = !!(
	        parts &&
	            (parts[1] !== ajaxLocParts[1] ||
	              parts[2] !== ajaxLocParts[2] ||
	              (parts[3] ||
	                (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] ||
	                  (ajaxLocParts[1] === "http:" ? "80" : "443")))
	    );
	};

	// url {String}
	// method {String}
	// headers {Object}
	// body {String}
	// credentials {Boolean}
	// complete {Function}
	var fnXmlHttpRequest = function (url, method, headers, body, credentials, complete) {
	    var fnFormatParams = function () {
	        var fnFormatHeaders = function () {
	            // header
	            if (headers instanceof Object !== true) {
	                headers = {};
	            }

	            // X-Requested-With
	            if (fnIsCrossDomain(url) !== true) {
	                headers['X-Requested-With'] = 'XMLHttpRequest';
	            }

	            // Accept
	            headers.Accept = typeof headers.Accept !== 'string' ? '*/*' : headers.Accept;
	        };

	        if (typeof url !== 'string' || url === '') {
	            url = window.location.href;
	        }

	        if (typeof method !== 'string') {
	            method = 'GET';
	        }

	        fnFormatHeaders();

	        credentials = (fnIsCrossDomain(url) === true && credentials === true) ? true : false ;

	        body = typeof body === 'string' ? body : '';
	    };

	    var fn = function () {
	        if (this.readyState === 3) {
	            this.responseHeader = this.getAllResponseHeaders();
	        }
	        if (this.readyState === 4) {
	            if (typeof complete === 'function') {
	                complete(this);
	            }
	        }
	    };

	    fnFormatParams();

	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.onreadystatechange = fn;
	    xmlhttp.open(method, url, true);
	    fnAddHeaders(headers, xmlhttp);
	    xmlhttp.withCredentials = credentials;
	    xmlhttp.send(body);
	};


	exports.ajax = fnXmlHttpRequest;


/***/ },
/* 2 */
/***/ function(module, exports) {

	var separator = '[[[SP]]]';


	var callbackStorage = {};


	var Messager = {};


	Messager.createListener = function (target) {
	    var callback = function (msg) {
	        if (typeof msg !== 'object') {
	            return;
	        }

	        // 验证是否是匹配的信息
	        msg = typeof msg.data === 'string' ? msg.data : '';
	        msg = msg.split(separator);
	        if (msg.length !== 2) {
	            return;
	        }

	        // 执行用户自定义回调
	        callbackStorage[msg[0]] = callbackStorage[msg[0]] || [];
	        var fns = callbackStorage[msg[0]];
	        var i;
	        for (i = 0; i < fns.length; i++) {
	            fns[i](msg[1]);
	        }
	    };

	    if ('addEventListener' in document) {
	        target.addEventListener('message', callback, false);
	    } else if ('attachEvent' in document) {
	        target.attachEvent('onmessage', callback);
	    }
	};


	Messager.listen = function (category, fn) {
	    callbackStorage[category] = callbackStorage[category] || [];
	    if (typeof fn === 'function') {
	        callbackStorage[category].push(fn);
	    }
	};


	Messager.post = function (target, category, msg) {
	    if (typeof msg !== 'string') {
	        console.log('msg should be string');
	        return;
	    }
	    target.postMessage(category + separator + msg, '*');
	};


	exports.Messager = Messager;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $$request = __webpack_require__(1);
	var $$requestIframe = __webpack_require__(4);
	var $$limit = __webpack_require__(5);
	var $$querystring = __webpack_require__(7);
	__webpack_require__(10);


	var request = {
	    // params {object}
	    // params.url {string}
	    // params.type {string}
	    // params.data {object}
	    // params.complete {function}
	    // params.contentType {string}
	    // params.withCredentials {boolean}
	    // params.cache {boolean}
	    ajax: function (params) {
	        params = $$limit.requestFormat(params);

	        var url = params.url;
	        var type = params.type;
	        var headers = {};
	        var body = '';

	        var fnInitParams = function () {
	            // type
	            var methods = [ 'GET', 'POST' ];
	            if (typeof params.type !== 'string' || methods.indexOf(params.type.toUpperCase()) < 0) {
	                params.type = 'GET';
	            }

	            // Content-Type
	            if (params.type === 'POST') {
	                if (typeof params.contentType === 'string' && params.contentType.indexOf('application/json') >= 0) {
	                    headers['Content-Type'] = 'application/json; charset=UTF-8';
	                } else {
	                    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
	                }
	            }

	            // body
	            var paramsDataString = $$querystring.stringify(params.data);
	            if (params.type === 'GET') {
	                if (paramsDataString && paramsDataString !== '') {
	                    if (params.url.indexOf('?') >= 0) {
	                        url += '&' + paramsDataString;
	                    } else {
	                        url += '?' + paramsDataString;
	                    }
	                }
	            }

	            if (params.type === 'POST') {
	                if (typeof params.contentType === 'string' && params.contentType.indexOf('application/json') >= 0 ) {
	                    body = JSON.stringify(params.data);
	                } else {
	                    body = $$querystring.stringify(params.data);
	                }
	            }

	            // cache
	            if (params.cache !== false) {
	                if (url.indexOf('?') >= 0) {
	                    url += '&_t=' + (+new Date());
	                } else {
	                    url += '?_t=' + (+new Date());
	                }
	            }
	        };
	        fnInitParams();

	        var fn = function (xhr) {
	            var data;

	            if (!xhr || typeof xhr.responseText !== 'string') {
	                data = {
	                    code: 'LR-01',
	                    msg: '请求失败',
	                    data: {}
	                }
	                console.error('[LIB-REQUEST] [SERVER ERROR]');
	            } else {
	                try {
	                    data = JSON.parse(xhr.responseText);
	                } catch (e) {
	                    data = {
	                        code: 'LR-02',
	                        msg: 'JSON格式化错误',
	                        data: {}
	                    }
	                    console.error('[LIB-REQUEST] [PARSE JSON ERROR]');
	                }
	            }

	            if (typeof params.complete === 'function') {
	                data = $$limit.responseFormat(data);
	                params.complete(data);
	            }
	        };

	        var fnIsCrossDomain = function () {
	            if (url.match(/^\/\//)) {
	                url = window.location.protocol + url;
	            }

	            var rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/;
	            var ajaxLocParts = rurl.exec(window.location.href.toLowerCase()) || [];
	            var parts = rurl.exec(url.toLowerCase());

	            return crossDomain = !!(
	                parts &&
	                    (parts[1] !== ajaxLocParts[1] ||
	                      parts[2] !== ajaxLocParts[2] ||
	                      (parts[3] ||
	                        (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] ||
	                          (ajaxLocParts[1] === "http:" ? "80" : "443")))
	            );
	        };

	        var isIframe = false;
	        if (fnIsCrossDomain()) {
	            if (window.navigator.userAgent.indexOf('MSIE 9.0') >= 0) {
	                isIframe = true;
	            }
	            if (window.navigator.userAgent.indexOf('MSIE 8.0') >= 0) {
	                isIframe = true;
	            }
	        }
	        if (isIframe) {
	            $$requestIframe.ajax(url, type, headers, body, params.withCredentials, fn);
	        } else {
	            $$request.ajax(url, type, headers, body, params.withCredentials, fn);
	        }
	    },
	    request: function (url, type, headers, body, withCredentials, fn) {
	        $$request.ajax(url, type, headers, body, withCredentials, fn);
	    },
	    requestByIframe: function (url, type, headers, body, withCredentials, fn) {
	        $$requestIframe.ajax(url, type, headers, body, withCredentials, fn);
	    },
	    pushWhiteList: function (url, key) {
	        $$limit.pushWhiteList(url, key);
	    },
	    pushParamsWhiteList: function (url, key) {
	        $$limit.pushParamsWhiteList(url, key);
	    }
	};


	module.exports = request;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Messager = __webpack_require__(2).Messager;

	var fnGetMessager = (function () {
	    var messagerStorage = {};

	    var mapFnKeyStorage = {};

	    var messagerTag = Math.random();

	    var fnCreateIframe = function (domain) {
	        var protocol = window.location.protocol;
	        var iframe = window.document.createElement('iframe');
	        iframe.src = protocol + '//' + domain + '/crossdomain.html?tag=' + messagerTag;
	        iframe.style.display = 'none';
	        window.document.body.appendChild(iframe);

	        return iframe;
	    };

	    var fn = function (domain, fn) {
	        var messager = messagerStorage[domain] || {};

	        if (messager.ready === false) {
	            messager.readyFns = messager.readyFns || [];
	            messager.readyFns.push(fn);
	            return;
	        }

	        if (messager.ready === true) {
	            fn && fn(messager);
	            return;
	        }

	        // create messager
	        messager.frame = fnCreateIframe(domain);
	        messager.ready = false;
	        messager.readyFns = [ fn ];
	        messager.post = function (msg, fn) {
	            var key = 'key-' + (+new Date()) + window.Math.random().toFixed(15);
	            msg = key + ',' + encodeURIComponent(msg);
	            mapFnKeyStorage[key] = fn;
	            Messager.post(messager.frame.contentWindow, messagerTag + ',' + domain + ',' + 'child', msg);
	        };
	        messagerStorage[domain] = messager;

	        // listen
	        Messager.listen(messagerTag + ',' + domain + ',' + 'parent', function(msg) {
	            if (msg === '[[ready]]') {
	                messager.ready = true;
	                (function () {
	                    var i, fn;
	                    for (i = 0; i < messager.readyFns.length; i++) {
	                        fn = messager.readyFns[i];
	                        fn && fn(messager);
	                    }
	                }());
	            } else {
	                msg = msg.split(',');
	                mapFnKeyStorage[msg[0]] && mapFnKeyStorage[msg[0]](decodeURIComponent(msg[1]));
	            }
	        });
	    };

	    Messager.createListener(window);

	    return fn;
	}());

	var fnRequest = function (opt, fn) {
	    var domain = opt.url.match(/\/\/(.*?)\//);
	    if (domain) {
	        domain = domain[1];
	    } else {
	        domain = window.location.host;
	    }

	    fnGetMessager(domain, function (messager) {
	        var msg = JSON.stringify(opt);

	        messager.post(msg, function (msg) {
	            msg = JSON.parse(msg);
	            fn && fn(msg);
	        });
	    });
	};

	var fnAjax = function (url, method, headers, body, credentials, complete) {
	    var opt = {
	        url: url,
	        method: method,
	        headers: headers,
	        body: body,
	        credentials: credentials
	    };

	    fnRequest(opt, complete);
	};

	exports.ajax = fnAjax;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $$util = __webpack_require__(6);
	var $$querystring = __webpack_require__(7);
	var responseWhiteList = {};
	var requestWhiteList = {};


	var limit = {
	    requestFormat: function (params) {
	        var fnValidateQueryString = function (data) {
	            var fnValidate = function (key, val) {
	                var msg = '[LIB-REQUEST] [REQUEST FEILD ERROR] [' + key + ': ' + val + ']';

	                if (val instanceof Object === true) {
	                    console.error(msg);
	                    return false;
	                }

	                if (typeof val !== 'string') {
	                    val = JSON.stringify(val) || '';
	                }

	                while (val.indexOf('%') >= 0) {
	                    try {
	                        val = decodeURIComponent(val);
	                    } catch(e) {
	                        break;
	                    }
	                }

	                try {
	                    val = JSON.parse(val);
	                    if (val instanceof Object === true) {
	                        console.error(msg);
	                        return false;
	                    }
	                } catch (e) {}

	                return true;
	            };

	            var formatMap = {};
	            var key, val;
	            for (key in data) {
	                if (!data.hasOwnProperty(key)) {
	                    continue;
	                }
	                val = data[key];
	                if (fnValidate(key, val) === true) {
	                    formatMap[key] = val;
	                }
	            }
	            
	            return formatMap;
	        };

	        var fnValidateUrl = function (url) {
	            if (typeof url !== 'string' || url === '') {
	                url = window.location.href;
	            }

	            var qs = url.split('?')[1];
	            var obj = $$querystring.parse(qs);
	            qs = $$querystring.stringify(fnValidateQueryString(obj));
	            if (qs && qs !== '') {
	                return url.split('?')[0] + '?' + qs;
	            } else {
	                return url.split('?')[0];
	            }
	        };

	        var fnValidateJson = function (data) {
	            if (data instanceof Object === false) {
	                return {};
	            }
	        
	            var fnWalkObject, fnWalkArray;

	            fnWalkArray = function (array) {
	                var tbasic = false;
	                var tobject = false;
	                var isOneKeyObject = true;

	                $$util.arrayClear(array);

	                array.forEach(function (item, i) {
	                    var it = $$util.type(item);
	                    if (it === 'array') {
	                        array[i] = '[LIB-REQUEST] [REQUEST ARRAY ERROR]';
	                        return;
	                    }
	                    if (it === 'object') {
	                        tobject = true;
	                        if ($$util.getObjectKeys(item).length > 1) {
	                            isOneKeyObject = false;
	                        }
	                        return;
	                    }
	                    tbasic = true;
	                });

	                if (tbasic === true && tobject === true) {
	                    array = '[LIB-REQUEST] [REQUEST ARRAY ERROR]';
	                    return;
	                }

	                if (tobject === true && array.length > 0 && isOneKeyObject === true) {
	                    (function () {
	                        var key = $$util.getObjectKeys(array[0])[0];
	                        array.forEach(function (item, i) {
	                            array[i] = item[key];
	                        });
	                    }());
	                    return;
	                }

	                if (tobject === true && array.length > 0 && isOneKeyObject === false) {
	                    array.forEach(function (item) {
	                        fnWalkObject(item);
	                    });
	                }
	            };

	            fnWalkObject = function (object) {
	                var key, val, vt;
	                for (key in object) {
	                    if (!object.hasOwnProperty(key)) {
	                        continue;
	                    }
	                    val = object[key];
	                    vt = $$util.type(val);
	                    if (vt === 'object') {
	                        if (val === null) {
	                            delete object[key];
	                        } else if ($$util.isEmptyObject(val)) {
	                            delete object[key];
	                        } else {
	                            fnWalkObject(val);
	                        }
	                    } else if (vt === 'array') {
	                        fnWalkArray(val);
	                    } else if (vt === 'undefined') {
	                        delete object[key];
	                    }
	                }
	            };

	            fnWalkObject(data);

	            return data;
	        };

	        // url
	        params.url = fnValidateUrl(params.url);

	        // data
	        if (params.type === 'POST' && params.contentType === 'application/json') {
	            params.data = fnValidateJson(params.data);
	        } else {
	            params.data = fnValidateQueryString(params.data);
	        }

	        return params;
	    },
	    responseFormat: function (data) {
	        var fnValidateStructure = function (data) {
	            var msg = '[LIB-REQUEST] [RESPONSE STRUCTURE ERROR]';
	            var vdata = {
	                code: 'LR-03',
	                msg: msg,
	                data: {}
	            };

	            if (data instanceof Object === false) {
	                data = vdata;
	            }

	            var ctype = $$util.type(data.code);
	            var mtype = $$util.type(data.msg);
	            var dtype = $$util.type(data.data);

	            var pass = true;

	            if (['number', 'string'].indexOf(ctype) < 0) {
	                data.code = vdata.code;
	                pass = false;
	            }
	            if (['string'].indexOf(mtype) < 0) {
	                data.msg = vdata.msg;
	                pass = false;
	            }
	            if (['number', 'boolean', 'string', 'array', 'object'].indexOf(dtype) < 0) {
	                data.data = vdata.data;
	                pass = false;
	            }

	            return data;
	        };

	        var fnProcessApi = function (data) {
	            if (data instanceof Object === false) {
	                return {};
	            }

	            var fnWalkObject, fnWalkArray;

	            fnWalkArray = function (array) {
	                var tbasic = false;
	                var tobject = false;
	                var tarray = false;
	                var isOneKeyObject = true;

	                $$util.arrayClear(array);

	                array.forEach(function (item, i) {
	                    var it = $$util.type(item);
	                    if (it === 'array') {
	                        array[i] = '[LIB-REQUEST] [RESPONSE ARRAY ERROR]';
	                        return;
	                    }
	                    if (it === 'object') {
	                        tobject = true;
	                        if ($$util.getObjectKeys(item).length > 1) {
	                            isOneKeyObject = false;
	                        }
	                        return;
	                    }
	                    tbasic = true;
	                });

	                if (tbasic === true && tobject === true) {
	                    array = '[LIB-REQUEST] [RESPONSE ARRAY ERROR]';
	                    return;
	                }

	                // one key
	                if (tobject === true && array.length > 0 && isOneKeyObject === true) {
	                    (function () {
	                        var key = $$util.getObjectKeys(array[0])[0];
	                        array.forEach(function (item, i) {
	                            array[i] = item[key];
	                        });
	                    }());
	                    return;
	                }

	                // basic
	                if (tbasic === true && tobject === false) {
	                    array.forEach(function (item, i) {
	                        array[i] = item.toString();
	                    });
	                    return;
	                }

	                // object
	                if (tobject === true && array.length > 0 && isOneKeyObject === false) {
	                    array.forEach(function (item) {
	                        fnWalkObject(item);
	                    });
	                }
	            };

	            fnWalkObject = function (object) {
	                var key, val, vt;
	                for (key in object) {
	                    if (!object.hasOwnProperty(key)) {
	                        continue;
	                    }
	                    val = object[key];
	                    vt = $$util.type(val);
	                    if (vt === 'object') {
	                        if (val === null) {
	                            delete object[key];
	                        } else if ($$util.isEmptyObject(val)) {
	                            delete object[key];
	                        } else {
	                            fnWalkObject(val);
	                        }
	                    } else if (vt === 'array') {
	                        fnWalkArray(val);
	                    } else if (vt === 'undefined') {
	                        delete object[key];
	                    } else {
	                        try {
	                            object[key] = val.toString();
	                        } catch (e) {}
	                    }
	                }
	            };

	            fnWalkObject(data);

	            return data;
	        };

	        data = fnValidateStructure(data);
	        data = fnProcessApi(data);

	        return data;
	    },
	    pushWhiteList: function (url, key) {
	        if (typeof url !== 'string' || url === '') {
	            return;
	        }
	        if (typeof key !== 'string' || key === '') {
	            return;
	        }
	        responseWhiteList[url] = responseWhiteList[url] || [];
	        responseWhiteList[url].push(key);
	    },
	    pushParamsWhiteList: function (url, key) {
	        if (typeof url !== 'string' || url === '') {
	            return;
	        }
	        if (typeof key !== 'string' || key === '') {
	            return;
	        }
	        requestWhiteList[url] = requestWhiteList[url] || [];
	        requestWhiteList[url].push(key);
	    }
	};


	module.exports = limit;


/***/ },
/* 6 */
/***/ function(module, exports) {

	exports.type = function (val) {
	    var t = typeof val;
	    if (t === 'object' && val instanceof Array === true) {
	        t = 'array';
	    }
	    return t;
	};

	exports.isEmptyObject = function (object) {
	    var _this = this;
	    if (_this.type(object) !== 'object') {
	        return false;
	    }

	    var key;
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            return false;
	        }
	    }
	    return true;
	};

	exports.arrayClear = function (array, val) {
	    var _this = this;
	    var cnt = 0;
	    var i, item;
	    var match;
	    var i1;
	    for (i = 0; i < array.length; i++) {
	        match = false;
	        item = array[i];
	        if (item === null) {
	            match = true;
	        } else if (item === undefined) {
	            match = true;
	        } else if (_this.type(item) === 'object' && JSON.stringify(item) === '{}') {
	            match = true;
	        }

	        if (match) {
	            for (i1 = i; i1 < array.length; i1++) {
	                array[i1] = array[i1 + 1];
	            }
	            array.length = array.length - 1;
	        }
	    }
	};

	exports.getObjectKeys = function (object) {
	    var akey = [];
	    var key;
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            akey.push(key);
	        }
	    }
	    return akey;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(8);
	exports.encode = exports.stringify = __webpack_require__(9);


/***/ },
/* 8 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return map(objectKeys(obj), function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function map (xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}

	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	/*---------------------------------------*
	* Array
	*---------------------------------------*/
	(function (ap) {
	    // indexOf
	    if (ap.indexOf) {
	        return;
	    }

	    ap.indexOf = function (val) {
	        var i, item;
	        for (i = 0; i < this.length; i++) {
	            item = this[i];
	            if (val === item) {
	                break;
	            }
	        }

	        if (i < this.length) {
	            return i;
	        } else {
	            return -1;
	        }
	    };

	    // forEach
	    if (ap.forEach) {
	        return;
	    }

	    ap.forEach = function (fn) {
	        if (typeof fn !== 'function') {
	            return;
	        }

	        var i, item;
	        for (i = 0; i < this.length; i++) {
	            item = this[i];
	            fn.call(this, item, i);
	        }
	    };
	}(Array.prototype));


/***/ }
/******/ ])
});
;