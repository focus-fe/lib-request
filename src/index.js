var $$request = require('./request.js');
var $$requestIframe = require('./request-iframe.js');
var $$limit = require('./limit.js');
var $$querystring = require('querystring');
require('./ie8.hack.js');


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
