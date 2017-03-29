var $$util = require('./util.js');
var $$querystring = require('querystring');
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
