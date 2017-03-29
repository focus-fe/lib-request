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
