var Messager = require('./lib/messager.js').Messager;

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
