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

	var request = __webpack_require__(1);
	var Messager = __webpack_require__(2).Messager;

	var messagerTag = window.location.href.match(/tag=(.*)/);
	messagerTag = messagerTag && messagerTag[1] || '';
	var domain = window.location.hostname;

	Messager.listen(messagerTag + ',' + domain + ',' + 'child', function(msg) {
	    msg = msg.split(',');

	    var params = decodeURIComponent(msg[1]);
	    params = JSON.parse(params);

	    request.ajax(params.url, params.method, params.headers, params.body, true, function (data) {
	        var ndata = {};
	        var key, val;
	        for (key in data) {
	            val = data[key];
	            if (typeof key !== 'object' && typeof key !== 'function') {
	                ndata[key] = data[key];
	            }
	        }

	        var rt = msg[0] + ',' + encodeURIComponent(JSON.stringify(ndata));
	        Messager.post(parent, messagerTag + ',' + domain + ',' + 'parent', rt);
	    });
	});

	Messager.createListener(window);
	Messager.post(parent, messagerTag + ',' + domain + ',' + 'parent', '[[ready]]');


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


/***/ }
/******/ ])
});
;