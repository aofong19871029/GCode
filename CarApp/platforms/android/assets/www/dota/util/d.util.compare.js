/**
 * 比较string, array, object, number
 * but compare(null, undefined) is false
 */

define(function () {

    /**
     * @param owmproperty 不比较prototype
     */
    return function(a, b, ownproperty) {
        var
            pt = /undefined|number|string|boolean/,
            fn = /^(function\s*)(\w*\b)/,
            cr = "constructor",
            cn = "childNodes",
            pn = "parentNode",
            ce = arguments.callee;

        if (pt.test(typeof a) || pt.test(typeof b) || a === null || b === null) {
            return a == b;
        }

        if (a[cr] !== b[cr]) {
            return false;
        }

        switch (a[cr]) {
            case Date :
                return a.valueOf() === b.valueOf();
            case Function :
                return a.toString().replace(fn, '$1') === b.toString().replace(fn, '$1'); //硬编码中声明函数的方式会影响到toString的结果，因此用正则进行格式化
            case Array :
                if (a.length !== b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (!ce(a[i], b[i])) {
                        return false;
                    }
                }
                break;
            default :
                var alen = 0, blen = 0, d;
                if (a === b) {
                    return true;
                }
                if (a[cn] || a[pn] || b[cn] || b[pn]) {
                    return a === b;
                }
                for (d in a) {
                    alen++;
                }
                for (d in b) {
                    blen++;
                }
                if (alen !== blen) {
                    return false;
                }

                for (d in a) {
                    if(ownproperty && (!a.hasOwnProperty(d) || !b.hasOwnProperty(d))) continue;

                    if (!ce(a[d], b[d], ownproperty)) {
                        return false;
                    }
                }
                break;
        }
        return true;
    }
});