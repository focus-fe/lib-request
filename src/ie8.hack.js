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
