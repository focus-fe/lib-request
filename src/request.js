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
