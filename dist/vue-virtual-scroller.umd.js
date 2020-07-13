(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory(global['vue-virtual-scroller'] = {}, global.vue));
}(this, (function (exports, vue) { 'use strict';

  var config = {
    itemsLimit: 1000
  };

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function getInternetExplorerVersion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');

    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');

    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');

    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    } // other browser


    return -1;
  }

  //
  var isIE;

  function initCompat() {
    if (!initCompat.init) {
      initCompat.init = true;
      isIE = getInternetExplorerVersion() !== -1;
    }
  }

  var script = {
    name: 'ResizeObserver',
    mounted: function mounted() {
      var _this = this;

      initCompat();
      this.$nextTick(function () {
        _this._w = _this.$el.offsetWidth;
        _this._h = _this.$el.offsetHeight;
      });
      var object = document.createElement('object');
      this._resizeObject = object;
      object.setAttribute('aria-hidden', 'true');
      object.setAttribute('tabindex', -1);
      object.onload = this.addResizeHandlers;
      object.type = 'text/html';

      if (isIE) {
        this.$el.appendChild(object);
      }

      object.data = 'about:blank';

      if (!isIE) {
        this.$el.appendChild(object);
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.removeResizeHandlers();
    },
    methods: {
      compareAndNotify: function compareAndNotify() {
        if (this._w !== this.$el.offsetWidth || this._h !== this.$el.offsetHeight) {
          this._w = this.$el.offsetWidth;
          this._h = this.$el.offsetHeight;
          this.$emit('notify', {
            width: this._w,
            height: this._h
          });
        }
      },
      addResizeHandlers: function addResizeHandlers() {
        this._resizeObject.contentDocument.defaultView.addEventListener('resize', this.compareAndNotify);

        this.compareAndNotify();
      },
      removeResizeHandlers: function removeResizeHandlers() {
        if (this._resizeObject && this._resizeObject.onload) {
          if (!isIE && this._resizeObject.contentDocument) {
            this._resizeObject.contentDocument.defaultView.removeEventListener('resize', this.compareAndNotify);
          }

          this.$el.removeChild(this._resizeObject);
          this._resizeObject.onload = null;
          this._resizeObject = null;
        }
      }
    }
  };

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * IMPORTANT: all calls of this function must be prefixed with
   * \/\*#\_\_PURE\_\_\*\/
   * So that rollup can tree-shake them if necessary.
   */
  function makeMap(str, expectsLowerCase) {
      const map = Object.create(null);
      const list = str.split(',');
      for (let i = 0; i < list.length; i++) {
          map[list[i]] = true;
      }
      return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
  }

  const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
      'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
      'Object,Boolean,String,RegExp,Map,Set,JSON,Intl';
  const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED);

  function normalizeStyle(value) {
      if (isArray(value)) {
          const res = {};
          for (let i = 0; i < value.length; i++) {
              const item = value[i];
              const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
              if (normalized) {
                  for (const key in normalized) {
                      res[key] = normalized[key];
                  }
              }
          }
          return res;
      }
      else if (isObject(value)) {
          return value;
      }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:(.+)/;
  function parseStringStyle(cssText) {
      const ret = {};
      cssText.split(listDelimiterRE).forEach(item => {
          if (item) {
              const tmp = item.split(propertyDelimiterRE);
              tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
          }
      });
      return ret;
  }
  function normalizeClass(value) {
      let res = '';
      if (isString(value)) {
          res = value;
      }
      else if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              res += normalizeClass(value[i]) + ' ';
          }
      }
      else if (isObject(value)) {
          for (const name in value) {
              if (value[name]) {
                  res += name + ' ';
              }
          }
      }
      return res.trim();
  }

  const EMPTY_OBJ = (process.env.NODE_ENV !== 'production')
      ? Object.freeze({})
      : {};
  const EMPTY_ARR = [];
  const NOOP = () => { };
  const extend = Object.assign;
  const remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
          arr.splice(i, 1);
      }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray = Array.isArray;
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isSymbol = (val) => typeof val === 'symbol';
  const isObject = (val) => val !== null && typeof val === 'object';
  const isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
  };
  const cacheStringFunction = (fn) => {
      const cache = Object.create(null);
      return ((str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
      });
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
  });
  const capitalize = cacheStringFunction((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  });
  // compare whether a value has changed, accounting for NaN.
  const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  const def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: false,
          value
      });
  };

  const targetMap = new WeakMap();
  const effectStack = [];
  let activeEffect;
  const ITERATE_KEY = Symbol((process.env.NODE_ENV !== 'production') ? 'iterate' : '');
  const MAP_KEY_ITERATE_KEY = Symbol((process.env.NODE_ENV !== 'production') ? 'Map key iterate' : '');
  function isEffect(fn) {
      return fn && fn._isEffect === true;
  }
  function effect(fn, options = EMPTY_OBJ) {
      if (isEffect(fn)) {
          fn = fn.raw;
      }
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  function stop(effect) {
      if (effect.active) {
          cleanup(effect);
          if (effect.options.onStop) {
              effect.options.onStop();
          }
          effect.active = false;
      }
  }
  let uid = 0;
  function createReactiveEffect(fn, options) {
      const effect = function reactiveEffect(...args) {
          if (!effect.active) {
              return options.scheduler ? undefined : fn(...args);
          }
          if (!effectStack.includes(effect)) {
              cleanup(effect);
              try {
                  enableTracking();
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn(...args);
              }
              finally {
                  effectStack.pop();
                  resetTracking();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.id = uid++;
      effect._isEffect = true;
      effect.active = true;
      effect.raw = fn;
      effect.deps = [];
      effect.options = options;
      return effect;
  }
  function cleanup(effect) {
      const { deps } = effect;
      if (deps.length) {
          for (let i = 0; i < deps.length; i++) {
              deps[i].delete(effect);
          }
          deps.length = 0;
      }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
  }
  function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
  }
  function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === undefined ? true : last;
  }
  function track(target, type, key) {
      if (!shouldTrack || activeEffect === undefined) {
          return;
      }
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, (dep = new Set()));
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
          activeEffect.deps.push(dep);
          if ((process.env.NODE_ENV !== 'production') && activeEffect.options.onTrack) {
              activeEffect.options.onTrack({
                  effect: activeEffect,
                  target,
                  type,
                  key
              });
          }
      }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
          // never been tracked
          return;
      }
      const effects = new Set();
      const add = (effectsToAdd) => {
          if (effectsToAdd) {
              effectsToAdd.forEach(effect => {
                  if (effect !== activeEffect || !shouldTrack) {
                      effects.add(effect);
                  }
              });
          }
      };
      if (type === "clear" /* CLEAR */) {
          // collection being cleared
          // trigger all effects for target
          depsMap.forEach(add);
      }
      else if (key === 'length' && isArray(target)) {
          depsMap.forEach((dep, key) => {
              if (key === 'length' || key >= newValue) {
                  add(dep);
              }
          });
      }
      else {
          // schedule runs for SET | ADD | DELETE
          if (key !== void 0) {
              add(depsMap.get(key));
          }
          // also run for iteration key on ADD | DELETE | Map.SET
          const isAddOrDelete = type === "add" /* ADD */ ||
              (type === "delete" /* DELETE */ && !isArray(target));
          if (isAddOrDelete ||
              (type === "set" /* SET */ && target instanceof Map)) {
              add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY));
          }
          if (isAddOrDelete && target instanceof Map) {
              add(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
      }
      const run = (effect) => {
          if ((process.env.NODE_ENV !== 'production') && effect.options.onTrigger) {
              effect.options.onTrigger({
                  effect,
                  target,
                  key,
                  type,
                  newValue,
                  oldValue,
                  oldTarget
              });
          }
          if (effect.options.scheduler) {
              effect.options.scheduler(effect);
          }
          else {
              effect();
          }
      };
      effects.forEach(run);
  }

  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
      .map(key => Symbol[key])
      .filter(isSymbol));
  const get = /*#__PURE__*/ createGetter();
  const shallowGet = /*#__PURE__*/ createGetter(false, true);
  const readonlyGet = /*#__PURE__*/ createGetter(true);
  const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
  const arrayInstrumentations = {};
  ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
      arrayInstrumentations[key] = function (...args) {
          const arr = toRaw(this);
          for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "get" /* GET */, i + '');
          }
          // we run the method using the original args first (which may be reactive)
          const res = arr[key](...args);
          if (res === -1 || res === false) {
              // if that didn't work, run it again using raw values.
              return arr[key](...args.map(toRaw));
          }
          else {
              return res;
          }
      };
  });
  function createGetter(isReadonly = false, shallow = false) {
      return function get(target, key, receiver) {
          if (key === "__v_isReactive" /* IS_REACTIVE */) {
              return !isReadonly;
          }
          else if (key === "__v_isReadonly" /* IS_READONLY */) {
              return isReadonly;
          }
          else if (key === "__v_raw" /* RAW */ &&
              receiver ===
                  (isReadonly
                      ? target["__v_readonly" /* READONLY */]
                      : target["__v_reactive" /* REACTIVE */])) {
              return target;
          }
          const targetIsArray = isArray(target);
          if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
          }
          const res = Reflect.get(target, key, receiver);
          if (isSymbol(key)
              ? builtInSymbols.has(key)
              : key === `__proto__` || key === `__v_isRef`) {
              return res;
          }
          if (!isReadonly) {
              track(target, "get" /* GET */, key);
          }
          if (shallow) {
              return res;
          }
          if (isRef(res)) {
              // ref unwrapping, only for Objects, not for Arrays.
              return targetIsArray ? res : res.value;
          }
          if (isObject(res)) {
              // Convert returned value into a proxy as well. we do the isObject check
              // here to avoid invalid value warning. Also need to lazy access readonly
              // and reactive here to avoid circular dependency.
              return isReadonly ? readonly(res) : reactive(res);
          }
          return res;
      };
  }
  const set = /*#__PURE__*/ createSetter();
  const shallowSet = /*#__PURE__*/ createSetter(true);
  function createSetter(shallow = false) {
      return function set(target, key, value, receiver) {
          const oldValue = target[key];
          if (!shallow) {
              value = toRaw(value);
              if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                  oldValue.value = value;
                  return true;
              }
          }
          const hadKey = hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          // don't trigger if target is something up in the prototype chain of original
          if (target === toRaw(receiver)) {
              if (!hadKey) {
                  trigger(target, "add" /* ADD */, key, value);
              }
              else if (hasChanged(value, oldValue)) {
                  trigger(target, "set" /* SET */, key, value, oldValue);
              }
          }
          return result;
      };
  }
  function deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
          trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
      }
      return result;
  }
  function has(target, key) {
      const result = Reflect.has(target, key);
      track(target, "has" /* HAS */, key);
      return result;
  }
  function ownKeys$1(target) {
      track(target, "iterate" /* ITERATE */, ITERATE_KEY);
      return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
      get,
      set,
      deleteProperty,
      has,
      ownKeys: ownKeys$1
  };
  const readonlyHandlers = {
      get: readonlyGet,
      has,
      ownKeys: ownKeys$1,
      set(target, key) {
          if ((process.env.NODE_ENV !== 'production')) {
              console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
          }
          return true;
      },
      deleteProperty(target, key) {
          if ((process.env.NODE_ENV !== 'production')) {
              console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
          }
          return true;
      }
  };
  const shallowReactiveHandlers = extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
  });
  // Props handlers are special in the sense that it should not unwrap top-level
  // refs (in order to allow refs to be explicitly passed down), but should
  // retain the reactivity of the normal readonly object.
  const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
  });

  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, wrap) {
      target = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
          track(target, "get" /* GET */, key);
      }
      track(target, "get" /* GET */, rawKey);
      const { has, get } = getProto(target);
      if (has.call(target, key)) {
          return wrap(get.call(target, key));
      }
      else if (has.call(target, rawKey)) {
          return wrap(get.call(target, rawKey));
      }
  }
  function has$1(key) {
      const target = toRaw(this);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
          track(target, "has" /* HAS */, key);
      }
      track(target, "has" /* HAS */, rawKey);
      const has = getProto(target).has;
      return has.call(target, key) || has.call(target, rawKey);
  }
  function size(target) {
      target = toRaw(target);
      track(target, "iterate" /* ITERATE */, ITERATE_KEY);
      return Reflect.get(getProto(target), 'size', target);
  }
  function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      const result = proto.add.call(target, value);
      if (!hadKey) {
          trigger(target, "add" /* ADD */, value, value);
      }
      return result;
  }
  function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has, get, set } = getProto(target);
      let hadKey = has.call(target, key);
      if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
      }
      else if ((process.env.NODE_ENV !== 'production')) {
          checkIdentityKeys(target, has, key);
      }
      const oldValue = get.call(target, key);
      const result = set.call(target, key, value);
      if (!hadKey) {
          trigger(target, "add" /* ADD */, key, value);
      }
      else if (hasChanged(value, oldValue)) {
          trigger(target, "set" /* SET */, key, value, oldValue);
      }
      return result;
  }
  function deleteEntry(key) {
      const target = toRaw(this);
      const { has, get, delete: del } = getProto(target);
      let hadKey = has.call(target, key);
      if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
      }
      else if ((process.env.NODE_ENV !== 'production')) {
          checkIdentityKeys(target, has, key);
      }
      const oldValue = get ? get.call(target, key) : undefined;
      // forward the operation before queueing reactions
      const result = del.call(target, key);
      if (hadKey) {
          trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
      }
      return result;
  }
  function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const oldTarget = (process.env.NODE_ENV !== 'production')
          ? target instanceof Map
              ? new Map(target)
              : new Set(target)
          : undefined;
      // forward the operation before queueing reactions
      const result = getProto(target).clear.call(target);
      if (hadItems) {
          trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
      }
      return result;
  }
  function createForEach(isReadonly, shallow) {
      return function forEach(callback, thisArg) {
          const observed = this;
          const target = toRaw(observed);
          const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
          !isReadonly && track(target, "iterate" /* ITERATE */, ITERATE_KEY);
          // important: create sure the callback is
          // 1. invoked with the reactive map as `this` and 3rd arg
          // 2. the value received should be a corresponding reactive/readonly.
          function wrappedCallback(value, key) {
              return callback.call(thisArg, wrap(value), wrap(key), observed);
          }
          return getProto(target).forEach.call(target, wrappedCallback);
      };
  }
  function createIterableMethod(method, isReadonly, shallow) {
      return function (...args) {
          const target = toRaw(this);
          const isMap = target instanceof Map;
          const isPair = method === 'entries' || (method === Symbol.iterator && isMap);
          const isKeyOnly = method === 'keys' && isMap;
          const innerIterator = getProto(target)[method].apply(target, args);
          const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
          !isReadonly &&
              track(target, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
          // return a wrapped iterator which returns observed versions of the
          // values emitted from the real iterator
          return {
              // iterator protocol
              next() {
                  const { value, done } = innerIterator.next();
                  return done
                      ? { value, done }
                      : {
                          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                          done
                      };
              },
              // iterable protocol
              [Symbol.iterator]() {
                  return this;
              }
          };
      };
  }
  function createReadonlyMethod(type) {
      return function (...args) {
          if ((process.env.NODE_ENV !== 'production')) {
              const key = args[0] ? `on key "${args[0]}" ` : ``;
              console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
          }
          return type === "delete" /* DELETE */ ? false : this;
      };
  }
  const mutableInstrumentations = {
      get(key) {
          return get$1(this, key, toReactive);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
  };
  const shallowInstrumentations = {
      get(key) {
          return get$1(this, key, toShallow);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
  };
  const readonlyInstrumentations = {
      get(key) {
          return get$1(this, key, toReadonly);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add: createReadonlyMethod("add" /* ADD */),
      set: createReadonlyMethod("set" /* SET */),
      delete: createReadonlyMethod("delete" /* DELETE */),
      clear: createReadonlyMethod("clear" /* CLEAR */),
      forEach: createForEach(true, false)
  };
  const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(method => {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
  });
  function createInstrumentationGetter(isReadonly, shallow) {
      const instrumentations = shallow
          ? shallowInstrumentations
          : isReadonly
              ? readonlyInstrumentations
              : mutableInstrumentations;
      return (target, key, receiver) => {
          if (key === "__v_isReactive" /* IS_REACTIVE */) {
              return !isReadonly;
          }
          else if (key === "__v_isReadonly" /* IS_READONLY */) {
              return isReadonly;
          }
          else if (key === "__v_raw" /* RAW */) {
              return target;
          }
          return Reflect.get(hasOwn(instrumentations, key) && key in target
              ? instrumentations
              : target, key, receiver);
      };
  }
  const mutableCollectionHandlers = {
      get: createInstrumentationGetter(false, false)
  };
  const readonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, false)
  };
  function checkIdentityKeys(target, has, key) {
      const rawKey = toRaw(key);
      if (rawKey !== key && has.call(target, rawKey)) {
          const type = toRawType(target);
          console.warn(`Reactive ${type} contains both the raw and reactive ` +
              `versions of the same object${type === `Map` ? `as keys` : ``}, ` +
              `which can lead to inconsistencies. ` +
              `Avoid differentiating between the raw and reactive versions ` +
              `of an object and only use the reactive version if possible.`);
      }
  }

  const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
  const isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
  const canObserve = (value) => {
      return (!value["__v_skip" /* SKIP */] &&
          isObservableType(toRawType(value)) &&
          !Object.isFrozen(value));
  };
  function reactive(target) {
      // if trying to observe a readonly proxy, return the readonly version.
      if (target && target["__v_isReadonly" /* IS_READONLY */]) {
          return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
  }
  function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
  }
  // Return a reactive-copy of the original object, where only the root level
  // properties are readonly, and does NOT unwrap refs nor recursively convert
  // returned properties.
  // This is used for creating the props proxy object for stateful components.
  function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
  }
  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
      if (!isObject(target)) {
          if ((process.env.NODE_ENV !== 'production')) {
              console.warn(`value cannot be made reactive: ${String(target)}`);
          }
          return target;
      }
      // target is already a Proxy, return it.
      // exception: calling readonly() on a reactive object
      if (target["__v_raw" /* RAW */] &&
          !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
          return target;
      }
      // target already has corresponding Proxy
      if (hasOwn(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */)) {
          return isReadonly
              ? target["__v_readonly" /* READONLY */]
              : target["__v_reactive" /* REACTIVE */];
      }
      // only a whitelist of value types can be observed.
      if (!canObserve(target)) {
          return target;
      }
      const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
      def(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */, observed);
      return observed;
  }
  function isReactive(value) {
      if (isReadonly(value)) {
          return isReactive(value["__v_raw" /* RAW */]);
      }
      return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
  }
  function isReadonly(value) {
      return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
  }
  function isProxy(value) {
      return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
      return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
  }
  function isRef(r) {
      return r ? r.__v_isRef === true : false;
  }

  const stack = [];
  function pushWarningContext(vnode) {
      stack.push(vnode);
  }
  function popWarningContext() {
      stack.pop();
  }
  function warn(msg, ...args) {
      // avoid props formatting or warn handler tracking deps that might be mutated
      // during patch, leading to infinite recursion.
      pauseTracking();
      const instance = stack.length ? stack[stack.length - 1].component : null;
      const appWarnHandler = instance && instance.appContext.config.warnHandler;
      const trace = getComponentTrace();
      if (appWarnHandler) {
          callWithErrorHandling(appWarnHandler, instance, 11 /* APP_WARN_HANDLER */, [
              msg + args.join(''),
              instance && instance.proxy,
              trace
                  .map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`)
                  .join('\n'),
              trace
          ]);
      }
      else {
          const warnArgs = [`[Vue warn]: ${msg}`, ...args];
          if (trace.length &&
              // avoid spamming console during tests
              !false) {
              warnArgs.push(`\n`, ...formatTrace(trace));
          }
          console.warn(...warnArgs);
      }
      resetTracking();
  }
  function getComponentTrace() {
      let currentVNode = stack[stack.length - 1];
      if (!currentVNode) {
          return [];
      }
      // we can't just use the stack because it will be incomplete during updates
      // that did not start from the root. Re-construct the parent chain using
      // instance parent pointers.
      const normalizedStack = [];
      while (currentVNode) {
          const last = normalizedStack[0];
          if (last && last.vnode === currentVNode) {
              last.recurseCount++;
          }
          else {
              normalizedStack.push({
                  vnode: currentVNode,
                  recurseCount: 0
              });
          }
          const parentInstance = currentVNode.component && currentVNode.component.parent;
          currentVNode = parentInstance && parentInstance.vnode;
      }
      return normalizedStack;
  }
  function formatTrace(trace) {
      const logs = [];
      trace.forEach((entry, i) => {
          logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
      });
      return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
      const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
      const isRoot = vnode.component ? vnode.component.parent == null : false;
      const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
      const close = `>` + postfix;
      return vnode.props
          ? [open, ...formatProps(vnode.props), close]
          : [open + close];
  }
  function formatProps(props) {
      const res = [];
      const keys = Object.keys(props);
      keys.slice(0, 3).forEach(key => {
          res.push(...formatProp(key, props[key]));
      });
      if (keys.length > 3) {
          res.push(` ...`);
      }
      return res;
  }
  function formatProp(key, value, raw) {
      if (isString(value)) {
          value = JSON.stringify(value);
          return raw ? value : [`${key}=${value}`];
      }
      else if (typeof value === 'number' ||
          typeof value === 'boolean' ||
          value == null) {
          return raw ? value : [`${key}=${value}`];
      }
      else if (isRef(value)) {
          value = formatProp(key, toRaw(value.value), true);
          return raw ? value : [`${key}=Ref<`, value, `>`];
      }
      else if (isFunction(value)) {
          return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
      }
      else {
          value = toRaw(value);
          return raw ? value : [`${key}=`, value];
      }
  }

  const ErrorTypeStrings = {
      ["bc" /* BEFORE_CREATE */]: 'beforeCreate hook',
      ["c" /* CREATED */]: 'created hook',
      ["bm" /* BEFORE_MOUNT */]: 'beforeMount hook',
      ["m" /* MOUNTED */]: 'mounted hook',
      ["bu" /* BEFORE_UPDATE */]: 'beforeUpdate hook',
      ["u" /* UPDATED */]: 'updated',
      ["bum" /* BEFORE_UNMOUNT */]: 'beforeUnmount hook',
      ["um" /* UNMOUNTED */]: 'unmounted hook',
      ["a" /* ACTIVATED */]: 'activated hook',
      ["da" /* DEACTIVATED */]: 'deactivated hook',
      ["ec" /* ERROR_CAPTURED */]: 'errorCaptured hook',
      ["rtc" /* RENDER_TRACKED */]: 'renderTracked hook',
      ["rtg" /* RENDER_TRIGGERED */]: 'renderTriggered hook',
      [0 /* SETUP_FUNCTION */]: 'setup function',
      [1 /* RENDER_FUNCTION */]: 'render function',
      [2 /* WATCH_GETTER */]: 'watcher getter',
      [3 /* WATCH_CALLBACK */]: 'watcher callback',
      [4 /* WATCH_CLEANUP */]: 'watcher cleanup function',
      [5 /* NATIVE_EVENT_HANDLER */]: 'native event handler',
      [6 /* COMPONENT_EVENT_HANDLER */]: 'component event handler',
      [7 /* VNODE_HOOK */]: 'vnode hook',
      [8 /* DIRECTIVE_HOOK */]: 'directive hook',
      [9 /* TRANSITION_HOOK */]: 'transition hook',
      [10 /* APP_ERROR_HANDLER */]: 'app errorHandler',
      [11 /* APP_WARN_HANDLER */]: 'app warnHandler',
      [12 /* FUNCTION_REF */]: 'ref function',
      [13 /* ASYNC_COMPONENT_LOADER */]: 'async component loader',
      [14 /* SCHEDULER */]: 'scheduler flush. This is likely a Vue internals bug. ' +
          'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next'
  };
  function callWithErrorHandling(fn, instance, type, args) {
      let res;
      try {
          res = args ? fn(...args) : fn();
      }
      catch (err) {
          handleError(err, instance, type);
      }
      return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
      if (isFunction(fn)) {
          const res = callWithErrorHandling(fn, instance, type, args);
          if (res && isPromise(res)) {
              res.catch(err => {
                  handleError(err, instance, type);
              });
          }
          return res;
      }
      const values = [];
      for (let i = 0; i < fn.length; i++) {
          values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
  }
  function handleError(err, instance, type) {
      const contextVNode = instance ? instance.vnode : null;
      if (instance) {
          let cur = instance.parent;
          // the exposed instance is the render proxy to keep it consistent with 2.x
          const exposedInstance = instance.proxy;
          // in production the hook receives only the error code
          const errorInfo = (process.env.NODE_ENV !== 'production') ? ErrorTypeStrings[type] : type;
          while (cur) {
              const errorCapturedHooks = cur.ec;
              if (errorCapturedHooks) {
                  for (let i = 0; i < errorCapturedHooks.length; i++) {
                      if (errorCapturedHooks[i](err, exposedInstance, errorInfo)) {
                          return;
                      }
                  }
              }
              cur = cur.parent;
          }
          // app-level handling
          const appErrorHandler = instance.appContext.config.errorHandler;
          if (appErrorHandler) {
              callWithErrorHandling(appErrorHandler, null, 10 /* APP_ERROR_HANDLER */, [err, exposedInstance, errorInfo]);
              return;
          }
      }
      logError(err, type, contextVNode);
  }
  function logError(err, type, contextVNode) {
      // default behavior is crash in prod & test, recover in dev.
      if ((process.env.NODE_ENV !== 'production') && ( !false)) {
          const info = ErrorTypeStrings[type];
          if (contextVNode) {
              pushWarningContext(contextVNode);
          }
          warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
          console.error(err);
          if (contextVNode) {
              popWarningContext();
          }
      }
      else {
          throw err;
      }
  }

  const queue = [];
  const postFlushCbs = [];
  const p = Promise.resolve();
  let isFlushing = false;
  let isFlushPending = false;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
      return fn ? p.then(fn) : p;
  }
  function queueJob(job) {
      if (!queue.includes(job)) {
          queue.push(job);
          queueFlush();
      }
  }
  function queuePostFlushCb(cb) {
      if (!isArray(cb)) {
          postFlushCbs.push(cb);
      }
      else {
          postFlushCbs.push(...cb);
      }
      queueFlush();
  }
  function queueFlush() {
      if (!isFlushing && !isFlushPending) {
          isFlushPending = true;
          nextTick(flushJobs);
      }
  }
  function flushPostFlushCbs(seen) {
      if (postFlushCbs.length) {
          const cbs = [...new Set(postFlushCbs)];
          postFlushCbs.length = 0;
          if ((process.env.NODE_ENV !== 'production')) {
              seen = seen || new Map();
          }
          for (let i = 0; i < cbs.length; i++) {
              if ((process.env.NODE_ENV !== 'production')) {
                  checkRecursiveUpdates(seen, cbs[i]);
              }
              cbs[i]();
          }
      }
  }
  const getId = (job) => (job.id == null ? Infinity : job.id);
  function flushJobs(seen) {
      isFlushPending = false;
      isFlushing = true;
      let job;
      if ((process.env.NODE_ENV !== 'production')) {
          seen = seen || new Map();
      }
      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child so its render effect will have smaller
      //    priority number)
      // 2. If a component is unmounted during a parent component's update,
      //    its update can be skipped.
      // Jobs can never be null before flush starts, since they are only invalidated
      // during execution of another flushed job.
      queue.sort((a, b) => getId(a) - getId(b));
      while ((job = queue.shift()) !== undefined) {
          if (job === null) {
              continue;
          }
          if ((process.env.NODE_ENV !== 'production')) {
              checkRecursiveUpdates(seen, job);
          }
          callWithErrorHandling(job, null, 14 /* SCHEDULER */);
      }
      flushPostFlushCbs(seen);
      isFlushing = false;
      // some postFlushCb queued jobs!
      // keep flushing until it drains.
      if (queue.length || postFlushCbs.length) {
          flushJobs(seen);
      }
  }
  function checkRecursiveUpdates(seen, fn) {
      if (!seen.has(fn)) {
          seen.set(fn, 1);
      }
      else {
          const count = seen.get(fn);
          if (count > RECURSION_LIMIT) {
              throw new Error('Maximum recursive updates exceeded. ' +
                  "You may have code that is mutating state in your component's " +
                  'render function or updated hook or watcher source function.');
          }
          else {
              seen.set(fn, count + 1);
          }
      }
  }
  const hmrDirtyComponents = new Set();
  // Expose the HMR runtime on the global object
  // This makes it entirely tree-shakable without polluting the exports and makes
  // it easier to be used in toolings like vue-loader
  // Note: for a component to be eligible for HMR it also needs the __hmrId option
  // to be set so that its instances can be registered / removed.
  if ((process.env.NODE_ENV !== 'production')) {
      const globalObject = typeof global !== 'undefined'
          ? global
          : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
                  ? window
                  : {};
      globalObject.__VUE_HMR_RUNTIME__ = {
          createRecord: tryWrap(createRecord),
          rerender: tryWrap(rerender),
          reload: tryWrap(reload)
      };
  }
  const map = new Map();
  function createRecord(id) {
      if (map.has(id)) {
          return false;
      }
      map.set(id, new Set());
      return true;
  }
  function rerender(id, newRender) {
      const record = map.get(id);
      if (!record)
          return;
      // Array.from creates a snapshot which avoids the set being mutated during
      // updates
      Array.from(record).forEach(instance => {
          if (newRender) {
              instance.render = newRender;
          }
          instance.renderCache = [];
          instance.update();
      });
  }
  function reload(id, newComp) {
      const record = map.get(id);
      if (!record)
          return;
      // Array.from creates a snapshot which avoids the set being mutated during
      // updates
      Array.from(record).forEach(instance => {
          const comp = instance.type;
          if (!hmrDirtyComponents.has(comp)) {
              // 1. Update existing comp definition to match new one
              extend(comp, newComp);
              for (const key in comp) {
                  if (!(key in newComp)) {
                      delete comp[key];
                  }
              }
              // 2. Mark component dirty. This forces the renderer to replace the component
              // on patch.
              hmrDirtyComponents.add(comp);
              // 3. Make sure to unmark the component after the reload.
              queuePostFlushCb(() => {
                  hmrDirtyComponents.delete(comp);
              });
          }
          if (instance.parent) {
              // 4. Force the parent instance to re-render. This will cause all updated
              // components to be unmounted and re-mounted. Queue the update so that we
              // don't end up forcing the same parent to re-render multiple times.
              queueJob(instance.parent.update);
          }
          else if (instance.appContext.reload) {
              // root instance mounted via createApp() has a reload method
              instance.appContext.reload();
          }
          else if (typeof window !== 'undefined') {
              // root instance inside tree created via raw render(). Force reload.
              window.location.reload();
          }
          else {
              console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
          }
      });
  }
  function tryWrap(fn) {
      return (id, arg) => {
          try {
              return fn(id, arg);
          }
          catch (e) {
              console.error(e);
              console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` +
                  `Full reload required.`);
          }
      };
  }

  // mark the current rendering instance for asset resolution (e.g.
  // resolveComponent, resolveDirective) during render
  let currentRenderingInstance = null;
  function setCurrentRenderingInstance(instance) {
      currentRenderingInstance = instance;
  }
  function markAttrsAccessed() {
  }

  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
      if (suspense && !suspense.isResolved) {
          if (isArray(fn)) {
              suspense.effects.push(...fn);
          }
          else {
              suspense.effects.push(fn);
          }
      }
      else {
          queuePostFlushCb(fn);
      }
  }

  /**
   * Wrap a slot function to memoize current rendering instance
   * @private
   */
  function withCtx(fn, ctx = currentRenderingInstance) {
      if (!ctx)
          return fn;
      return function renderFnWithContext() {
          const owner = currentRenderingInstance;
          setCurrentRenderingInstance(ctx);
          const res = fn.apply(null, arguments);
          setCurrentRenderingInstance(owner);
          return res;
      };
  }

  // SFC scoped style ID management.
  let currentScopeId = null;
  const scopeIdStack = [];
  /**
   * @private
   */
  function pushScopeId(id) {
      scopeIdStack.push((currentScopeId = id));
  }
  /**
   * @private
   */
  function popScopeId() {
      scopeIdStack.pop();
      currentScopeId = scopeIdStack[scopeIdStack.length - 1] || null;
  }
  /**
   * @private
   */
  function withScopeId(id) {
      return ((fn) => withCtx(function () {
          pushScopeId(id);
          const res = fn.apply(this, arguments);
          popScopeId();
          return res;
      }));
  }

  const isTeleport = (type) => type.__isTeleport;
  const NULL_DYNAMIC_COMPONENT = Symbol();

  const Fragment = Symbol((process.env.NODE_ENV !== 'production') ? 'Fragment' : undefined);
  const Text = Symbol((process.env.NODE_ENV !== 'production') ? 'Text' : undefined);
  const Comment = Symbol((process.env.NODE_ENV !== 'production') ? 'Comment' : undefined);
  const Static = Symbol((process.env.NODE_ENV !== 'production') ? 'Static' : undefined);
  // Since v-if and v-for are the two possible ways node structure can dynamically
  // change, once we consider v-if branches and each v-for fragment a block, we
  // can divide a template into nested blocks, and within each block the node
  // structure would be stable. This allows us to skip most children diffing
  // and only worry about the dynamic nodes (indicated by patch flags).
  const blockStack = [];
  let currentBlock = null;
  /**
   * Open a block.
   * This must be called before `createBlock`. It cannot be part of `createBlock`
   * because the children of the block are evaluated before `createBlock` itself
   * is called. The generated code typically looks like this:
   *
   * ```js
   * function render() {
   *   return (openBlock(),createBlock('div', null, [...]))
   * }
   * ```
   * disableTracking is true when creating a v-for fragment block, since a v-for
   * fragment always diffs its children.
   *
   * @private
   */
  function openBlock(disableTracking = false) {
      blockStack.push((currentBlock = disableTracking ? null : []));
  }
  /**
   * Create a block root vnode. Takes the same exact arguments as `createVNode`.
   * A block root keeps track of dynamic nodes within the block in the
   * `dynamicChildren` array.
   *
   * @private
   */
  function createBlock(type, props, children, patchFlag, dynamicProps) {
      const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true /* isBlock: prevent a block from tracking itself */);
      // save current block children on the block vnode
      vnode.dynamicChildren = currentBlock || EMPTY_ARR;
      // close block
      blockStack.pop();
      currentBlock = blockStack[blockStack.length - 1] || null;
      // a block is always going to be patched, so track it as a child of its
      // parent block
      if (currentBlock) {
          currentBlock.push(vnode);
      }
      return vnode;
  }
  function isVNode(value) {
      return value ? value.__v_isVNode === true : false;
  }
  const createVNodeWithArgsTransform = (...args) => {
      return _createVNode(...( args));
  };
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({ ref }) => {
      return (ref != null
          ? isArray(ref)
              ? ref
              : [currentRenderingInstance, ref]
          : null);
  };
  const createVNode = ((process.env.NODE_ENV !== 'production')
      ? createVNodeWithArgsTransform
      : _createVNode);
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
      if (!type || type === NULL_DYNAMIC_COMPONENT) {
          if ((process.env.NODE_ENV !== 'production') && !type) {
              warn(`Invalid vnode type when creating vnode: ${type}.`);
          }
          type = Comment;
      }
      if (isVNode(type)) {
          return cloneVNode(type, props, children);
      }
      // class component normalization.
      if (isFunction(type) && '__vccOpts' in type) {
          type = type.__vccOpts;
      }
      // class & style normalization.
      if (props) {
          // for reactive or proxy objects, we need to clone it to enable mutation.
          if (isProxy(props) || InternalObjectKey in props) {
              props = extend({}, props);
          }
          let { class: klass, style } = props;
          if (klass && !isString(klass)) {
              props.class = normalizeClass(klass);
          }
          if (isObject(style)) {
              // reactive state objects need to be cloned since they are likely to be
              // mutated
              if (isProxy(style) && !isArray(style)) {
                  style = extend({}, style);
              }
              props.style = normalizeStyle(style);
          }
      }
      // encode the vnode type information into a bitmap
      const shapeFlag = isString(type)
          ? 1 /* ELEMENT */
          :  isSuspense(type)
              ? 128 /* SUSPENSE */
              : isTeleport(type)
                  ? 64 /* TELEPORT */
                  : isObject(type)
                      ? 4 /* STATEFUL_COMPONENT */
                      : isFunction(type)
                          ? 2 /* FUNCTIONAL_COMPONENT */
                          : 0;
      if ((process.env.NODE_ENV !== 'production') && shapeFlag & 4 /* STATEFUL_COMPONENT */ && isProxy(type)) {
          type = toRaw(type);
          warn(`Vue received a Component which was made a reactive object. This can ` +
              `lead to unnecessary performance overhead, and should be avoided by ` +
              `marking the component with \`markRaw\` or using \`shallowRef\` ` +
              `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
      }
      const vnode = {
          __v_isVNode: true,
          __v_skip: true,
          type,
          props,
          key: props && normalizeKey(props),
          ref: props && normalizeRef(props),
          scopeId: currentScopeId,
          children: null,
          component: null,
          suspense: null,
          dirs: null,
          transition: null,
          el: null,
          anchor: null,
          target: null,
          targetAnchor: null,
          staticCount: 0,
          shapeFlag,
          patchFlag,
          dynamicProps,
          dynamicChildren: null,
          appContext: null
      };
      normalizeChildren(vnode, children);
      // presence of a patch flag indicates this node needs patching on updates.
      // component nodes also should always be patched, because even if the
      // component doesn't need to update, it needs to persist the instance on to
      // the next vnode so that it can be properly unmounted later.
      if (
          !isBlockNode &&
          currentBlock &&
          // the EVENTS flag is only for hydration and if it is the only flag, the
          // vnode should not be considered dynamic due to handler caching.
          patchFlag !== 32 /* HYDRATE_EVENTS */ &&
          (patchFlag > 0 ||
              shapeFlag & 128 /* SUSPENSE */ ||
              shapeFlag & 64 /* TELEPORT */ ||
              shapeFlag & 4 /* STATEFUL_COMPONENT */ ||
              shapeFlag & 2 /* FUNCTIONAL_COMPONENT */)) {
          currentBlock.push(vnode);
      }
      return vnode;
  }
  function cloneVNode(vnode, extraProps, children) {
      const props = extraProps
          ? vnode.props
              ? mergeProps(vnode.props, extraProps)
              : extend({}, extraProps)
          : vnode.props;
      // This is intentionally NOT using spread or extend to avoid the runtime
      // key enumeration cost.
      const cloned = {
          __v_isVNode: true,
          __v_skip: true,
          type: vnode.type,
          props,
          key: props && normalizeKey(props),
          ref: extraProps && extraProps.ref ? normalizeRef(extraProps) : vnode.ref,
          scopeId: vnode.scopeId,
          children: vnode.children,
          target: vnode.target,
          targetAnchor: vnode.targetAnchor,
          staticCount: vnode.staticCount,
          shapeFlag: vnode.shapeFlag,
          // if the vnode is cloned with extra props, we can no longer assume its
          // existing patch flag to be reliable and need to bail out of optimized mode.
          // however we don't want block nodes to de-opt their children, so if the
          // vnode is a block node, we only add the FULL_PROPS flag to it.
          patchFlag: extraProps
              ? vnode.dynamicChildren
                  ? vnode.patchFlag | 16 /* FULL_PROPS */
                  : -2 /* BAIL */
              : vnode.patchFlag,
          dynamicProps: vnode.dynamicProps,
          dynamicChildren: vnode.dynamicChildren,
          appContext: vnode.appContext,
          dirs: vnode.dirs,
          transition: vnode.transition,
          // These should technically only be non-null on mounted VNodes. However,
          // they *should* be copied for kept-alive vnodes. So we just always copy
          // them since them being non-null during a mount doesn't affect the logic as
          // they will simply be overwritten.
          component: vnode.component,
          suspense: vnode.suspense,
          el: vnode.el,
          anchor: vnode.anchor
      };
      if (children) {
          normalizeChildren(cloned, children);
      }
      return cloned;
  }
  /**
   * @private
   */
  function createTextVNode(text = ' ', flag = 0) {
      return createVNode(Text, null, text, flag);
  }
  function normalizeChildren(vnode, children) {
      let type = 0;
      const { shapeFlag } = vnode;
      if (children == null) {
          children = null;
      }
      else if (isArray(children)) {
          type = 16 /* ARRAY_CHILDREN */;
      }
      else if (typeof children === 'object') {
          // Normalize slot to plain children
          if ((shapeFlag & 1 /* ELEMENT */ || shapeFlag & 64 /* TELEPORT */) &&
              children.default) {
              normalizeChildren(vnode, children.default());
              return;
          }
          else {
              type = 32 /* SLOTS_CHILDREN */;
              if (!children._ && !(InternalObjectKey in children)) {
                  children._ctx = currentRenderingInstance;
              }
          }
      }
      else if (isFunction(children)) {
          children = { default: children, _ctx: currentRenderingInstance };
          type = 32 /* SLOTS_CHILDREN */;
      }
      else {
          children = String(children);
          // force teleport children to array so it can be moved around
          if (shapeFlag & 64 /* TELEPORT */) {
              type = 16 /* ARRAY_CHILDREN */;
              children = [createTextVNode(children)];
          }
          else {
              type = 8 /* TEXT_CHILDREN */;
          }
      }
      vnode.children = children;
      vnode.shapeFlag |= type;
  }
  const handlersRE = /^on|^vnode/;
  function mergeProps(...args) {
      const ret = extend({}, args[0]);
      for (let i = 1; i < args.length; i++) {
          const toMerge = args[i];
          for (const key in toMerge) {
              if (key === 'class') {
                  if (ret.class !== toMerge.class) {
                      ret.class = normalizeClass([ret.class, toMerge.class]);
                  }
              }
              else if (key === 'style') {
                  ret.style = normalizeStyle([ret.style, toMerge.style]);
              }
              else if (handlersRE.test(key)) {
                  // on*, vnode*
                  const existing = ret[key];
                  const incoming = toMerge[key];
                  if (existing !== incoming) {
                      ret[key] = existing
                          ? [].concat(existing, toMerge[key])
                          : incoming;
                  }
              }
              else {
                  ret[key] = toMerge[key];
              }
          }
      }
      return ret;
  }
  function normalizePropsOptions(comp) {
      if (comp.__props) {
          return comp.__props;
      }
      const raw = comp.props;
      const normalized = {};
      const needCastKeys = [];
      // apply mixin/extends props
      let hasExtends = false;
      if ( !isFunction(comp)) {
          const extendProps = (raw) => {
              const [props, keys] = normalizePropsOptions(raw);
              extend(normalized, props);
              if (keys)
                  needCastKeys.push(...keys);
          };
          if (comp.extends) {
              hasExtends = true;
              extendProps(comp.extends);
          }
          if (comp.mixins) {
              hasExtends = true;
              comp.mixins.forEach(extendProps);
          }
      }
      if (!raw && !hasExtends) {
          return (comp.__props = EMPTY_ARR);
      }
      if (isArray(raw)) {
          for (let i = 0; i < raw.length; i++) {
              if ((process.env.NODE_ENV !== 'production') && !isString(raw[i])) {
                  warn(`props must be strings when using array syntax.`, raw[i]);
              }
              const normalizedKey = camelize(raw[i]);
              if (validatePropName(normalizedKey)) {
                  normalized[normalizedKey] = EMPTY_OBJ;
              }
          }
      }
      else if (raw) {
          if ((process.env.NODE_ENV !== 'production') && !isObject(raw)) {
              warn(`invalid props options`, raw);
          }
          for (const key in raw) {
              const normalizedKey = camelize(key);
              if (validatePropName(normalizedKey)) {
                  const opt = raw[key];
                  const prop = (normalized[normalizedKey] =
                      isArray(opt) || isFunction(opt) ? { type: opt } : opt);
                  if (prop) {
                      const booleanIndex = getTypeIndex(Boolean, prop.type);
                      const stringIndex = getTypeIndex(String, prop.type);
                      prop[0 /* shouldCast */] = booleanIndex > -1;
                      prop[1 /* shouldCastTrue */] =
                          stringIndex < 0 || booleanIndex < stringIndex;
                      // if the prop needs boolean casting or default value
                      if (booleanIndex > -1 || hasOwn(prop, 'default')) {
                          needCastKeys.push(normalizedKey);
                      }
                  }
              }
          }
      }
      const normalizedEntry = [normalized, needCastKeys];
      comp.__props = normalizedEntry;
      return normalizedEntry;
  }
  // use function string name to check type constructors
  // so that it works across vms / iframes.
  function getType(ctor) {
      const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
      return match ? match[1] : '';
  }
  function isSameType(a, b) {
      return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
      if (isArray(expectedTypes)) {
          for (let i = 0, len = expectedTypes.length; i < len; i++) {
              if (isSameType(expectedTypes[i], type)) {
                  return i;
              }
          }
      }
      else if (isFunction(expectedTypes)) {
          return isSameType(expectedTypes, type) ? 0 : -1;
      }
      return -1;
  }
  /**
   * dev only
   */
  function validatePropName(key) {
      if (key[0] !== '$') {
          return true;
      }
      else if ((process.env.NODE_ENV !== 'production')) {
          warn(`Invalid prop name: "${key}" is a reserved property.`);
      }
      return false;
  }
  const queuePostRenderEffect =  queueEffectWithSuspense
      ;

  function injectHook(type, hook, target = currentInstance, prepend = false) {
      if (target) {
          const hooks = target[type] || (target[type] = []);
          // cache the error handling wrapper for injected hooks so the same hook
          // can be properly deduped by the scheduler. "__weh" stands for "with error
          // handling".
          const wrappedHook = hook.__weh ||
              (hook.__weh = (...args) => {
                  if (target.isUnmounted) {
                      return;
                  }
                  // disable tracking inside all lifecycle hooks
                  // since they can potentially be called inside effects.
                  pauseTracking();
                  // Set currentInstance during hook invocation.
                  // This assumes the hook does not synchronously trigger other hooks, which
                  // can only be false when the user does something really funky.
                  setCurrentInstance(target);
                  const res = callWithAsyncErrorHandling(hook, target, type, args);
                  setCurrentInstance(null);
                  resetTracking();
                  return res;
              });
          if (prepend) {
              hooks.unshift(wrappedHook);
          }
          else {
              hooks.push(wrappedHook);
          }
      }
      else if ((process.env.NODE_ENV !== 'production')) {
          const apiName = `on${capitalize(ErrorTypeStrings[type].replace(/ hook$/, ''))}`;
          warn(`${apiName} is called when there is no active component instance to be ` +
              `associated with. ` +
              `Lifecycle injection APIs can only be used during execution of setup().` +
              ( ` If you are using async setup(), make sure to register lifecycle ` +
                      `hooks before the first await statement.`
                  ));
      }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => 
  // post-create lifecycle registrations are noops during SSR
   injectHook(lifecycle, hook, target);
  const onBeforeUnmount = createHook("bum" /* BEFORE_UNMOUNT */);

  const invoke = (fn) => fn();
  // initial value for watchers to trigger on undefined initial values
  const INITIAL_WATCHER_VALUE = {};
  // implementation
  function watch(source, cb, options) {
      if ((process.env.NODE_ENV !== 'production') && !isFunction(cb)) {
          warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
              `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
              `supports \`watch(source, cb, options?) signature.`);
      }
      return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
      if ((process.env.NODE_ENV !== 'production') && !cb) {
          if (immediate !== undefined) {
              warn(`watch() "immediate" option is only respected when using the ` +
                  `watch(source, callback, options?) signature.`);
          }
          if (deep !== undefined) {
              warn(`watch() "deep" option is only respected when using the ` +
                  `watch(source, callback, options?) signature.`);
          }
      }
      const warnInvalidSource = (s) => {
          warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` +
              `a reactive object, or an array of these types.`);
      };
      const instance = currentInstance;
      let getter;
      if (isArray(source)) {
          getter = () => source.map(s => {
              if (isRef(s)) {
                  return s.value;
              }
              else if (isReactive(s)) {
                  return traverse(s);
              }
              else if (isFunction(s)) {
                  return callWithErrorHandling(s, instance, 2 /* WATCH_GETTER */);
              }
              else {
                  (process.env.NODE_ENV !== 'production') && warnInvalidSource(s);
              }
          });
      }
      else if (isRef(source)) {
          getter = () => source.value;
      }
      else if (isReactive(source)) {
          getter = () => source;
          deep = true;
      }
      else if (isFunction(source)) {
          if (cb) {
              // getter with cb
              getter = () => callWithErrorHandling(source, instance, 2 /* WATCH_GETTER */);
          }
          else {
              // no cb -> simple effect
              getter = () => {
                  if (instance && instance.isUnmounted) {
                      return;
                  }
                  if (cleanup) {
                      cleanup();
                  }
                  return callWithErrorHandling(source, instance, 3 /* WATCH_CALLBACK */, [onInvalidate]);
              };
          }
      }
      else {
          getter = NOOP;
          (process.env.NODE_ENV !== 'production') && warnInvalidSource(source);
      }
      if (cb && deep) {
          const baseGetter = getter;
          getter = () => traverse(baseGetter());
      }
      let cleanup;
      const onInvalidate = (fn) => {
          cleanup = runner.options.onStop = () => {
              callWithErrorHandling(fn, instance, 4 /* WATCH_CLEANUP */);
          };
      };
      let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
      const applyCb = cb
          ? () => {
              if (instance && instance.isUnmounted) {
                  return;
              }
              const newValue = runner();
              if (deep || hasChanged(newValue, oldValue)) {
                  // cleanup before running cb again
                  if (cleanup) {
                      cleanup();
                  }
                  callWithAsyncErrorHandling(cb, instance, 3 /* WATCH_CALLBACK */, [
                      newValue,
                      // pass undefined as the old value when it's changed for the first time
                      oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                      onInvalidate
                  ]);
                  oldValue = newValue;
              }
          }
          : void 0;
      let scheduler;
      if (flush === 'sync') {
          scheduler = invoke;
      }
      else if (flush === 'pre') {
          scheduler = job => {
              if (!instance || instance.isMounted) {
                  queueJob(job);
              }
              else {
                  // with 'pre' option, the first call must happen before
                  // the component is mounted so it is called synchronously.
                  job();
              }
          };
      }
      else {
          scheduler = job => queuePostRenderEffect(job, instance && instance.suspense);
      }
      const runner = effect(getter, {
          lazy: true,
          // so it runs before component update effects in pre flush mode
          computed: true,
          onTrack,
          onTrigger,
          scheduler: applyCb ? () => scheduler(applyCb) : scheduler
      });
      recordInstanceBoundEffect(runner);
      // initial run
      if (applyCb) {
          if (immediate) {
              applyCb();
          }
          else {
              oldValue = runner();
          }
      }
      else {
          runner();
      }
      return () => {
          stop(runner);
          if (instance) {
              remove(instance.effects, runner);
          }
      };
  }
  // this.$watch
  function instanceWatch(source, cb, options) {
      const publicThis = this.proxy;
      const getter = isString(source)
          ? () => publicThis[source]
          : source.bind(publicThis);
      const stop = watch(getter, cb.bind(publicThis), options);
      onBeforeUnmount(stop, this);
      return stop;
  }
  function traverse(value, seen = new Set()) {
      if (!isObject(value) || seen.has(value)) {
          return value;
      }
      seen.add(value);
      if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              traverse(value[i], seen);
          }
      }
      else if (value instanceof Map) {
          value.forEach((v, key) => {
              // to register mutation dep for existing keys
              traverse(value.get(key), seen);
          });
      }
      else if (value instanceof Set) {
          value.forEach(v => {
              traverse(v, seen);
          });
      }
      else {
          for (const key in value) {
              traverse(value[key], seen);
          }
      }
      return value;
  }
  function resolveMergedOptions(instance) {
      const raw = instance.type;
      const { __merged, mixins, extends: extendsOptions } = raw;
      if (__merged)
          return __merged;
      const globalMixins = instance.appContext.mixins;
      if (!globalMixins.length && !mixins && !extendsOptions)
          return raw;
      const options = {};
      globalMixins.forEach(m => mergeOptions(options, m, instance));
      extendsOptions && mergeOptions(options, extendsOptions, instance);
      mixins && mixins.forEach(m => mergeOptions(options, m, instance));
      mergeOptions(options, raw, instance);
      return (raw.__merged = options);
  }
  function mergeOptions(to, from, instance) {
      const strats = instance.appContext.config.optionMergeStrategies;
      for (const key in from) {
          if (strats && hasOwn(strats, key)) {
              to[key] = strats[key](to[key], from[key], instance.proxy, key);
          }
          else if (!hasOwn(to, key)) {
              to[key] = from[key];
          }
      }
  }

  const publicPropertiesMap = extend(Object.create(null), {
      $: i => i,
      $el: i => i.vnode.el,
      $data: i => i.data,
      $props: i => ((process.env.NODE_ENV !== 'production') ? shallowReadonly(i.props) : i.props),
      $attrs: i => ((process.env.NODE_ENV !== 'production') ? shallowReadonly(i.attrs) : i.attrs),
      $slots: i => ((process.env.NODE_ENV !== 'production') ? shallowReadonly(i.slots) : i.slots),
      $refs: i => ((process.env.NODE_ENV !== 'production') ? shallowReadonly(i.refs) : i.refs),
      $parent: i => i.parent && i.parent.proxy,
      $root: i => i.root && i.root.proxy,
      $emit: i => i.emit,
      $options: i => ( resolveMergedOptions(i) ),
      $forceUpdate: i => () => queueJob(i.update),
      $nextTick: () => nextTick,
      $watch:  i => instanceWatch.bind(i) 
  });
  const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
          const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
          // let @vue/reatvitiy know it should never observe Vue public instances.
          if (key === "__v_skip" /* SKIP */) {
              return true;
          }
          // data / props / ctx
          // This getter gets called for every property access on the render context
          // during render and is a major hotspot. The most expensive part of this
          // is the multiple hasOwn() calls. It's much faster to do a simple property
          // access on a plain object, so we use an accessCache object (with null
          // prototype) to memoize what access type a key corresponds to.
          let normalizedProps;
          if (key[0] !== '$') {
              const n = accessCache[key];
              if (n !== undefined) {
                  switch (n) {
                      case 0 /* SETUP */:
                          return setupState[key];
                      case 1 /* DATA */:
                          return data[key];
                      case 3 /* CONTEXT */:
                          return ctx[key];
                      case 2 /* PROPS */:
                          return props[key];
                      // default: just fallthrough
                  }
              }
              else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
                  accessCache[key] = 0 /* SETUP */;
                  return setupState[key];
              }
              else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
                  accessCache[key] = 1 /* DATA */;
                  return data[key];
              }
              else if (
              // only cache other properties when instance has declared (thus stable)
              // props
              (normalizedProps = normalizePropsOptions(type)[0]) &&
                  hasOwn(normalizedProps, key)) {
                  accessCache[key] = 2 /* PROPS */;
                  return props[key];
              }
              else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
                  accessCache[key] = 3 /* CONTEXT */;
                  return ctx[key];
              }
              else {
                  accessCache[key] = 4 /* OTHER */;
              }
          }
          const publicGetter = publicPropertiesMap[key];
          let cssModule, globalProperties;
          // public $xxx properties
          if (publicGetter) {
              if (key === '$attrs') {
                  track(instance, "get" /* GET */, key);
                  (process.env.NODE_ENV !== 'production') && markAttrsAccessed();
              }
              return publicGetter(instance);
          }
          else if (
          // css module (injected by vue-loader)
          (cssModule = type.__cssModules) &&
              (cssModule = cssModule[key])) {
              return cssModule;
          }
          else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
              // user may set custom properties to `this` that start with `$`
              accessCache[key] = 3 /* CONTEXT */;
              return ctx[key];
          }
          else if (
          // global properties
          ((globalProperties = appContext.config.globalProperties),
              hasOwn(globalProperties, key))) {
              return globalProperties[key];
          }
          else if ((process.env.NODE_ENV !== 'production') &&
              currentRenderingInstance &&
              // #1091 avoid internal isRef/isVNode checks on component instance leading
              // to infinite warning loop
              key.indexOf('__v') !== 0) {
              if (data !== EMPTY_OBJ && key[0] === '$' && hasOwn(data, key)) {
                  warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved ` +
                      `character and is not proxied on the render context.`);
              }
              else {
                  warn(`Property ${JSON.stringify(key)} was accessed during render ` +
                      `but is not defined on instance.`);
              }
          }
      },
      set({ _: instance }, key, value) {
          const { data, setupState, ctx } = instance;
          if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
              setupState[key] = value;
          }
          else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
              data[key] = value;
          }
          else if (key in instance.props) {
              (process.env.NODE_ENV !== 'production') &&
                  warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
              return false;
          }
          if (key[0] === '$' && key.slice(1) in instance) {
              (process.env.NODE_ENV !== 'production') &&
                  warn(`Attempting to mutate public property "${key}". ` +
                      `Properties starting with $ are reserved and readonly.`, instance);
              return false;
          }
          else {
              if ((process.env.NODE_ENV !== 'production') && key in instance.appContext.config.globalProperties) {
                  Object.defineProperty(ctx, key, {
                      enumerable: true,
                      configurable: true,
                      value
                  });
              }
              else {
                  ctx[key] = value;
              }
          }
          return true;
      },
      has({ _: { data, setupState, accessCache, ctx, type, appContext } }, key) {
          let normalizedProps;
          return (accessCache[key] !== undefined ||
              (data !== EMPTY_OBJ && hasOwn(data, key)) ||
              (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) ||
              ((normalizedProps = normalizePropsOptions(type)[0]) &&
                  hasOwn(normalizedProps, key)) ||
              hasOwn(ctx, key) ||
              hasOwn(publicPropertiesMap, key) ||
              hasOwn(appContext.config.globalProperties, key));
      }
  };
  if ((process.env.NODE_ENV !== 'production') && !false) {
      PublicInstanceProxyHandlers.ownKeys = (target) => {
          warn(`Avoid app logic that relies on enumerating keys on a component instance. ` +
              `The keys will be empty in production mode to avoid performance overhead.`);
          return Reflect.ownKeys(target);
      };
  }
  const RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
      get(target, key) {
          // fast path for unscopables when using `with` block
          if (key === Symbol.unscopables) {
              return;
          }
          return PublicInstanceProxyHandlers.get(target, key, target);
      },
      has(_, key) {
          const has = key[0] !== '_' && !isGloballyWhitelisted(key);
          if ((process.env.NODE_ENV !== 'production') && !has && PublicInstanceProxyHandlers.has(_, key)) {
              warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
          }
          return has;
      }
  });
  let currentInstance = null;
  const setCurrentInstance = (instance) => {
      currentInstance = instance;
  };
  // record effects created during a component's setup() so that they can be
  // stopped when the component unmounts
  function recordInstanceBoundEffect(effect) {
      if (currentInstance) {
          (currentInstance.effects || (currentInstance.effects = [])).push(effect);
      }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
  function formatComponentName(instance, Component, isRoot = false) {
      let name = isFunction(Component)
          ? Component.displayName || Component.name
          : Component.name;
      if (!name && Component.__file) {
          const match = Component.__file.match(/([^/\\]+)\.vue$/);
          if (match) {
              name = match[1];
          }
      }
      if (!name && instance && instance.parent) {
          // try to infer the name based on local resolution
          const registry = instance.parent.components;
          for (const key in registry) {
              if (registry[key] === Component) {
                  name = key;
                  break;
              }
          }
      }
      return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }

  const ssrContextKey = Symbol((process.env.NODE_ENV !== 'production') ? `ssrContext` : ``);

  const _withId = /*#__PURE__*/withScopeId("data-v-b329ee4c");

  pushScopeId("data-v-b329ee4c");
  const _hoisted_1 = {
    class: "resize-observer",
    tabindex: "-1"
  };
  popScopeId();

  const render = /*#__PURE__*/_withId(function render(_ctx, _cache) {
    return (openBlock(), createBlock("div", _hoisted_1))
  });

  script.render = render;
  script.__scopeId = "data-v-b329ee4c";
  script.__file = "src/components/ResizeObserver.vue";

  function install(Vue) {
    Vue.component('resize-observer', script);
    Vue.component('ResizeObserver', script);
  }

  var plugin = {
    // eslint-disable-next-line no-undef
    version: "0.5.0",
    install: install
  };

  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  function _typeof$1(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof$1 = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof$1 = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof$1(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function processOptions(value) {
    var options;

    if (typeof value === 'function') {
      // Simple options (callback-only)
      options = {
        callback: value
      };
    } else {
      // Options object
      options = value;
    }

    return options;
  }
  function throttle(callback, delay) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var timeout;
    var lastState;
    var currentArgs;

    var throttled = function throttled(state) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      currentArgs = args;
      if (timeout && state === lastState) return;
      var leading = options.leading;

      if (typeof leading === 'function') {
        leading = leading(state, lastState);
      }

      if ((!timeout || state !== lastState) && leading) {
        callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
      }

      lastState = state;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        callback.apply(void 0, [state].concat(_toConsumableArray(currentArgs)));
        timeout = 0;
      }, delay);
    };

    throttled._clear = function () {
      clearTimeout(timeout);
      timeout = null;
    };

    return throttled;
  }
  function deepEqual(val1, val2) {
    if (val1 === val2) return true;

    if (_typeof$1(val1) === 'object') {
      for (var key in val1) {
        if (!deepEqual(val1[key], val2[key])) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  var VisibilityState =
  /*#__PURE__*/
  function () {
    function VisibilityState(el, options, vnode) {
      _classCallCheck(this, VisibilityState);

      this.el = el;
      this.observer = null;
      this.frozen = false;
      this.createObserver(options, vnode);
    }

    _createClass(VisibilityState, [{
      key: "createObserver",
      value: function createObserver(options, vnode) {
        var _this = this;

        if (this.observer) {
          this.destroyObserver();
        }

        if (this.frozen) return;
        this.options = processOptions(options);

        this.callback = function (result, entry) {
          _this.options.callback(result, entry);

          if (result && _this.options.once) {
            _this.frozen = true;

            _this.destroyObserver();
          }
        }; // Throttle


        if (this.callback && this.options.throttle) {
          var _ref = this.options.throttleOptions || {},
              _leading = _ref.leading;

          this.callback = throttle(this.callback, this.options.throttle, {
            leading: function leading(state) {
              return _leading === 'both' || _leading === 'visible' && state || _leading === 'hidden' && !state;
            }
          });
        }

        this.oldResult = undefined;
        this.observer = new IntersectionObserver(function (entries) {
          var entry = entries[0];

          if (entries.length > 1) {
            var intersectingEntry = entries.find(function (e) {
              return e.isIntersecting;
            });

            if (intersectingEntry) {
              entry = intersectingEntry;
            }
          }

          if (_this.callback) {
            // Use isIntersecting if possible because browsers can report isIntersecting as true, but intersectionRatio as 0, when something very slowly enters the viewport.
            var result = entry.isIntersecting && entry.intersectionRatio >= _this.threshold;
            if (result === _this.oldResult) return;
            _this.oldResult = result;

            _this.callback(result, entry);
          }
        }, this.options.intersection); // Wait for the element to be in document

        vnode.context.$nextTick(function () {
          if (_this.observer) {
            _this.observer.observe(_this.el);
          }
        });
      }
    }, {
      key: "destroyObserver",
      value: function destroyObserver() {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        } // Cancel throttled call


        if (this.callback && this.callback._clear) {
          this.callback._clear();

          this.callback = null;
        }
      }
    }, {
      key: "threshold",
      get: function get() {
        return this.options.intersection && this.options.intersection.threshold || 0;
      }
    }]);

    return VisibilityState;
  }();

  function bind(el, _ref2, vnode) {
    var value = _ref2.value;
    if (!value) return;

    if (typeof IntersectionObserver === 'undefined') {
      console.warn('[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill');
    } else {
      var state = new VisibilityState(el, value, vnode);
      el._vue_visibilityState = state;
    }
  }

  function update(el, _ref3, vnode) {
    var value = _ref3.value,
        oldValue = _ref3.oldValue;
    if (deepEqual(value, oldValue)) return;
    var state = el._vue_visibilityState;

    if (!value) {
      unbind(el);
      return;
    }

    if (state) {
      state.createObserver(value, vnode);
    } else {
      bind(el, {
        value: value
      }, vnode);
    }
  }

  function unbind(el) {
    var state = el._vue_visibilityState;

    if (state) {
      state.destroyObserver();
      delete el._vue_visibilityState;
    }
  }

  var ObserveVisibility = {
    bind: bind,
    update: update,
    unbind: unbind
  };

  function install$1(Vue) {
    Vue.directive('observe-visibility', ObserveVisibility);
    /* -- Add more components here -- */
  }
  /* -- Plugin definition & Auto-install -- */

  /* You shouldn't have to modify the code below */
  // Plugin

  var plugin$1 = {
    // eslint-disable-next-line no-undef
    version: "0.4.6",
    install: install$1
  };

  var GlobalVue$1 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$1 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$1 = global.Vue;
  }

  if (GlobalVue$1) {
    GlobalVue$1.use(plugin$1);
  }

  var regex = /(auto|scroll)/;

  var parents = function parents(node, ps) {
    if (node.parentNode === null) {
      return ps;
    }

    return parents(node.parentNode, ps.concat([node]));
  };

  var style = function style(node, prop) {
    return getComputedStyle(node, null).getPropertyValue(prop);
  };

  var overflow = function overflow(node) {
    return style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x');
  };

  var scroll = function scroll(node) {
    return regex.test(overflow(node));
  };

  var scrollParent = function scrollParent(node) {
    if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
      return;
    }

    var ps = parents(node.parentNode, []);

    for (var i = 0; i < ps.length; i += 1) {
      if (scroll(ps[i])) {
        return ps[i];
      }
    }

    return document.scrollingElement || document.documentElement;
  };

  var props = {
    items: {
      type: Array,
      required: true
    },
    keyField: {
      type: String,
      default: 'id'
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: function validator(value) {
        return ['vertical', 'horizontal'].includes(value);
      }
    }
  };
  function simpleArray() {
    return this.items.length && _typeof(this.items[0]) !== 'object';
  }

  var supportsPassive = false;

  if (typeof window !== 'undefined') {
    supportsPassive = false;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function get() {
          supportsPassive = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  var uid$1 = 0;
  var script$1 = {
    name: 'RecycleScroller',
    components: {
      ResizeObserver: script
    },
    directives: {
      ObserveVisibility: ObserveVisibility
    },
    props: _objectSpread2(_objectSpread2({}, props), {}, {
      itemSize: {
        type: Number,
        default: null
      },
      minItemSize: {
        type: [Number, String],
        default: null
      },
      sizeField: {
        type: String,
        default: 'size'
      },
      typeField: {
        type: String,
        default: 'type'
      },
      buffer: {
        type: Number,
        default: 200
      },
      pageMode: {
        type: Boolean,
        default: false
      },
      prerender: {
        type: Number,
        default: 0
      },
      emitUpdate: {
        type: Boolean,
        default: false
      }
    }),
    data: function data() {
      return {
        pool: [],
        totalSize: 0,
        ready: false,
        hoverKey: null
      };
    },
    computed: {
      sizes: function sizes() {
        if (this.itemSize === null) {
          var sizes = {
            '-1': {
              accumulator: 0
            }
          };
          var items = this.items;
          var field = this.sizeField;
          var minItemSize = this.minItemSize;
          var computedMinSize = 10000;
          var accumulator = 0;
          var current;

          for (var i = 0, l = items.length; i < l; i++) {
            current = items[i][field] || minItemSize;

            if (current < computedMinSize) {
              computedMinSize = current;
            }

            accumulator += current;
            sizes[i] = {
              accumulator: accumulator,
              size: current
            };
          } // eslint-disable-next-line


          this.$_computedMinItemSize = computedMinSize;
          return sizes;
        }

        return [];
      },
      simpleArray: simpleArray
    },
    watch: {
      items: function items() {
        this.updateVisibleItems(true);
      },
      pageMode: function pageMode() {
        this.applyPageMode();
        this.updateVisibleItems(false);
      },
      sizes: {
        handler: function handler() {
          this.updateVisibleItems(false);
        },
        deep: true
      }
    },
    created: function created() {
      this.$_startIndex = 0;
      this.$_endIndex = 0;
      this.$_views = new Map();
      this.$_unusedViews = new Map();
      this.$_scrollDirty = false;
      this.$_lastUpdateScrollPosition = 0; // In SSR mode, we also prerender the same number of item for the first render
      // to avoir mismatch between server and client templates

      if (this.prerender) {
        this.$_prerender = true;
        this.updateVisibleItems(false);
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.applyPageMode();
      this.$nextTick(function () {
        // In SSR mode, render the real number of visible items
        _this.$_prerender = false;

        _this.updateVisibleItems(true);

        _this.ready = true;
      });
    },
    beforeDestroy: function beforeDestroy() {
      this.removeListeners();
    },
    methods: {
      addView: function addView(pool, index, item, key, type) {
        var view = {
          item: item,
          position: 0
        };
        var nonReactive = {
          id: uid$1++,
          index: index,
          used: true,
          key: key,
          type: type
        };
        Object.defineProperty(view, 'nr', {
          configurable: false,
          value: nonReactive
        });
        pool.push(view);
        return view;
      },
      unuseView: function unuseView(view) {
        var fake = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var unusedViews = this.$_unusedViews;
        var type = view.nr.type;
        var unusedPool = unusedViews.get(type);

        if (!unusedPool) {
          unusedPool = [];
          unusedViews.set(type, unusedPool);
        }

        unusedPool.push(view);

        if (!fake) {
          view.nr.used = false;
          view.position = -9999;
          this.$_views.delete(view.nr.key);
        }
      },
      handleResize: function handleResize() {
        this.$emit('resize');
        if (this.ready) this.updateVisibleItems(false);
      },
      handleScroll: function handleScroll(event) {
        var _this2 = this;

        if (!this.$_scrollDirty) {
          this.$_scrollDirty = true;
          requestAnimationFrame(function () {
            _this2.$_scrollDirty = false;

            var _this2$updateVisibleI = _this2.updateVisibleItems(false, true),
                continuous = _this2$updateVisibleI.continuous; // It seems sometimes chrome doesn't fire scroll event :/
            // When non continous scrolling is ending, we force a refresh


            if (!continuous) {
              clearTimeout(_this2.$_refreshTimout);
              _this2.$_refreshTimout = setTimeout(_this2.handleScroll, 100);
            }
          });
        }
      },
      handleVisibilityChange: function handleVisibilityChange(isVisible, entry) {
        var _this3 = this;

        if (this.ready) {
          if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
            this.$emit('visible');
            requestAnimationFrame(function () {
              _this3.updateVisibleItems(false);
            });
          } else {
            this.$emit('hidden');
          }
        }
      },
      updateVisibleItems: function updateVisibleItems(checkItem) {
        var checkPositionDiff = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var itemSize = this.itemSize;
        var minItemSize = this.$_computedMinItemSize;
        var typeField = this.typeField;
        var keyField = this.simpleArray ? null : this.keyField;
        var items = this.items;
        var count = items.length;
        var sizes = this.sizes;
        var views = this.$_views;
        var unusedViews = this.$_unusedViews;
        var pool = this.pool;
        var startIndex, endIndex;
        var totalSize;

        if (!count) {
          startIndex = endIndex = totalSize = 0;
        } else if (this.$_prerender) {
          startIndex = 0;
          endIndex = this.prerender;
          totalSize = null;
        } else {
          var scroll = this.getScroll(); // Skip update if use hasn't scrolled enough

          if (checkPositionDiff) {
            var positionDiff = scroll.start - this.$_lastUpdateScrollPosition;
            if (positionDiff < 0) positionDiff = -positionDiff;

            if (itemSize === null && positionDiff < minItemSize || positionDiff < itemSize) {
              return {
                continuous: true
              };
            }
          }

          this.$_lastUpdateScrollPosition = scroll.start;
          var buffer = this.buffer;
          scroll.start -= buffer;
          scroll.end += buffer; // Variable size mode

          if (itemSize === null) {
            var h;
            var a = 0;
            var b = count - 1;
            var i = ~~(count / 2);
            var oldI; // Searching for startIndex

            do {
              oldI = i;
              h = sizes[i].accumulator;

              if (h < scroll.start) {
                a = i;
              } else if (i < count - 1 && sizes[i + 1].accumulator > scroll.start) {
                b = i;
              }

              i = ~~((a + b) / 2);
            } while (i !== oldI);

            i < 0 && (i = 0);
            startIndex = i; // For container style

            totalSize = sizes[count - 1].accumulator; // Searching for endIndex

            for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll.end; endIndex++) {
            }

            if (endIndex === -1) {
              endIndex = items.length - 1;
            } else {
              endIndex++; // Bounds

              endIndex > count && (endIndex = count);
            }
          } else {
            // Fixed size mode
            startIndex = ~~(scroll.start / itemSize);
            endIndex = Math.ceil(scroll.end / itemSize); // Bounds

            startIndex < 0 && (startIndex = 0);
            endIndex > count && (endIndex = count);
            totalSize = count * itemSize;
          }
        }

        if (endIndex - startIndex > config.itemsLimit) {
          this.itemsLimitError();
        }

        this.totalSize = totalSize;
        var view;
        var continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;

        if (this.$_continuous !== continuous) {
          if (continuous) {
            views.clear();
            unusedViews.clear();

            for (var _i = 0, l = pool.length; _i < l; _i++) {
              view = pool[_i];
              this.unuseView(view);
            }
          }

          this.$_continuous = continuous;
        } else if (continuous) {
          for (var _i2 = 0, _l = pool.length; _i2 < _l; _i2++) {
            view = pool[_i2];

            if (view.nr.used) {
              // Update view item index
              if (checkItem) {
                view.nr.index = items.findIndex(function (item) {
                  return keyField ? item[keyField] === view.item[keyField] : item === view.item;
                });
              } // Check if index is still in visible range


              if (view.nr.index === -1 || view.nr.index < startIndex || view.nr.index >= endIndex) {
                this.unuseView(view);
              }
            }
          }
        }

        var unusedIndex = continuous ? null : new Map();
        var item, type, unusedPool;
        var v;

        for (var _i3 = startIndex; _i3 < endIndex; _i3++) {
          item = items[_i3];
          console.log(item.brand);
          var key = keyField ? item[keyField] : item;

          if (key == null) {
            throw new Error("Key is ".concat(key, " on item (keyField is '").concat(keyField, "')"));
          }

          view = views.get(key);

          if (!itemSize && !sizes[_i3].size) {
            if (view) this.unuseView(view);
            continue;
          } // No view assigned to item


          if (!view) {
            type = item[typeField];
            unusedPool = unusedViews.get(type);

            if (continuous) {
              // Reuse existing view
              if (unusedPool && unusedPool.length) {
                view = unusedPool.pop();
                view.item = item;
                view.nr.used = true;
                view.nr.index = _i3;
                view.nr.key = key;
                view.nr.type = type;
              } else {
                view = this.addView(pool, _i3, item, key, type);
              }
            } else {
              // Use existing view
              // We don't care if they are already used
              // because we are not in continous scrolling
              v = unusedIndex.get(type) || 0;

              if (!unusedPool || v >= unusedPool.length) {
                view = this.addView(pool, _i3, item, key, type);
                this.unuseView(view, true);
                unusedPool = unusedViews.get(type);
              }

              view = unusedPool[v];
              view.item = item;
              view.nr.used = true;
              view.nr.index = _i3;
              view.nr.key = key;
              view.nr.type = type;
              unusedIndex.set(type, v + 1);
              v++;
            }

            views.set(key, view);
          } else {
            view.nr.used = true;
            view.item = item;
          } // Update position


          if (itemSize === null) {
            view.position = sizes[_i3 - 1].accumulator;
          } else {
            view.position = _i3 * itemSize;
          }
        }

        this.$_startIndex = startIndex;
        this.$_endIndex = endIndex;
        if (this.emitUpdate) this.$emit('update', startIndex, endIndex); // After the user has finished scrolling
        // Sort views so text selection is correct

        clearTimeout(this.$_sortTimer);
        this.$_sortTimer = setTimeout(this.sortViews, 300);
        return {
          continuous: continuous
        };
      },
      getListenerTarget: function getListenerTarget() {
        var target = scrollParent(this.$el); // Fix global scroll target for Chrome and Safari

        if (window.document && (target === window.document.documentElement || target === window.document.body)) {
          target = window;
        }

        return target;
      },
      getScroll: function getScroll() {
        var el = this.$el,
            direction = this.direction;
        var isVertical = direction === 'vertical';
        var scrollState;

        if (this.pageMode) {
          var bounds = el.getBoundingClientRect();
          var boundsSize = isVertical ? bounds.height : bounds.width;
          var start = -(isVertical ? bounds.top : bounds.left);
          var size = isVertical ? window.innerHeight : window.innerWidth;

          if (start < 0) {
            size += start;
            start = 0;
          }

          if (start + size > boundsSize) {
            size = boundsSize - start;
          }

          scrollState = {
            start: start,
            end: start + size
          };
        } else if (isVertical) {
          scrollState = {
            start: el.scrollTop,
            end: el.scrollTop + el.clientHeight
          };
        } else {
          scrollState = {
            start: el.scrollLeft,
            end: el.scrollLeft + el.clientWidth
          };
        }

        return scrollState;
      },
      applyPageMode: function applyPageMode() {
        if (this.pageMode) {
          this.addListeners();
        } else {
          this.removeListeners();
        }
      },
      addListeners: function addListeners() {
        this.listenerTarget = this.getListenerTarget();
        this.listenerTarget.addEventListener('scroll', this.handleScroll, supportsPassive ? {
          passive: true
        } : false);
        this.listenerTarget.addEventListener('resize', this.handleResize);
      },
      removeListeners: function removeListeners() {
        if (!this.listenerTarget) {
          return;
        }

        this.listenerTarget.removeEventListener('scroll', this.handleScroll);
        this.listenerTarget.removeEventListener('resize', this.handleResize);
        this.listenerTarget = null;
      },
      scrollToItem: function scrollToItem(index) {
        var scroll;

        if (this.itemSize === null) {
          scroll = index > 0 ? this.sizes[index - 1].accumulator : 0;
        } else {
          scroll = index * this.itemSize;
        }

        this.scrollToPosition(scroll);
      },
      scrollToPosition: function scrollToPosition(position) {
        if (this.direction === 'vertical') {
          this.$el.scrollTop = position;
        } else {
          this.$el.scrollLeft = position;
        }
      },
      itemsLimitError: function itemsLimitError() {
        var _this4 = this;

        setTimeout(function () {
          console.log('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', _this4.$el);
          console.log('Make sure the scroller has a fixed height (or width) and \'overflow-y\' (or \'overflow-x\') set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
        });
        throw new Error('Rendered items limit reached');
      },
      sortViews: function sortViews() {
        this.pool.sort(function (viewA, viewB) {
          return viewA.nr.index - viewB.nr.index;
        });
      }
    }
  };

  const _hoisted_1$1 = {
    key: 0,
    class: "vue-recycle-scroller__slot"
  };
  const _hoisted_2 = {
    key: 0,
    class: "vue-recycle-scroller__slot"
  };

  function render$1(_ctx, _cache) {
    const _component_ResizeObserver = vue.resolveComponent("ResizeObserver");
    const _directive_observe_visibility = vue.resolveDirective("observe-visibility");

    return vue.withDirectives((vue.openBlock(), vue.createBlock("div", {
      class: ["vue-recycle-scroller", {
        ready: _ctx.ready,
        'page-mode': _ctx.pageMode,
        [`direction-${_ctx.direction}`]: true,
      }],
      onScroll: _cache[3] || (_cache[3] = {
        handler: ($event, ...args) => (_ctx.handleScroll($event, ...args)),
        options: { passive: true }
      })
    }, [
      (_ctx.$slots.before)
        ? (vue.openBlock(), vue.createBlock("div", _hoisted_1$1, [
            vue.renderSlot(_ctx.$slots, "before")
          ]))
        : vue.createCommentVNode("v-if", true),
      vue.createVNode("div", {
        ref: "wrapper",
        style: { [_ctx.direction === 'vertical' ? 'minHeight' : 'minWidth']: _ctx.totalSize + 'px' },
        class: "vue-recycle-scroller__item-wrapper"
      }, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList(_ctx.pool, (view) => {
          return (vue.openBlock(), vue.createBlock("div", {
            key: view.nr.id,
            style: _ctx.ready ? { transform: `translate${_ctx.direction === 'vertical' ? 'Y' : 'X'}(${view.position}px)` } : null,
            class: ["vue-recycle-scroller__item-view", { hover: _ctx.hoverKey === view.nr.key }],
            onMouseenter: $event => (_ctx.hoverKey = view.nr.key),
            onMouseleave: _cache[1] || (_cache[1] = $event => (_ctx.hoverKey = null))
          }, [
            vue.renderSlot(_ctx.$slots, "default", {
              item: view.item,
              index: view.nr.index,
              active: view.nr.used
            })
          ], 46 /* CLASS, STYLE, PROPS, HYDRATE_EVENTS */, ["onMouseenter"]))
        }), 128 /* KEYED_FRAGMENT */))
      ], 4 /* STYLE */),
      (_ctx.$slots.after)
        ? (vue.openBlock(), vue.createBlock("div", _hoisted_2, [
            vue.renderSlot(_ctx.$slots, "after")
          ]))
        : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_ResizeObserver, {
        onNotify: _cache[2] || (_cache[2] = ($event, ...args) => (_ctx.handleResize($event, ...args)))
      })
    ], 34 /* CLASS, HYDRATE_EVENTS */)), [
      [_directive_observe_visibility, _ctx.handleVisibilityChange]
    ])
  }

  script$1.render = render$1;
  script$1.__file = "src/components/RecycleScroller.vue";

  var script$2 = {
    name: 'DynamicScroller',
    components: {
      RecycleScroller: script$1
    },
    inheritAttrs: false,
    provide: function provide() {
      if (typeof ResizeObserver !== 'undefined') {
        this.$_resizeObserver = new ResizeObserver(function (entries) {
          var _iterator = _createForOfIteratorHelper(entries),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var entry = _step.value;

              if (entry.target) {
                var event = new CustomEvent('resize', {
                  detail: {
                    contentRect: entry.contentRect
                  }
                });
                entry.target.dispatchEvent(event);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        });
      }

      return {
        vscrollData: this.vscrollData,
        vscrollParent: this,
        vscrollResizeObserver: this.$_resizeObserver
      };
    },
    props: _objectSpread2(_objectSpread2({}, props), {}, {
      minItemSize: {
        type: [Number, String],
        required: true
      }
    }),
    data: function data() {
      return {
        vscrollData: {
          active: true,
          sizes: {},
          validSizes: {},
          keyField: this.keyField,
          simpleArray: false
        }
      };
    },
    computed: {
      simpleArray: simpleArray,
      itemsWithSize: function itemsWithSize() {
        var result = [];
        var items = this.items,
            keyField = this.keyField,
            simpleArray = this.simpleArray;
        var sizes = this.vscrollData.sizes;

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var id = simpleArray ? i : item[keyField];
          var size = sizes[id];

          if (typeof size === 'undefined' && !this.$_undefinedMap[id]) {
            size = 0;
          }

          result.push({
            item: item,
            id: id,
            size: size
          });
        }

        return result;
      },
      listeners: function listeners() {
        var listeners = {};

        for (var key in this.$listeners) {
          if (key !== 'resize' && key !== 'visible') {
            listeners[key] = this.$listeners[key];
          }
        }

        return listeners;
      }
    },
    watch: {
      items: function items() {
        this.forceUpdate(false);
      },
      simpleArray: {
        handler: function handler(value) {
          this.vscrollData.simpleArray = value;
        },
        immediate: true
      },
      direction: function direction(value) {
        this.forceUpdate(true);
      }
    },
    created: function created() {
      this.$_updates = [];
      this.$_undefinedSizes = 0;
      this.$_undefinedMap = {};
    },
    activated: function activated() {
      this.vscrollData.active = true;
    },
    deactivated: function deactivated() {
      this.vscrollData.active = false;
    },
    methods: {
      onScrollerResize: function onScrollerResize() {
        var scroller = this.$refs.scroller;

        if (scroller) {
          this.forceUpdate();
        }

        this.$emit('resize');
      },
      onScrollerVisible: function onScrollerVisible() {
        this.$emit('vscroll:update', {
          force: false
        });
        this.$emit('visible');
      },
      forceUpdate: function forceUpdate() {
        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (clear || this.simpleArray) {
          this.vscrollData.validSizes = {};
        }

        this.$emit('vscroll:update', {
          force: true
        });
      },
      scrollToItem: function scrollToItem(index) {
        var scroller = this.$refs.scroller;
        if (scroller) scroller.scrollToItem(index);
      },
      getItemSize: function getItemSize(item) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        var id = this.simpleArray ? index != null ? index : this.items.indexOf(item) : item[this.keyField];
        return this.vscrollData.sizes[id] || 0;
      },
      scrollToBottom: function scrollToBottom() {
        var _this = this;

        if (this.$_scrollingToBottom) return;
        this.$_scrollingToBottom = true;
        var el = this.$el; // Item is inserted to the DOM

        this.$nextTick(function () {
          el.scrollTop = el.scrollHeight + 5000; // Item sizes are computed

          var cb = function cb() {
            el.scrollTop = el.scrollHeight + 5000;
            requestAnimationFrame(function () {
              el.scrollTop = el.scrollHeight + 5000;

              if (_this.$_undefinedSizes === 0) {
                _this.$_scrollingToBottom = false;
              } else {
                requestAnimationFrame(cb);
              }
            });
          };

          requestAnimationFrame(cb);
        });
      }
    }
  };

  const _hoisted_1$2 = { "slot-scope": "{ item: itemWithSize, index, active }" };
  const _hoisted_2$1 = { slot: "before" };
  const _hoisted_3 = { slot: "after" };

  function render$2(_ctx, _cache) {
    const _component_RecycleScroller = vue.resolveComponent("RecycleScroller");

    return (vue.openBlock(), vue.createBlock(_component_RecycleScroller, vue.mergeProps({
      ref: "scroller",
      items: _ctx.itemsWithSize,
      "min-item-size": _ctx.minItemSize,
      direction: _ctx.direction,
      "key-field": "id"
    }, _ctx.$attrs, {
      onResize: _cache[1] || (_cache[1] = ($event, ...args) => (_ctx.onScrollerResize($event, ...args))),
      onVisible: _cache[2] || (_cache[2] = ($event, ...args) => (_ctx.onScrollerVisible($event, ...args)))
    }, vue.toHandlers(_ctx.listeners)), {
      default: vue.withCtx(() => [
        vue.createVNode("template", _hoisted_1$2, [
          vue.renderSlot(_ctx.$slots, "default", {
            item: _ctx.itemWithSize.item,
            index: _ctx.index,
            active: _ctx.active,
            itemWithSize: _ctx.itemWithSize
          })
        ]),
        vue.createVNode("template", _hoisted_2$1, [
          vue.renderSlot(_ctx.$slots, "before")
        ]),
        vue.createVNode("template", _hoisted_3, [
          vue.renderSlot(_ctx.$slots, "after")
        ])
      ]),
      _: 1
    }, 16 /* FULL_PROPS */, ["items", "min-item-size", "direction"]))
  }

  script$2.render = render$2;
  script$2.__file = "src/components/DynamicScroller.vue";

  var script$3 = {
    name: 'DynamicScrollerItem',
    inject: ['vscrollData', 'vscrollParent', 'vscrollResizeObserver'],
    props: {
      // eslint-disable-next-line vue/require-prop-types
      item: {
        required: true
      },
      watchData: {
        type: Boolean,
        default: false
      },

      /**
       * Indicates if the view is actively used to display an item.
       */
      active: {
        type: Boolean,
        required: true
      },
      index: {
        type: Number,
        default: undefined
      },
      sizeDependencies: {
        type: [Array, Object],
        default: null
      },
      emitResize: {
        type: Boolean,
        default: false
      },
      tag: {
        type: String,
        default: 'div'
      }
    },
    computed: {
      id: function id() {
        return this.vscrollData.simpleArray ? this.index : this.item[this.vscrollData.keyField];
      },
      size: function size() {
        return this.vscrollData.validSizes[this.id] && this.vscrollData.sizes[this.id] || 0;
      },
      finalActive: function finalActive() {
        return this.active && this.vscrollData.active;
      }
    },
    watch: {
      watchData: 'updateWatchData',
      id: function id() {
        if (!this.size) {
          this.onDataUpdate();
        }
      },
      finalActive: function finalActive(value) {
        if (!this.size) {
          if (value) {
            if (!this.vscrollParent.$_undefinedMap[this.id]) {
              this.vscrollParent.$_undefinedSizes++;
              this.vscrollParent.$_undefinedMap[this.id] = true;
            }
          } else {
            if (this.vscrollParent.$_undefinedMap[this.id]) {
              this.vscrollParent.$_undefinedSizes--;
              this.vscrollParent.$_undefinedMap[this.id] = false;
            }
          }
        }

        if (this.vscrollResizeObserver) {
          if (value) {
            this.observeSize();
          } else {
            this.unobserveSize();
          }
        } else if (value && this.$_pendingVScrollUpdate === this.id) {
          this.updateSize();
        }
      }
    },
    created: function created() {
      var _this = this;

      if (this.$isServer) return;
      this.$_forceNextVScrollUpdate = null;
      this.updateWatchData();

      if (!this.vscrollResizeObserver) {
        var _loop = function _loop(k) {
          _this.$watch(function () {
            return _this.sizeDependencies[k];
          }, _this.onDataUpdate);
        };

        for (var k in this.sizeDependencies) {
          _loop(k);
        }

        this.vscrollParent.$on('vscroll:update', this.onVscrollUpdate);
        this.vscrollParent.$on('vscroll:update-size', this.onVscrollUpdateSize);
      }
    },
    mounted: function mounted() {
      if (this.vscrollData.active) {
        this.updateSize();
        this.observeSize();
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.vscrollParent.$off('vscroll:update', this.onVscrollUpdate);
      this.vscrollParent.$off('vscroll:update-size', this.onVscrollUpdateSize);
      this.unobserveSize();
    },
    methods: {
      updateSize: function updateSize() {
        if (this.finalActive) {
          if (this.$_pendingSizeUpdate !== this.id) {
            this.$_pendingSizeUpdate = this.id;
            this.$_forceNextVScrollUpdate = null;
            this.$_pendingVScrollUpdate = null;
            this.computeSize(this.id);
          }
        } else {
          this.$_forceNextVScrollUpdate = this.id;
        }
      },
      updateWatchData: function updateWatchData() {
        var _this2 = this;

        if (this.watchData) {
          this.$_watchData = this.$watch('data', function () {
            _this2.onDataUpdate();
          }, {
            deep: true
          });
        } else if (this.$_watchData) {
          this.$_watchData();
          this.$_watchData = null;
        }
      },
      onVscrollUpdate: function onVscrollUpdate(_ref) {
        var force = _ref.force;

        // If not active, sechedule a size update when it becomes active
        if (!this.finalActive && force) {
          this.$_pendingVScrollUpdate = this.id;
        }

        if (this.$_forceNextVScrollUpdate === this.id || force || !this.size) {
          this.updateSize();
        }
      },
      onDataUpdate: function onDataUpdate() {
        this.updateSize();
      },
      computeSize: function computeSize(id) {
        var _this3 = this;

        this.$nextTick(function () {
          if (_this3.id === id) {
            var width = _this3.$el.offsetWidth;
            var height = _this3.$el.offsetHeight;

            _this3.applySize(width, height);
          }

          _this3.$_pendingSizeUpdate = null;
        });
      },
      applySize: function applySize(width, height) {
        var size = Math.round(this.vscrollParent.direction === 'vertical' ? height : width);

        if (size && this.size !== size) {
          if (this.vscrollParent.$_undefinedMap[this.id]) {
            this.vscrollParent.$_undefinedSizes--;
            this.vscrollParent.$_undefinedMap[this.id] = undefined;
          }

          this.$set(this.vscrollData.sizes, this.id, size);
          this.$set(this.vscrollData.validSizes, this.id, true);
          if (this.emitResize) this.$emit('resize', this.id);
        }
      },
      observeSize: function observeSize() {
        if (!this.vscrollResizeObserver) return;
        this.vscrollResizeObserver.observe(this.$el.parentNode);
        this.$el.parentNode.addEventListener('resize', this.onResize);
      },
      unobserveSize: function unobserveSize() {
        if (!this.vscrollResizeObserver) return;
        this.vscrollResizeObserver.unobserve(this.$el.parentNode);
        this.$el.parentNode.removeEventListener('resize', this.onResize);
      },
      onResize: function onResize(event) {
        var _event$detail$content = event.detail.contentRect,
            width = _event$detail$content.width,
            height = _event$detail$content.height;
        this.applySize(width, height);
      }
    },
    render: function render(h) {
      return h(this.tag, this.$slots.default);
    }
  };

  const render$3 = () => {};


  script$3.render = render$3;
  script$3.__file = "src/components/DynamicScrollerItem.vue";

  function registerComponents(Vue, prefix) {
    Vue.component("".concat(prefix, "recycle-scroller"), script$1);
    Vue.component("".concat(prefix, "RecycleScroller"), script$1);
    Vue.component("".concat(prefix, "dynamic-scroller"), script$2);
    Vue.component("".concat(prefix, "DynamicScroller"), script$2);
    Vue.component("".concat(prefix, "dynamic-scroller-item"), script$3);
    Vue.component("".concat(prefix, "DynamicScrollerItem"), script$3);
  }

  var plugin$2 = {
    // eslint-disable-next-line no-undef
    version: "1.0.10",
    install: function install(Vue, options) {
      var finalOptions = Object.assign({}, {
        installComponents: true,
        componentsPrefix: ''
      }, options);

      for (var key in finalOptions) {
        if (typeof finalOptions[key] !== 'undefined') {
          config[key] = finalOptions[key];
        }
      }

      if (finalOptions.installComponents) {
        registerComponents(Vue, finalOptions.componentsPrefix);
      }
    }
  };

  var GlobalVue$2 = null;

  if (typeof window !== 'undefined') {
    GlobalVue$2 = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue$2 = global.Vue;
  }

  if (GlobalVue$2) {
    GlobalVue$2.use(plugin$2);
  }

  exports.DynamicScroller = script$2;
  exports.DynamicScrollerItem = script$3;
  exports.RecycleScroller = script$1;
  exports.default = plugin$2;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue-virtual-scroller.umd.js.map
