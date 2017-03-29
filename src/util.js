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
