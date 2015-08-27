/**
 * @class
 * @name Pjs
 * @description Class类，框架的基础类体系
 * @base https://github.com/jneen/pjs
 * @author
 */

define(function() {
    var P = (function (prototype, ownProperty, undefined) {
        var noop = function(){};

        return function P(_superclass /* = Object */, definition) {
            // handle the case where no superclass is given
            if (definition === undefined) {
                definition = _superclass;
                _superclass = Object;
            }


            // C is the class to be returned.
            //
            // When called, creates and initializes an instance of C, unless
            // `this` is already an instance of C, then just initializes `this`;
            // either way, returns the instance of C that was initialized.
            //
            //  TODO: the Chrome inspector shows all created objects as `C`
            //        rather than `Object`.  Setting the .name property seems to
            //        have no effect.  Is there a way to override this behavior?
            function C() {
                var self = this instanceof C ? this : new Bare,
                    _super = this._super;

                // load __propertys__
                _super &&  _super.__propertys__.call(this);
                self.__propertys__.call(this);

                self.__superInitialize = _super ? _super.initialize : noop;
                // init the class
                self.initialize.apply(self, arguments);
                return self;
            }

            // C.Bare is a class with a noop constructor.  Its prototype will be
            // the same as C, so that instances of C.Bare are instances of C.
            // `new MyClass.Bare` then creates new instances of C without
            // calling .init().
            function Bare() {
            }

            C.Bare = Bare;

            // Extend the prototype chain: first use Bare to create an
            // uninitialized instance of the superclass, then set up Bare
            // to create instances of this class.
            var _super = Bare[prototype] = _superclass[prototype];
            var proto = Bare[prototype] = C[prototype] = C.p = new Bare;

            // pre-declaring the iteration variable for the loop below to save
            // a `var` keyword after minification
            var key;

            // set the constructor property on the prototype, for convenience
            proto.constructor = C;

            C.extend = function (def) {
                return P(C, def);
            };

            return (C.open = function (def) {
                if (typeof def === 'function') {
                    // call the defining function with all the arguments you need
                    // extensions captures the return value.
                    def = def.call(C, proto, _super, C, _superclass);
                }

                // ...and extend it
                if (typeof def === 'object') {
                    for (key in def) {
                        if (ownProperty.call(def, key)) {
                            proto[key] = def[key];
                        }
                    }
                }
                // parent constructor
                proto._super = _super;

                // properties from self own and prototype except parent
                proto.hasProperty = function(attr){
                    if(Object.prototype.toString.call(attr) === '[object String]') {
                        for (var i in this) {
                            if (i.toLowerCase() === '_super') continue;

                            if (i === attr) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                // if no initialize, assume we're inheriting from a non-Pjs class, so
                // default to using the superclass constructor.
                if (!('initialize' in proto)) proto.initialize = _superclass;
                if(!('__propertys__' in _super)) _super.__propertys__ = noop;
                if(!('__propertys__' in proto)) proto.__propertys__ = noop;

                return C;
            })(definition);
        };

        // as a minifier optimization, we've closured in a few helper functions
        // and the string 'prototype' (C[p] is much shorter than C.prototype)
    })('prototype', ({}).hasOwnProperty);

    return P;
});