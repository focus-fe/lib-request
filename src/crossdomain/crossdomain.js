var request = require('../request.js');
var Messager = require('../lib/messager.js').Messager;

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
