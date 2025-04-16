import "./chunk-JVWSFFO4.js";

// node_modules/.pnpm/animejs@4.0.1/node_modules/animejs/lib/anime.esm.js
var isBrowser = typeof window !== "undefined";
var win = isBrowser ? window : null;
var doc = isBrowser ? document : null;
var tweenTypes = {
  OBJECT: 0,
  ATTRIBUTE: 1,
  CSS: 2,
  TRANSFORM: 3,
  CSS_VAR: 4
};
var valueTypes = {
  NUMBER: 0,
  UNIT: 1,
  COLOR: 2,
  COMPLEX: 3
};
var tickModes = {
  NONE: 0,
  AUTO: 1,
  FORCE: 2
};
var compositionTypes = {
  replace: 0,
  none: 1,
  blend: 2
};
var isRegisteredTargetSymbol = Symbol();
var isDomSymbol = Symbol();
var isSvgSymbol = Symbol();
var transformsSymbol = Symbol();
var morphPointsSymbol = Symbol();
var proxyTargetSymbol = Symbol();
var minValue = 1e-11;
var maxValue = 1e12;
var K = 1e3;
var maxFps = 120;
var emptyString = "";
var shortTransforms = /* @__PURE__ */ new Map();
shortTransforms.set("x", "translateX");
shortTransforms.set("y", "translateY");
shortTransforms.set("z", "translateZ");
var validTransforms = [
  "translateX",
  "translateY",
  "translateZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "matrix3d"
];
var transformsFragmentStrings = validTransforms.reduce((a, v) => ({ ...a, [v]: v + "(" }), {});
var noop = () => {
};
var hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
var rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
var rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
var hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
var hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
var digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
var unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
var lowerCaseRgx = /([a-z])([A-Z])/g;
var transformsExecRgx = /(\w+)(\([^)]+\)+)/g;
var relativeValuesExecRgx = /(\*=|\+=|-=)/;
var defaults = {
  id: null,
  keyframes: null,
  playbackEase: null,
  playbackRate: 1,
  frameRate: maxFps,
  loop: 0,
  reversed: false,
  alternate: false,
  autoplay: true,
  duration: K,
  delay: 0,
  loopDelay: 0,
  ease: "out(2)",
  composition: compositionTypes.replace,
  modifier: (v) => v,
  onBegin: noop,
  onBeforeUpdate: noop,
  onUpdate: noop,
  onLoop: noop,
  onPause: noop,
  onComplete: noop,
  onRender: noop
};
var globals = {
  /** @type {DefaultsParams} */
  defaults,
  /** @type {Document|DOMTarget} */
  root: doc,
  /** @type {Scope} */
  scope: null,
  /** @type {Number} */
  precision: 4,
  /** @type {Number} */
  timeScale: 1,
  /** @type {Number} */
  tickThreshold: 200
};
var globalVersions = { version: "4.0.1", engine: null };
if (isBrowser) {
  if (!win.AnimeJS) win.AnimeJS = [];
  win.AnimeJS.push(globalVersions);
}
var toLowerCase = (str) => str.replace(lowerCaseRgx, "$1-$2").toLowerCase();
var stringStartsWith = (str, sub) => str.indexOf(sub) === 0;
var now = Date.now;
var isArr = Array.isArray;
var isObj = (a) => a && a.constructor === Object;
var isNum = (a) => typeof a === "number" && !isNaN(a);
var isStr = (a) => typeof a === "string";
var isFnc = (a) => typeof a === "function";
var isUnd = (a) => typeof a === "undefined";
var isNil = (a) => isUnd(a) || a === null;
var isSvg = (a) => isBrowser && a instanceof SVGElement;
var isHex = (a) => hexTestRgx.test(a);
var isRgb = (a) => stringStartsWith(a, "rgb");
var isHsl = (a) => stringStartsWith(a, "hsl");
var isCol = (a) => isHex(a) || isRgb(a) || isHsl(a);
var isKey = (a) => !globals.defaults.hasOwnProperty(a);
var parseNumber = (str) => isStr(str) ? parseFloat(
  /** @type {String} */
  str
) : (
  /** @type {Number} */
  str
);
var pow = Math.pow;
var sqrt = Math.sqrt;
var sin = Math.sin;
var cos = Math.cos;
var abs = Math.abs;
var exp = Math.exp;
var ceil = Math.ceil;
var floor = Math.floor;
var asin = Math.asin;
var max = Math.max;
var atan2 = Math.atan2;
var PI = Math.PI;
var _round = Math.round;
var clamp = (v, min, max2) => v < min ? min : v > max2 ? max2 : v;
var powCache = {};
var round = (v, decimalLength) => {
  if (decimalLength < 0) return v;
  if (!decimalLength) return _round(v);
  let p = powCache[decimalLength];
  if (!p) p = powCache[decimalLength] = 10 ** decimalLength;
  return _round(v * p) / p;
};
var snap = (v, increment) => isArr(increment) ? increment.reduce((closest, cv) => abs(cv - v) < abs(closest - v) ? cv : closest) : increment ? _round(v / increment) * increment : v;
var interpolate = (start, end, progress) => start + (end - start) * progress;
var clampInfinity = (v) => v === Infinity ? maxValue : v === -Infinity ? -1e12 : v;
var clampZero = (v) => v < minValue ? minValue : v;
var cloneArray = (a) => isArr(a) ? [...a] : a;
var mergeObjects = (o1, o2) => {
  const merged = (
    /** @type {T & U} */
    { ...o1 }
  );
  for (let p in o2) {
    const o1p = (
      /** @type {T & U} */
      o1[p]
    );
    merged[p] = isUnd(o1p) ? (
      /** @type {T & U} */
      o2[p]
    ) : o1p;
  }
  return merged;
};
var forEachChildren = (parent, callback, reverse, prevProp = "_prev", nextProp = "_next") => {
  let next = parent._head;
  let adjustedNextProp = nextProp;
  if (reverse) {
    next = parent._tail;
    adjustedNextProp = prevProp;
  }
  while (next) {
    const currentNext = next[adjustedNextProp];
    callback(next);
    next = currentNext;
  }
};
var removeChild = (parent, child, prevProp = "_prev", nextProp = "_next") => {
  const prev = child[prevProp];
  const next = child[nextProp];
  prev ? prev[nextProp] = next : parent._head = next;
  next ? next[prevProp] = prev : parent._tail = prev;
  child[prevProp] = null;
  child[nextProp] = null;
};
var addChild = (parent, child, sortMethod, prevProp = "_prev", nextProp = "_next") => {
  let prev = parent._tail;
  while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
  const next = prev ? prev[nextProp] : parent._head;
  prev ? prev[nextProp] = child : parent._head = child;
  next ? next[prevProp] = child : parent._tail = child;
  child[prevProp] = prev;
  child[nextProp] = next;
};
var Clock = class {
  /** @param {Number} [initTime] */
  constructor(initTime = 0) {
    this.deltaTime = 0;
    this._currentTime = initTime;
    this._elapsedTime = initTime;
    this._startTime = initTime;
    this._lastTime = initTime;
    this._scheduledTime = 0;
    this._frameDuration = round(K / maxFps, 0);
    this._fps = maxFps;
    this._speed = 1;
    this._hasChildren = false;
    this._head = null;
    this._tail = null;
  }
  get fps() {
    return this._fps;
  }
  set fps(frameRate) {
    const previousFrameDuration = this._frameDuration;
    const fr = +frameRate;
    const fps = fr < minValue ? minValue : fr;
    const frameDuration = round(K / fps, 0);
    this._fps = fps;
    this._frameDuration = frameDuration;
    this._scheduledTime += frameDuration - previousFrameDuration;
  }
  get speed() {
    return this._speed;
  }
  set speed(playbackRate) {
    const pbr = +playbackRate;
    this._speed = pbr < minValue ? minValue : pbr;
  }
  /**
   * @param  {Number} time
   * @return {tickModes}
   */
  requestTick(time) {
    const scheduledTime = this._scheduledTime;
    const elapsedTime = this._elapsedTime;
    this._elapsedTime += time - elapsedTime;
    if (elapsedTime < scheduledTime) return tickModes.NONE;
    const frameDuration = this._frameDuration;
    const frameDelta = elapsedTime - scheduledTime;
    this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
    return tickModes.AUTO;
  }
  /**
   * @param  {Number} time
   * @return {Number}
   */
  computeDeltaTime(time) {
    const delta = time - this._lastTime;
    this.deltaTime = delta;
    this._lastTime = time;
    return delta;
  }
};
var render = (tickable, time, muteCallbacks, internalRender, tickMode) => {
  const parent = tickable.parent;
  const duration = tickable.duration;
  const completed = tickable.completed;
  const iterationDuration = tickable.iterationDuration;
  const iterationCount = tickable.iterationCount;
  const _currentIteration = tickable._currentIteration;
  const _loopDelay = tickable._loopDelay;
  const _reversed = tickable._reversed;
  const _alternate = tickable._alternate;
  const _hasChildren = tickable._hasChildren;
  const tickableDelay = tickable._delay;
  const tickablePrevAbsoluteTime = tickable._currentTime;
  const tickableEndTime = tickableDelay + iterationDuration;
  const tickableAbsoluteTime = time - tickableDelay;
  const tickablePrevTime = clamp(tickablePrevAbsoluteTime, -tickableDelay, duration);
  const tickableCurrentTime = clamp(tickableAbsoluteTime, -tickableDelay, duration);
  const deltaTime = tickableAbsoluteTime - tickablePrevAbsoluteTime;
  const isCurrentTimeAboveZero = tickableCurrentTime > 0;
  const isCurrentTimeEqualOrAboveDuration = tickableCurrentTime >= duration;
  const isSetter = duration <= minValue;
  const forcedTick = tickMode === tickModes.FORCE;
  let isOdd = 0;
  let iterationElapsedTime = tickableAbsoluteTime;
  let hasRendered = 0;
  if (iterationCount > 1) {
    const currentIteration = ~~(tickableCurrentTime / (iterationDuration + (isCurrentTimeEqualOrAboveDuration ? 0 : _loopDelay)));
    tickable._currentIteration = clamp(currentIteration, 0, iterationCount);
    if (isCurrentTimeEqualOrAboveDuration) tickable._currentIteration--;
    isOdd = tickable._currentIteration % 2;
    iterationElapsedTime = tickableCurrentTime % (iterationDuration + _loopDelay) || 0;
  }
  const isReversed = _reversed ^ (_alternate && isOdd);
  const _ease = (
    /** @type {Renderable} */
    tickable._ease
  );
  let iterationTime = isCurrentTimeEqualOrAboveDuration ? isReversed ? 0 : duration : isReversed ? iterationDuration - iterationElapsedTime : iterationElapsedTime;
  if (_ease) iterationTime = iterationDuration * _ease(iterationTime / iterationDuration) || 0;
  const isRunningBackwards = (parent ? parent.backwards : tickableAbsoluteTime < tickablePrevAbsoluteTime) ? !isReversed : !!isReversed;
  tickable._currentTime = tickableAbsoluteTime;
  tickable._iterationTime = iterationTime;
  tickable.backwards = isRunningBackwards;
  if (isCurrentTimeAboveZero && !tickable.began) {
    tickable.began = true;
    if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
      tickable.onBegin(
        /** @type {CallbackArgument} */
        tickable
      );
    }
  } else if (tickableAbsoluteTime <= 0) {
    tickable.began = false;
  }
  if (!muteCallbacks && !_hasChildren && isCurrentTimeAboveZero && tickable._currentIteration !== _currentIteration) {
    tickable.onLoop(
      /** @type {CallbackArgument} */
      tickable
    );
  }
  if (forcedTick || tickMode === tickModes.AUTO && (time >= tickableDelay && time <= tickableEndTime || // Normal render
  time <= tickableDelay && tickablePrevTime > tickableDelay || // Playhead is before the animation start time so make sure the animation is at its initial state
  time >= tickableEndTime && tickablePrevTime !== duration) || iterationTime >= tickableEndTime && tickablePrevTime !== duration || iterationTime <= tickableDelay && tickablePrevTime > 0 || time <= tickablePrevTime && tickablePrevTime === duration && completed || // Force a render if a seek occurs on an completed animation
  isCurrentTimeEqualOrAboveDuration && !completed && isSetter) {
    if (isCurrentTimeAboveZero) {
      tickable.computeDeltaTime(tickablePrevTime);
      if (!muteCallbacks) tickable.onBeforeUpdate(
        /** @type {CallbackArgument} */
        tickable
      );
    }
    if (!_hasChildren) {
      const forcedRender = forcedTick || (isRunningBackwards ? deltaTime * -1 : deltaTime) >= globals.tickThreshold;
      const absoluteTime = tickable._offset + (parent ? parent._offset : 0) + tickableDelay + iterationTime;
      let tween = (
        /** @type {Tween} */
        /** @type {JSAnimation} */
        tickable._head
      );
      let tweenTarget;
      let tweenStyle;
      let tweenTargetTransforms;
      let tweenTargetTransformsProperties;
      let tweenTransformsNeedUpdate = 0;
      while (tween) {
        const tweenComposition = tween._composition;
        const tweenCurrentTime = tween._currentTime;
        const tweenChangeDuration = tween._changeDuration;
        const tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
        const tweenNextRep = tween._nextRep;
        const tweenPrevRep = tween._prevRep;
        const tweenHasComposition = tweenComposition !== compositionTypes.none;
        if ((forcedRender || (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) && (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)) && (!tweenHasComposition || !tween._isOverridden && (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) && (!tweenNextRep || (tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime)) && (!tweenPrevRep || (tweenPrevRep._isOverridden || absoluteTime >= tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration + tween._delay)))) {
          const tweenNewTime = tween._currentTime = clamp(iterationTime - tween._startTime, 0, tweenChangeDuration);
          const tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
          const tweenModifier = tween._modifier;
          const tweenValueType = tween._valueType;
          const tweenType = tween._tweenType;
          const tweenIsObject = tweenType === tweenTypes.OBJECT;
          const tweenIsNumber = tweenValueType === valueTypes.NUMBER;
          const tweenPrecision = tweenIsNumber && tweenIsObject || tweenProgress === 0 || tweenProgress === 1 ? -1 : globals.precision;
          let value;
          let number;
          if (tweenIsNumber) {
            value = number = /** @type {Number} */
            tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
          } else if (tweenValueType === valueTypes.UNIT) {
            number = /** @type {Number} */
            tweenModifier(round(interpolate(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
            value = `${number}${tween._unit}`;
          } else if (tweenValueType === valueTypes.COLOR) {
            const fn = tween._fromNumbers;
            const tn = tween._toNumbers;
            const r = round(clamp(
              /** @type {Number} */
              tweenModifier(interpolate(fn[0], tn[0], tweenProgress)),
              0,
              255
            ), 0);
            const g = round(clamp(
              /** @type {Number} */
              tweenModifier(interpolate(fn[1], tn[1], tweenProgress)),
              0,
              255
            ), 0);
            const b = round(clamp(
              /** @type {Number} */
              tweenModifier(interpolate(fn[2], tn[2], tweenProgress)),
              0,
              255
            ), 0);
            const a = clamp(
              /** @type {Number} */
              tweenModifier(round(interpolate(fn[3], tn[3], tweenProgress), tweenPrecision)),
              0,
              1
            );
            value = `rgba(${r},${g},${b},${a})`;
            if (tweenHasComposition) {
              const ns = tween._numbers;
              ns[0] = r;
              ns[1] = g;
              ns[2] = b;
              ns[3] = a;
            }
          } else if (tweenValueType === valueTypes.COMPLEX) {
            value = tween._strings[0];
            for (let j = 0, l = tween._toNumbers.length; j < l; j++) {
              const n = (
                /** @type {Number} */
                tweenModifier(round(interpolate(tween._fromNumbers[j], tween._toNumbers[j], tweenProgress), tweenPrecision))
              );
              const s = tween._strings[j + 1];
              value += `${s ? n + s : n}`;
              if (tweenHasComposition) {
                tween._numbers[j] = n;
              }
            }
          }
          if (tweenHasComposition) {
            tween._number = number;
          }
          if (!internalRender && tweenComposition !== compositionTypes.blend) {
            const tweenProperty = tween.property;
            tweenTarget = tween.target;
            if (tweenIsObject) {
              tweenTarget[tweenProperty] = value;
            } else if (tweenType === tweenTypes.ATTRIBUTE) {
              tweenTarget.setAttribute(
                tweenProperty,
                /** @type {String} */
                value
              );
            } else {
              tweenStyle = /** @type {DOMTarget} */
              tweenTarget.style;
              if (tweenType === tweenTypes.TRANSFORM) {
                if (tweenTarget !== tweenTargetTransforms) {
                  tweenTargetTransforms = tweenTarget;
                  tweenTargetTransformsProperties = tweenTarget[transformsSymbol];
                }
                tweenTargetTransformsProperties[tweenProperty] = value;
                tweenTransformsNeedUpdate = 1;
              } else if (tweenType === tweenTypes.CSS) {
                tweenStyle[tweenProperty] = value;
              } else if (tweenType === tweenTypes.CSS_VAR) {
                tweenStyle.setProperty(
                  tweenProperty,
                  /** @type {String} */
                  value
                );
              }
            }
            if (isCurrentTimeAboveZero) hasRendered = 1;
          } else {
            tween._value = value;
          }
        }
        if (tweenTransformsNeedUpdate && tween._renderTransforms) {
          let str = emptyString;
          for (let key2 in tweenTargetTransformsProperties) {
            str += `${transformsFragmentStrings[key2]}${tweenTargetTransformsProperties[key2]}) `;
          }
          tweenStyle.transform = str;
          tweenTransformsNeedUpdate = 0;
        }
        tween = tween._next;
      }
      if (!muteCallbacks && hasRendered) {
        tickable.onRender(
          /** @type {JSAnimation} */
          tickable
        );
      }
    }
    if (!muteCallbacks && isCurrentTimeAboveZero) {
      tickable.onUpdate(
        /** @type {CallbackArgument} */
        tickable
      );
    }
  }
  if (parent && isSetter) {
    if (!muteCallbacks && (parent.began && !isRunningBackwards && tickableAbsoluteTime >= duration && !completed || isRunningBackwards && tickableAbsoluteTime <= minValue && completed)) {
      tickable.onComplete(
        /** @type {CallbackArgument} */
        tickable
      );
      tickable.completed = !isRunningBackwards;
    }
  } else if (isCurrentTimeAboveZero && isCurrentTimeEqualOrAboveDuration) {
    if (iterationCount === Infinity) {
      tickable._startTime += tickable.duration;
    } else if (tickable._currentIteration >= iterationCount - 1) {
      tickable.paused = true;
      if (!completed && !_hasChildren) {
        tickable.completed = true;
        if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
          tickable.onComplete(
            /** @type {CallbackArgument} */
            tickable
          );
          tickable._resolve(
            /** @type {CallbackArgument} */
            tickable
          );
        }
      }
    }
  } else {
    tickable.completed = false;
  }
  return hasRendered;
};
var tick = (tickable, time, muteCallbacks, internalRender, tickMode) => {
  const _currentIteration = tickable._currentIteration;
  render(tickable, time, muteCallbacks, internalRender, tickMode);
  if (tickable._hasChildren) {
    const tl = (
      /** @type {Timeline} */
      tickable
    );
    const tlIsRunningBackwards = tl.backwards;
    const tlChildrenTime = internalRender ? time : tl._iterationTime;
    const tlCildrenTickTime = now();
    let tlChildrenHasRendered = 0;
    let tlChildrenHaveCompleted = true;
    if (!internalRender && tl._currentIteration !== _currentIteration) {
      const tlIterationDuration = tl.iterationDuration;
      forEachChildren(tl, (child) => {
        if (!tlIsRunningBackwards) {
          if (!child.completed && !child.backwards && child._currentTime < child.iterationDuration) {
            render(child, tlIterationDuration, muteCallbacks, 1, tickModes.FORCE);
          }
          child.began = false;
          child.completed = false;
        } else {
          const childDuration = child.duration;
          const childStartTime = child._offset + child._delay;
          const childEndTime = childStartTime + childDuration;
          if (!muteCallbacks && childDuration <= minValue && (!childStartTime || childEndTime === tlIterationDuration)) {
            child.onComplete(child);
          }
        }
      });
      if (!muteCallbacks) tl.onLoop(
        /** @type {CallbackArgument} */
        tl
      );
    }
    forEachChildren(tl, (child) => {
      const childTime = round((tlChildrenTime - child._offset) * child._speed, 12);
      const childTickMode = child._fps < tl._fps ? child.requestTick(tlCildrenTickTime) : tickMode;
      tlChildrenHasRendered += render(child, childTime, muteCallbacks, internalRender, childTickMode);
      if (!child.completed && tlChildrenHaveCompleted) tlChildrenHaveCompleted = false;
    }, tlIsRunningBackwards);
    if (!muteCallbacks && tlChildrenHasRendered) tl.onRender(
      /** @type {CallbackArgument} */
      tl
    );
    if (tlChildrenHaveCompleted && tl._currentTime >= tl.duration) {
      tl.paused = true;
      if (!tl.completed) {
        tl.completed = true;
        if (!muteCallbacks) {
          tl.onComplete(
            /** @type {CallbackArgument} */
            tl
          );
          tl._resolve(
            /** @type {CallbackArgument} */
            tl
          );
        }
      }
    }
  }
};
var additive = {
  animation: null,
  update: noop
};
var addAdditiveAnimation = (lookups2) => {
  let animation = additive.animation;
  if (!animation) {
    animation = {
      duration: minValue,
      computeDeltaTime: noop,
      _offset: 0,
      _delay: 0,
      _head: null,
      _tail: null
    };
    additive.animation = animation;
    additive.update = () => {
      lookups2.forEach((propertyAnimation) => {
        for (let propertyName in propertyAnimation) {
          const tweens = propertyAnimation[propertyName];
          const lookupTween = tweens._head;
          if (lookupTween) {
            const valueType = lookupTween._valueType;
            const additiveValues = valueType === valueTypes.COMPLEX || valueType === valueTypes.COLOR ? cloneArray(lookupTween._fromNumbers) : null;
            let additiveValue = lookupTween._fromNumber;
            let tween = tweens._tail;
            while (tween && tween !== lookupTween) {
              if (additiveValues) {
                for (let i = 0, l = tween._numbers.length; i < l; i++) additiveValues[i] += tween._numbers[i];
              } else {
                additiveValue += tween._number;
              }
              tween = tween._prevAdd;
            }
            lookupTween._toNumber = additiveValue;
            lookupTween._toNumbers = additiveValues;
          }
        }
      });
      render(animation, 1, 1, 0, tickModes.FORCE);
    };
  }
  return animation;
};
var engineTickMethod = isBrowser ? requestAnimationFrame : setImmediate;
var engineCancelMethod = isBrowser ? cancelAnimationFrame : clearImmediate;
var Engine = class extends Clock {
  /** @param {Number} [initTime] */
  constructor(initTime) {
    super(initTime);
    this.useDefaultMainLoop = true;
    this.pauseOnDocumentHidden = true;
    this.defaults = defaults;
    this.paused = isBrowser && doc.hidden ? true : false;
    this.reqId = null;
  }
  update() {
    const time = this._currentTime = now();
    if (this.requestTick(time)) {
      this.computeDeltaTime(time);
      const engineSpeed = this._speed;
      const engineFps = this._fps;
      let activeTickable = (
        /** @type {Tickable} */
        this._head
      );
      while (activeTickable) {
        const nextTickable = activeTickable._next;
        if (!activeTickable.paused) {
          tick(
            activeTickable,
            (time - activeTickable._startTime) * activeTickable._speed * engineSpeed,
            0,
            // !muteCallbacks
            0,
            // !internalRender
            activeTickable._fps < engineFps ? activeTickable.requestTick(time) : tickModes.AUTO
          );
        } else {
          removeChild(this, activeTickable);
          this._hasChildren = !!this._tail;
          activeTickable._running = false;
          if (activeTickable.completed && !activeTickable._cancelled) {
            activeTickable.cancel();
          }
        }
        activeTickable = nextTickable;
      }
      additive.update();
    }
  }
  wake() {
    if (this.useDefaultMainLoop && !this.reqId && !this.paused) {
      this.reqId = engineTickMethod(tickEngine);
    }
    return this;
  }
  pause() {
    this.paused = true;
    return killEngine();
  }
  resume() {
    if (!this.paused) return;
    this.paused = false;
    forEachChildren(this, (child) => child.resetTime());
    return this.wake();
  }
  // Getter and setter for speed
  get speed() {
    return this._speed * (globals.timeScale === 1 ? 1 : K);
  }
  set speed(playbackRate) {
    this._speed = playbackRate * globals.timeScale;
    forEachChildren(this, (child) => child.speed = child._speed);
  }
  // Getter and setter for timeUnit
  get timeUnit() {
    return globals.timeScale === 1 ? "ms" : "s";
  }
  set timeUnit(unit) {
    const secondsScale = 1e-3;
    const isSecond = unit === "s";
    const newScale = isSecond ? secondsScale : 1;
    if (globals.timeScale !== newScale) {
      globals.timeScale = newScale;
      globals.tickThreshold = 200 * newScale;
      const scaleFactor = isSecond ? secondsScale : K;
      this.defaults.duration *= scaleFactor;
      this._speed *= scaleFactor;
    }
  }
  // Getter and setter for precision
  get precision() {
    return globals.precision;
  }
  set precision(precision) {
    globals.precision = precision;
  }
};
var engine = (() => {
  const engine2 = new Engine(now());
  if (isBrowser) {
    globalVersions.engine = engine2;
    doc.addEventListener("visibilitychange", () => {
      if (!engine2.pauseOnDocumentHidden) return;
      doc.hidden ? engine2.pause() : engine2.resume();
    });
  }
  return engine2;
})();
var tickEngine = () => {
  if (engine._head) {
    engine.reqId = engineTickMethod(tickEngine);
    engine.update();
  } else {
    engine.reqId = 0;
  }
};
var killEngine = () => {
  engineCancelMethod(
    /** @type {NodeJS.Immediate & Number} */
    engine.reqId
  );
  engine.reqId = 0;
  return engine;
};
var parseInlineTransforms = (target, propName, animationInlineStyles) => {
  const inlineTransforms = target.style.transform;
  let inlinedStylesPropertyValue;
  if (inlineTransforms) {
    const cachedTransforms = target[transformsSymbol];
    let t;
    while (t = transformsExecRgx.exec(inlineTransforms)) {
      const inlinePropertyName = t[1];
      const inlinePropertyValue = t[2].slice(1, -1);
      cachedTransforms[inlinePropertyName] = inlinePropertyValue;
      if (inlinePropertyName === propName) {
        inlinedStylesPropertyValue = inlinePropertyValue;
        if (animationInlineStyles) {
          animationInlineStyles[propName] = inlinePropertyValue;
        }
      }
    }
  }
  return inlineTransforms && !isUnd(inlinedStylesPropertyValue) ? inlinedStylesPropertyValue : stringStartsWith(propName, "scale") ? "1" : stringStartsWith(propName, "rotate") || stringStartsWith(propName, "skew") ? "0deg" : "0px";
};
function getNodeList(v) {
  const n = isStr(v) ? globals.root.querySelectorAll(v) : v;
  if (n instanceof NodeList || n instanceof HTMLCollection) return n;
}
function parseTargets(targets) {
  if (isNil(targets)) return (
    /** @type {TargetsArray} */
    []
  );
  if (isArr(targets)) {
    const flattened = targets.flat(Infinity);
    const parsed = [];
    for (let i = 0, l = flattened.length; i < l; i++) {
      const item = flattened[i];
      if (!isNil(item)) {
        const nodeList2 = getNodeList(item);
        if (nodeList2) {
          for (let j = 0, jl = nodeList2.length; j < jl; j++) {
            const subItem = nodeList2[j];
            if (!isNil(subItem)) {
              let isDuplicate = false;
              for (let k = 0, kl = parsed.length; k < kl; k++) {
                if (parsed[k] === subItem) {
                  isDuplicate = true;
                  break;
                }
              }
              if (!isDuplicate) {
                parsed.push(subItem);
              }
            }
          }
        } else {
          let isDuplicate = false;
          for (let j = 0, jl = parsed.length; j < jl; j++) {
            if (parsed[j] === item) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            parsed.push(item);
          }
        }
      }
    }
    return parsed;
  }
  if (!isBrowser) return (
    /** @type {JSTargetsArray} */
    [targets]
  );
  const nodeList = getNodeList(targets);
  if (nodeList) return (
    /** @type {DOMTargetsArray} */
    Array.from(nodeList)
  );
  return (
    /** @type {TargetsArray} */
    [targets]
  );
}
function registerTargets(targets) {
  const parsedTargetsArray = parseTargets(targets);
  const parsedTargetsLength = parsedTargetsArray.length;
  if (parsedTargetsLength) {
    for (let i = 0; i < parsedTargetsLength; i++) {
      const target = parsedTargetsArray[i];
      if (!target[isRegisteredTargetSymbol]) {
        target[isRegisteredTargetSymbol] = true;
        const isSvgType = isSvg(target);
        const isDom = (
          /** @type {DOMTarget} */
          target.nodeType || isSvgType
        );
        if (isDom) {
          target[isDomSymbol] = true;
          target[isSvgSymbol] = isSvgType;
          target[transformsSymbol] = {};
        }
      }
    }
  }
  return parsedTargetsArray;
}
var getPath = (path) => {
  const parsedTargets = parseTargets(path);
  const $parsedSvg = (
    /** @type {SVGGeometryElement} */
    parsedTargets[0]
  );
  if (!$parsedSvg || !isSvg($parsedSvg)) return;
  return $parsedSvg;
};
var morphTo = (path2, precision = 0.33) => ($path1) => {
  const $path2 = (
    /** @type {SVGGeometryElement} */
    getPath(path2)
  );
  if (!$path2) return;
  const isPath = $path1.tagName === "path";
  const separator = isPath ? " " : ",";
  const previousPoints = $path1[morphPointsSymbol];
  if (previousPoints) $path1.setAttribute(isPath ? "d" : "points", previousPoints);
  let v1 = "", v2 = "";
  if (!precision) {
    v1 = $path1.getAttribute(isPath ? "d" : "points");
    v2 = $path2.getAttribute(isPath ? "d" : "points");
  } else {
    const length1 = (
      /** @type {SVGGeometryElement} */
      $path1.getTotalLength()
    );
    const length2 = $path2.getTotalLength();
    const maxPoints = Math.max(Math.ceil(length1 * precision), Math.ceil(length2 * precision));
    for (let i = 0; i < maxPoints; i++) {
      const t = i / (maxPoints - 1);
      const pointOnPath1 = (
        /** @type {SVGGeometryElement} */
        $path1.getPointAtLength(length1 * t)
      );
      const pointOnPath2 = $path2.getPointAtLength(length2 * t);
      const prefix = isPath ? i === 0 ? "M" : "L" : "";
      v1 += prefix + round(pointOnPath1.x, 3) + separator + pointOnPath1.y + " ";
      v2 += prefix + round(pointOnPath2.x, 3) + separator + pointOnPath2.y + " ";
    }
  }
  $path1[morphPointsSymbol] = v2;
  return [v1, v2];
};
function createDrawableProxy($el, start, end) {
  const strokeLineCap = getComputedStyle($el).strokeLinecap;
  const pathLength = K;
  let currentCap = strokeLineCap;
  const proxy = new Proxy($el, {
    get(target, property) {
      const value = target[property];
      if (property === proxyTargetSymbol) return target;
      if (property === "setAttribute") {
        return (...args) => {
          if (args[0] === "draw") {
            const value2 = args[1];
            const values = value2.split(" ");
            const v1 = +values[0];
            const v2 = +values[1];
            const os = v1 * -1e3;
            const d1 = v2 * pathLength + os;
            const d2 = pathLength + (v1 === 0 && v2 === 1 || v1 === 1 && v2 === 0 ? 0 : 10) - d1;
            if (strokeLineCap !== "butt") {
              const newCap = v1 === v2 ? "butt" : strokeLineCap;
              if (currentCap !== newCap) {
                target.setAttribute("stroke-linecap", `${newCap}`);
                currentCap = newCap;
              }
            }
            target.setAttribute("stroke-dashoffset", `${os}`);
            target.setAttribute("stroke-dasharray", `${d1} ${d2}`);
          }
          return Reflect.apply(value, target, args);
        };
      }
      if (isFnc(value)) {
        return (...args) => Reflect.apply(value, target, args);
      } else {
        return value;
      }
    }
  });
  if ($el.getAttribute("pathLength") !== `${pathLength}`) {
    $el.setAttribute("pathLength", `${pathLength}`);
    proxy.setAttribute("draw", `${start} ${end}`);
  }
  return (
    /** @type {typeof Proxy} */
    /** @type {unknown} */
    proxy
  );
}
var createDrawable = (selector, start = 0, end = 0) => {
  const els = (
    /** @type {Array.<Proxy>} */
    /** @type {unknown} */
    parseTargets(selector)
  );
  els.forEach(($el, i) => els[i] = createDrawableProxy(
    /** @type {SVGGeometryElement} */
    /** @type {unknown} */
    $el,
    start,
    end
  ));
  return els;
};
var getPathPoint = ($path, progress, lookup = 0) => {
  return $path.getPointAtLength(progress + lookup >= 1 ? progress + lookup : 0);
};
var getPathProgess = ($path, pathProperty) => {
  return ($el) => {
    const totalLength = +$path.getTotalLength();
    const inSvg = $el[isSvgSymbol];
    const ctm = $path.getCTM();
    return {
      from: 0,
      to: totalLength,
      /** @type {TweenModifier} */
      modifier: (progress) => {
        if (pathProperty === "a") {
          const p0 = getPathPoint($path, progress, -1);
          const p1 = getPathPoint($path, progress, 1);
          return atan2(p1.y - p0.y, p1.x - p0.x) * 180 / PI;
        } else {
          const p = getPathPoint($path, progress, 0);
          return pathProperty === "x" ? inSvg || !ctm ? p.x : p.x * ctm.a + p.y * ctm.c + ctm.e : inSvg || !ctm ? p.y : p.x * ctm.b + p.y * ctm.d + ctm.f;
        }
      }
    };
  };
};
var createMotionPath = (path) => {
  const $path = getPath(path);
  if (!$path) return;
  return {
    translateX: getPathProgess($path, "x"),
    translateY: getPathProgess($path, "y"),
    rotate: getPathProgess($path, "a")
  };
};
var cssReservedProperties = ["opacity", "rotate", "overflow", "color"];
var isValidSVGAttribute = (el, propertyName) => {
  if (cssReservedProperties.includes(propertyName)) return false;
  if (el.getAttribute(propertyName) || propertyName in el) {
    if (propertyName === "scale") {
      const elParentNode = (
        /** @type {SVGGeometryElement} */
        /** @type {DOMTarget} */
        el.parentNode
      );
      return elParentNode && elParentNode.tagName === "filter";
    }
    return true;
  }
};
var svg = {
  morphTo,
  createMotionPath,
  createDrawable
};
var rgbToRgba = (rgbValue) => {
  const rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
  const a = !isUnd(rgba[4]) ? +rgba[4] : 1;
  return [
    +rgba[1],
    +rgba[2],
    +rgba[3],
    a
  ];
};
var hexToRgba = (hexValue) => {
  const hexLength = hexValue.length;
  const isShort = hexLength === 4 || hexLength === 5;
  return [
    +("0x" + hexValue[1] + hexValue[isShort ? 1 : 2]),
    +("0x" + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]),
    +("0x" + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]),
    hexLength === 5 || hexLength === 9 ? +(+("0x" + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1
  ];
};
var hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
};
var hslToRgba = (hslValue) => {
  const hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
  const h = +hsla[1] / 360;
  const s = +hsla[2] / 100;
  const l = +hsla[3] / 100;
  const a = !isUnd(hsla[4]) ? +hsla[4] : 1;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = round(hue2rgb(p, q, h + 1 / 3) * 255, 0);
    g = round(hue2rgb(p, q, h) * 255, 0);
    b = round(hue2rgb(p, q, h - 1 / 3) * 255, 0);
  }
  return [r, g, b, a];
};
var convertColorStringValuesToRgbaArray = (colorString) => {
  return isRgb(colorString) ? rgbToRgba(colorString) : isHex(colorString) ? hexToRgba(colorString) : isHsl(colorString) ? hslToRgba(colorString) : [0, 0, 0, 1];
};
var setValue = (targetValue, defaultValue) => {
  return isUnd(targetValue) ? defaultValue : targetValue;
};
var getFunctionValue = (value, target, index, total, store) => {
  if (isFnc(value)) {
    const func = () => {
      const computed = (
        /** @type {Function} */
        value(target, index, total)
      );
      return !isNaN(+computed) ? +computed : computed || 0;
    };
    if (store) {
      store.func = func;
    }
    return func();
  } else {
    return value;
  }
};
var getTweenType = (target, prop) => {
  return !target[isDomSymbol] ? tweenTypes.OBJECT : (
    // Handle SVG attributes
    target[isSvgSymbol] && isValidSVGAttribute(target, prop) ? tweenTypes.ATTRIBUTE : (
      // Handle CSS Transform properties differently than CSS to allow individual animations
      validTransforms.includes(prop) || shortTransforms.get(prop) ? tweenTypes.TRANSFORM : (
        // CSS variables
        stringStartsWith(prop, "--") ? tweenTypes.CSS_VAR : (
          // All other CSS properties
          prop in /** @type {DOMTarget} */
          target.style ? tweenTypes.CSS : (
            // Handle other DOM Attributes
            prop in target ? tweenTypes.OBJECT : tweenTypes.ATTRIBUTE
          )
        )
      )
    )
  );
};
var getCSSValue = (target, propName, animationInlineStyles) => {
  const inlineStyles = target.style[propName];
  if (inlineStyles && animationInlineStyles) {
    animationInlineStyles[propName] = inlineStyles;
  }
  const value = inlineStyles || getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(propName);
  return value === "auto" ? "0" : value;
};
var getOriginalAnimatableValue = (target, propName, tweenType, animationInlineStyles) => {
  const type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
  return type === tweenTypes.OBJECT ? target[propName] || 0 : type === tweenTypes.ATTRIBUTE ? (
    /** @type {DOMTarget} */
    target.getAttribute(propName)
  ) : type === tweenTypes.TRANSFORM ? parseInlineTransforms(
    /** @type {DOMTarget} */
    target,
    propName,
    animationInlineStyles
  ) : type === tweenTypes.CSS_VAR ? getCSSValue(
    /** @type {DOMTarget} */
    target,
    propName,
    animationInlineStyles
  ).trimStart() : getCSSValue(
    /** @type {DOMTarget} */
    target,
    propName,
    animationInlineStyles
  );
};
var getRelativeValue = (x, y, operator) => {
  return operator === "-" ? x - y : operator === "+" ? x + y : x * y;
};
var createDecomposedValueTargetObject = () => {
  return {
    /** @type {valueTypes} */
    t: valueTypes.NUMBER,
    n: 0,
    u: null,
    o: null,
    d: null,
    s: null
  };
};
var decomposeRawValue = (rawValue, targetObject) => {
  targetObject.t = valueTypes.NUMBER;
  targetObject.n = 0;
  targetObject.u = null;
  targetObject.o = null;
  targetObject.d = null;
  targetObject.s = null;
  if (!rawValue) return targetObject;
  const num = +rawValue;
  if (!isNaN(num)) {
    targetObject.n = num;
    return targetObject;
  } else {
    let str = (
      /** @type {String} */
      rawValue
    );
    if (str[1] === "=") {
      targetObject.o = str[0];
      str = str.slice(2);
    }
    const unitMatch = str.includes(" ") ? false : unitsExecRgx.exec(str);
    if (unitMatch) {
      targetObject.t = valueTypes.UNIT;
      targetObject.n = +unitMatch[1];
      targetObject.u = unitMatch[2];
      return targetObject;
    } else if (targetObject.o) {
      targetObject.n = +str;
      return targetObject;
    } else if (isCol(str)) {
      targetObject.t = valueTypes.COLOR;
      targetObject.d = convertColorStringValuesToRgbaArray(str);
      return targetObject;
    } else {
      const matchedNumbers = str.match(digitWithExponentRgx);
      targetObject.t = valueTypes.COMPLEX;
      targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
      targetObject.s = str.split(digitWithExponentRgx) || [];
      return targetObject;
    }
  }
};
var decomposeTweenValue = (tween, targetObject) => {
  targetObject.t = tween._valueType;
  targetObject.n = tween._toNumber;
  targetObject.u = tween._unit;
  targetObject.o = null;
  targetObject.d = cloneArray(tween._toNumbers);
  targetObject.s = cloneArray(tween._strings);
  return targetObject;
};
var decomposedOriginalValue = createDecomposedValueTargetObject();
var lookups = {
  /** @type {TweenReplaceLookups} */
  _rep: /* @__PURE__ */ new WeakMap(),
  /** @type {TweenAdditiveLookups} */
  _add: /* @__PURE__ */ new Map()
};
var getTweenSiblings = (target, property, lookup = "_rep") => {
  const lookupMap = lookups[lookup];
  let targetLookup = lookupMap.get(target);
  if (!targetLookup) {
    targetLookup = {};
    lookupMap.set(target, targetLookup);
  }
  return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
    _head: null,
    _tail: null
  };
};
var addTweenSortMethod = (p, c) => {
  return p._isOverridden || p._absoluteStartTime > c._absoluteStartTime;
};
var overrideTween = (tween) => {
  tween._isOverlapped = 1;
  tween._isOverridden = 1;
  tween._changeDuration = minValue;
  tween._currentTime = minValue;
};
var composeTween = (tween, siblings) => {
  const tweenCompositionType = tween._composition;
  if (tweenCompositionType === compositionTypes.replace) {
    const tweenAbsStartTime = tween._absoluteStartTime;
    addChild(siblings, tween, addTweenSortMethod, "_prevRep", "_nextRep");
    const prevSibling = tween._prevRep;
    if (prevSibling) {
      const prevParent = prevSibling.parent;
      const prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;
      if (
        // Check if the previous tween is from a different animation
        tween.parent.id !== prevParent.id && // Check if the animation has loops
        prevParent.iterationCount > 1 && // Check if _absoluteChangeEndTime of last loop overlaps the current tween
        prevAbsEndTime + (prevParent.duration - prevParent.iterationDuration) > tweenAbsStartTime
      ) {
        overrideTween(prevSibling);
        let prevPrevSibling = prevSibling._prevRep;
        while (prevPrevSibling && prevPrevSibling.parent.id === prevParent.id) {
          overrideTween(prevPrevSibling);
          prevPrevSibling = prevPrevSibling._prevRep;
        }
      }
      const absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;
      if (prevAbsEndTime > absoluteUpdateStartTime) {
        const prevChangeStartTime = prevSibling._startTime;
        const prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);
        prevSibling._changeDuration = absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime;
        prevSibling._currentTime = prevSibling._changeDuration;
        prevSibling._isOverlapped = 1;
        if (prevSibling._changeDuration < minValue) {
          overrideTween(prevSibling);
        }
      }
      let pausePrevParentAnimation = true;
      forEachChildren(prevParent, (t) => {
        if (!t._isOverlapped) pausePrevParentAnimation = false;
      });
      if (pausePrevParentAnimation) {
        const prevParentTL = prevParent.parent;
        if (prevParentTL) {
          let pausePrevParentTL = true;
          forEachChildren(prevParentTL, (a) => {
            if (a !== prevParent) {
              forEachChildren(a, (t) => {
                if (!t._isOverlapped) pausePrevParentTL = false;
              });
            }
          });
          if (pausePrevParentTL) {
            prevParentTL.cancel();
          }
        } else {
          prevParent.cancel();
        }
      }
    }
  } else if (tweenCompositionType === compositionTypes.blend) {
    const additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, "_add");
    const additiveAnimation = addAdditiveAnimation(lookups._add);
    let lookupTween = additiveTweenSiblings._head;
    if (!lookupTween) {
      lookupTween = { ...tween };
      lookupTween._composition = compositionTypes.replace;
      lookupTween._updateDuration = minValue;
      lookupTween._startTime = 0;
      lookupTween._numbers = cloneArray(tween._fromNumbers);
      lookupTween._number = 0;
      lookupTween._next = null;
      lookupTween._prev = null;
      addChild(additiveTweenSiblings, lookupTween);
      addChild(additiveAnimation, lookupTween);
    }
    const toNumber = tween._toNumber;
    tween._fromNumber = lookupTween._fromNumber - toNumber;
    tween._toNumber = 0;
    tween._numbers = cloneArray(tween._fromNumbers);
    tween._number = 0;
    lookupTween._fromNumber = toNumber;
    if (tween._toNumbers) {
      const toNumbers = cloneArray(tween._toNumbers);
      if (toNumbers) {
        toNumbers.forEach((value, i) => {
          tween._fromNumbers[i] = lookupTween._fromNumbers[i] - value;
          tween._toNumbers[i] = 0;
        });
      }
      lookupTween._fromNumbers = toNumbers;
    }
    addChild(additiveTweenSiblings, tween, null, "_prevAdd", "_nextAdd");
  }
  return tween;
};
var removeTweenSliblings = (tween) => {
  const tweenComposition = tween._composition;
  if (tweenComposition !== compositionTypes.none) {
    const tweenTarget = tween.target;
    const tweenProperty = tween.property;
    const replaceTweensLookup = lookups._rep;
    const replaceTargetProps = replaceTweensLookup.get(tweenTarget);
    const tweenReplaceSiblings = replaceTargetProps[tweenProperty];
    removeChild(tweenReplaceSiblings, tween, "_prevRep", "_nextRep");
    if (tweenComposition === compositionTypes.blend) {
      const addTweensLookup = lookups._add;
      const addTargetProps = addTweensLookup.get(tweenTarget);
      if (!addTargetProps) return;
      const additiveTweenSiblings = addTargetProps[tweenProperty];
      const additiveAnimation = additive.animation;
      removeChild(additiveTweenSiblings, tween, "_prevAdd", "_nextAdd");
      const lookupTween = additiveTweenSiblings._head;
      if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
        removeChild(additiveTweenSiblings, lookupTween, "_prevAdd", "_nextAdd");
        removeChild(additiveAnimation, lookupTween);
        let shouldClean = true;
        for (let prop in addTargetProps) {
          if (addTargetProps[prop]._head) {
            shouldClean = false;
            break;
          }
        }
        if (shouldClean) {
          addTweensLookup.delete(tweenTarget);
        }
      }
    }
  }
  return tween;
};
var resetTimerProperties = (timer) => {
  timer.paused = true;
  timer.began = false;
  timer.completed = false;
  return timer;
};
var reviveTimer = (timer) => {
  if (!timer._cancelled) return timer;
  if (timer._hasChildren) {
    forEachChildren(timer, reviveTimer);
  } else {
    forEachChildren(timer, (tween) => {
      if (tween._composition !== compositionTypes.none) {
        composeTween(tween, getTweenSiblings(tween.target, tween.property));
      }
    });
  }
  timer._cancelled = 0;
  return timer;
};
var timerId = 0;
var Timer = class extends Clock {
  /**
   * @param {TimerParams} [parameters]
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   */
  constructor(parameters = {}, parent = null, parentPosition = 0) {
    super(0);
    const {
      id,
      delay,
      duration,
      reversed,
      alternate,
      loop,
      loopDelay,
      autoplay,
      frameRate,
      playbackRate,
      onComplete,
      onLoop,
      onPause,
      onBegin,
      onBeforeUpdate,
      onUpdate
    } = parameters;
    if (globals.scope) globals.scope.revertibles.push(this);
    const timerInitTime = parent ? 0 : engine._elapsedTime;
    const timerDefaults = parent ? parent.defaults : globals.defaults;
    const timerDelay = (
      /** @type {Number} */
      isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay
    );
    const timerDuration = isFnc(duration) || isUnd(duration) ? Infinity : +duration;
    const timerLoop = setValue(loop, timerDefaults.loop);
    const timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
    const timerIterationCount = timerLoop === true || timerLoop === Infinity || /** @type {Number} */
    timerLoop < 0 ? Infinity : (
      /** @type {Number} */
      timerLoop + 1
    );
    let offsetPosition = 0;
    if (parent) {
      offsetPosition = parentPosition;
    } else {
      let startTime = now();
      if (engine.paused) {
        engine.requestTick(startTime);
        startTime = engine._elapsedTime;
      }
      offsetPosition = startTime - engine._startTime;
    }
    this.id = !isUnd(id) ? id : ++timerId;
    this.parent = parent;
    this.duration = clampInfinity((timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay) || minValue;
    this.backwards = false;
    this.paused = true;
    this.began = false;
    this.completed = false;
    this.onBegin = onBegin || timerDefaults.onBegin;
    this.onBeforeUpdate = onBeforeUpdate || timerDefaults.onBeforeUpdate;
    this.onUpdate = onUpdate || timerDefaults.onUpdate;
    this.onLoop = onLoop || timerDefaults.onLoop;
    this.onPause = onPause || timerDefaults.onPause;
    this.onComplete = onComplete || timerDefaults.onComplete;
    this.iterationDuration = timerDuration;
    this.iterationCount = timerIterationCount;
    this._autoplay = parent ? false : setValue(autoplay, timerDefaults.autoplay);
    this._offset = offsetPosition;
    this._delay = timerDelay;
    this._loopDelay = timerLoopDelay;
    this._iterationTime = 0;
    this._currentIteration = 0;
    this._resolve = noop;
    this._running = false;
    this._reversed = +setValue(reversed, timerDefaults.reversed);
    this._reverse = this._reversed;
    this._cancelled = 0;
    this._alternate = setValue(alternate, timerDefaults.alternate);
    this._prev = null;
    this._next = null;
    this._elapsedTime = timerInitTime;
    this._startTime = timerInitTime;
    this._lastTime = timerInitTime;
    this._fps = setValue(frameRate, timerDefaults.frameRate);
    this._speed = setValue(playbackRate, timerDefaults.playbackRate);
  }
  get cancelled() {
    return !!this._cancelled;
  }
  /** @param {Boolean} cancelled  */
  set cancelled(cancelled) {
    cancelled ? this.cancel() : this.reset(1).play();
  }
  get currentTime() {
    return clamp(round(this._currentTime, globals.precision), -this._delay, this.duration);
  }
  /** @param {Number} time  */
  set currentTime(time) {
    const paused = this.paused;
    this.pause().seek(+time);
    if (!paused) this.resume();
  }
  get iterationCurrentTime() {
    return round(this._iterationTime, globals.precision);
  }
  /** @param {Number} time  */
  set iterationCurrentTime(time) {
    this.currentTime = this.iterationDuration * this._currentIteration + time;
  }
  get progress() {
    return clamp(round(this._currentTime / this.duration, 5), 0, 1);
  }
  /** @param {Number} progress  */
  set progress(progress) {
    this.currentTime = this.duration * progress;
  }
  get iterationProgress() {
    return clamp(round(this._iterationTime / this.iterationDuration, 5), 0, 1);
  }
  /** @param {Number} progress  */
  set iterationProgress(progress) {
    const iterationDuration = this.iterationDuration;
    this.currentTime = iterationDuration * this._currentIteration + iterationDuration * progress;
  }
  get currentIteration() {
    return this._currentIteration;
  }
  /** @param {Number} iterationCount  */
  set currentIteration(iterationCount) {
    this.currentTime = this.iterationDuration * clamp(+iterationCount, 0, this.iterationCount - 1);
  }
  get reversed() {
    return !!this._reversed;
  }
  /** @param {Boolean} reverse  */
  set reversed(reverse) {
    reverse ? this.reverse() : this.play();
  }
  get speed() {
    return super.speed;
  }
  /** @param {Number} playbackRate  */
  set speed(playbackRate) {
    super.speed = playbackRate;
    this.resetTime();
  }
  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  reset(internalRender = 0) {
    reviveTimer(this);
    if (this._reversed && !this._reverse) this.reversed = false;
    this._iterationTime = this.iterationDuration;
    tick(this, 0, 1, internalRender, tickModes.FORCE);
    resetTimerProperties(this);
    if (this._hasChildren) {
      forEachChildren(this, resetTimerProperties);
    }
    return this;
  }
  /**
   * @param  {Number} internalRender
   * @return {this}
   */
  init(internalRender = 0) {
    this.fps = this._fps;
    this.speed = this._speed;
    if (!internalRender && this._hasChildren) {
      tick(this, this.duration, 1, internalRender, tickModes.FORCE);
    }
    this.reset(internalRender);
    const autoplay = this._autoplay;
    if (autoplay === true) {
      this.resume();
    } else if (autoplay && !isUnd(
      /** @type {ScrollObserver} */
      autoplay.linked
    )) {
      autoplay.link(this);
    }
    return this;
  }
  /** @return {this} */
  resetTime() {
    const timeScale = 1 / (this._speed * engine._speed);
    this._startTime = now() - (this._currentTime + this._delay) * timeScale;
    return this;
  }
  /** @return {this} */
  pause() {
    if (this.paused) return this;
    this.paused = true;
    this.onPause(this);
    return this;
  }
  /** @return {this} */
  resume() {
    if (!this.paused) return this;
    this.paused = false;
    if (this.duration <= minValue && !this._hasChildren) {
      tick(this, minValue, 0, 0, tickModes.FORCE);
    } else {
      if (!this._running) {
        addChild(engine, this);
        engine._hasChildren = true;
        this._running = true;
      }
      this.resetTime();
      this._startTime -= 12;
      engine.wake();
    }
    return this;
  }
  /** @return {this} */
  restart() {
    return this.reset(0).resume();
  }
  /**
   * @param  {Number} time
   * @param  {Boolean|Number} [muteCallbacks]
   * @param  {Boolean|Number} [internalRender]
   * @return {this}
   */
  seek(time, muteCallbacks = 0, internalRender = 0) {
    reviveTimer(this);
    this.completed = false;
    const isPaused = this.paused;
    this.paused = true;
    tick(this, time + this._delay, ~~muteCallbacks, ~~internalRender, tickModes.AUTO);
    return isPaused ? this : this.resume();
  }
  /** @return {this} */
  alternate() {
    const reversed = this._reversed;
    const count = this.iterationCount;
    const duration = this.iterationDuration;
    const iterations = count === Infinity ? floor(maxValue / duration) : count;
    this._reversed = +(this._alternate && !(iterations % 2) ? reversed : !reversed);
    if (count === Infinity) {
      this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress;
    } else {
      this.seek(duration * iterations - this._currentTime);
    }
    this.resetTime();
    return this;
  }
  /** @return {this} */
  play() {
    if (this._reversed) this.alternate();
    return this.resume();
  }
  /** @return {this} */
  reverse() {
    if (!this._reversed) this.alternate();
    return this.resume();
  }
  // TODO: Move all the animation / tweens / children related code to Animation / Timeline
  /** @return {this} */
  cancel() {
    if (this._hasChildren) {
      forEachChildren(this, (child) => child.cancel(), true);
    } else {
      forEachChildren(this, removeTweenSliblings);
    }
    this._cancelled = 1;
    return this.pause();
  }
  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    const isSetter = newDuration <= minValue;
    this.duration = isSetter ? minValue : clampZero(clampInfinity(round(currentDuration * timeScale, 12)));
    this.iterationDuration = isSetter ? minValue : clampZero(clampInfinity(round(this.iterationDuration * timeScale, 12)));
    this._offset *= timeScale;
    this._delay *= timeScale;
    this._loopDelay *= timeScale;
    return this;
  }
  /**
    * Cancels the timer by seeking it back to 0 and reverting the attached scroller if necessary
    * @return {this}
    */
  revert() {
    tick(this, 0, 1, 0, tickModes.AUTO);
    const ap = (
      /** @type {ScrollObserver} */
      this._autoplay
    );
    if (ap && ap.linked && ap.linked === this) ap.revert();
    return this.cancel();
  }
  /**
    * Imediatly completes the timer, cancels it and triggers the onComplete callback
    * @return {this}
    */
  complete() {
    return this.seek(this.duration).cancel();
  }
  /**
   * @param  {Callback<this>} [callback]
   * @return {Promise}
   */
  then(callback = noop) {
    const then = this.then;
    const onResolve = () => {
      this.then = null;
      callback(this);
      this.then = then;
      this._resolve = noop;
    };
    return new Promise((r) => {
      this._resolve = () => r(onResolve());
      if (this.completed) this._resolve();
      return this;
    });
  }
};
var createTimer = (parameters) => new Timer(parameters, null, 0).init();
var none = (t) => t;
var calcBezier = (aT, aA1, aA2) => (((1 - 3 * aA2 + 3 * aA1) * aT + (3 * aA2 - 6 * aA1)) * aT + 3 * aA1) * aT;
var binarySubdivide = (aX, mX1, mX2) => {
  let aA = 0, aB = 1, currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (abs(currentX) > 1e-7 && ++i < 100);
  return currentT;
};
var cubicBezier = (mX1 = 0.5, mY1 = 0, mX2 = 0.5, mY2 = 1) => mX1 === mY1 && mX2 === mY2 ? none : (t) => t === 0 || t === 1 ? t : calcBezier(binarySubdivide(t, mX1, mX2), mY1, mY2);
var steps = (steps2 = 10, fromStart) => {
  const roundMethod = fromStart ? ceil : floor;
  return (t) => roundMethod(clamp(t, 0, 1) * steps2) * (1 / steps2);
};
var linear = (...args) => {
  const argsLength = args.length;
  if (!argsLength) return none;
  const totalPoints = argsLength - 1;
  const firstArg = args[0];
  const lastArg = args[totalPoints];
  const xPoints = [0];
  const yPoints = [parseNumber(firstArg)];
  for (let i = 1; i < totalPoints; i++) {
    const arg = args[i];
    const splitValue = isStr(arg) ? (
      /** @type {String} */
      arg.trim().split(" ")
    ) : [arg];
    const value = splitValue[0];
    const percent = splitValue[1];
    xPoints.push(!isUnd(percent) ? parseNumber(percent) / 100 : i / totalPoints);
    yPoints.push(parseNumber(value));
  }
  yPoints.push(parseNumber(lastArg));
  xPoints.push(1);
  return function easeLinear(t) {
    for (let i = 1, l = xPoints.length; i < l; i++) {
      const currentX = xPoints[i];
      if (t <= currentX) {
        const prevX = xPoints[i - 1];
        const prevY = yPoints[i - 1];
        return prevY + (yPoints[i] - prevY) * (t - prevX) / (currentX - prevX);
      }
    }
    return yPoints[yPoints.length - 1];
  };
};
var irregular = (length = 10, randomness = 1) => {
  const values = [0];
  const total = length - 1;
  for (let i = 1; i < total; i++) {
    const previousValue = values[i - 1];
    const spacing = i / total;
    const segmentEnd = (i + 1) / total;
    const randomVariation = spacing + (segmentEnd - spacing) * Math.random();
    const randomValue = spacing * (1 - randomness) + randomVariation * randomness;
    values.push(clamp(randomValue, previousValue, 1));
  }
  values.push(1);
  return linear(...values);
};
var halfPI = PI / 2;
var doublePI = PI * 2;
var easeInPower = (p = 1.68) => (t) => pow(t, +p);
var easeInFunctions = {
  [emptyString]: easeInPower,
  Quad: easeInPower(2),
  Cubic: easeInPower(3),
  Quart: easeInPower(4),
  Quint: easeInPower(5),
  /** @type {EasingFunction} */
  Sine: (t) => 1 - cos(t * halfPI),
  /** @type {EasingFunction} */
  Circ: (t) => 1 - sqrt(1 - t * t),
  /** @type {EasingFunction} */
  Expo: (t) => t ? pow(2, 10 * t - 10) : 0,
  /** @type {EasingFunction} */
  Bounce: (t) => {
    let pow2, b = 4;
    while (t < ((pow2 = pow(2, --b)) - 1) / 11) ;
    return 1 / pow(4, 3 - b) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t, 2);
  },
  /** @type {BackEasing} */
  Back: (overshoot = 1.70158) => (t) => (+overshoot + 1) * t * t * t - +overshoot * t * t,
  /** @type {ElasticEasing} */
  Elastic: (amplitude = 1, period = 0.3) => {
    const a = clamp(+amplitude, 1, 10);
    const p = clamp(+period, minValue, 2);
    const s = p / doublePI * asin(1 / a);
    const e = doublePI / p;
    return (t) => t === 0 || t === 1 ? t : -a * pow(2, -10 * (1 - t)) * sin((1 - t - s) * e);
  }
};
var easeTypes = {
  in: (easeIn) => (t) => easeIn(t),
  out: (easeIn) => (t) => 1 - easeIn(1 - t),
  inOut: (easeIn) => (t) => t < 0.5 ? easeIn(t * 2) / 2 : 1 - easeIn(t * -2 + 2) / 2,
  outIn: (easeIn) => (t) => t < 0.5 ? (1 - easeIn(1 - t * 2)) / 2 : (easeIn(t * 2 - 1) + 1) / 2
};
var parseEaseString = (string, easesFunctions, easesLookups) => {
  if (easesLookups[string]) return easesLookups[string];
  if (string.indexOf("(") <= -1) {
    const hasParams = easeTypes[string] || string.includes("Back") || string.includes("Elastic");
    const parsedFn = (
      /** @type {EasingFunction} */
      hasParams ? (
        /** @type {EasesFactory} */
        easesFunctions[string]()
      ) : easesFunctions[string]
    );
    return parsedFn ? easesLookups[string] = parsedFn : none;
  } else {
    const split = string.slice(0, -1).split("(");
    const parsedFn = (
      /** @type {EasesFactory} */
      easesFunctions[split[0]]
    );
    return parsedFn ? easesLookups[string] = parsedFn(...split[1].split(",")) : none;
  }
};
var eases = (() => {
  const list = { linear, irregular, steps, cubicBezier };
  for (let type in easeTypes) {
    for (let name in easeInFunctions) {
      const easeIn = easeInFunctions[name];
      const easeType = easeTypes[type];
      list[type + name] = /** @type {EasesFactory|EasingFunction} */
      name === emptyString || name === "Back" || name === "Elastic" ? (a, b) => easeType(
        /** @type {EasesFactory} */
        easeIn(a, b)
      ) : easeType(
        /** @type {EasingFunction} */
        easeIn
      );
    }
  }
  return (
    /** @type {EasesFunctions} */
    list
  );
})();
var JSEasesLookups = { linear: none };
var parseEasings = (ease) => isFnc(ease) ? ease : isStr(ease) ? parseEaseString(
  /** @type {String} */
  ease,
  eases,
  JSEasesLookups
) : none;
var propertyNamesCache = {};
var sanitizePropertyName = (propertyName, target, tweenType) => {
  if (tweenType === tweenTypes.TRANSFORM) {
    const t = shortTransforms.get(propertyName);
    return t ? t : propertyName;
  } else if (tweenType === tweenTypes.CSS || // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
  // but properties like "baseFrequency" should stay in lowerCamelCase
  tweenType === tweenTypes.ATTRIBUTE && (isSvg(target) && propertyName in /** @type {DOMTarget} */
  target.style)) {
    const cachedPropertyName = propertyNamesCache[propertyName];
    if (cachedPropertyName) {
      return cachedPropertyName;
    } else {
      const lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
      propertyNamesCache[propertyName] = lowerCaseName;
      return lowerCaseName;
    }
  } else {
    return propertyName;
  }
};
var angleUnitsMap = { "deg": 1, "rad": 180 / PI, "turn": 360 };
var convertedValuesCache = {};
var convertValueUnit = (el, decomposedValue, unit, force = false) => {
  const currentUnit = decomposedValue.u;
  const currentNumber = decomposedValue.n;
  if (decomposedValue.t === valueTypes.UNIT && currentUnit === unit) {
    return decomposedValue;
  }
  const cachedKey = currentNumber + currentUnit + unit;
  const cached = convertedValuesCache[cachedKey];
  if (!isUnd(cached) && !force) {
    decomposedValue.n = cached;
  } else {
    let convertedValue;
    if (currentUnit in angleUnitsMap) {
      convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
    } else {
      const baseline = 100;
      const tempEl = (
        /** @type {DOMTarget} */
        el.cloneNode()
      );
      const parentNode = el.parentNode;
      const parentEl = parentNode && parentNode !== doc ? parentNode : doc.body;
      parentEl.appendChild(tempEl);
      const elStyle = tempEl.style;
      elStyle.width = baseline + currentUnit;
      const currentUnitWidth = (
        /** @type {HTMLElement} */
        tempEl.offsetWidth || baseline
      );
      elStyle.width = baseline + unit;
      const newUnitWidth = (
        /** @type {HTMLElement} */
        tempEl.offsetWidth || baseline
      );
      const factor = currentUnitWidth / newUnitWidth;
      parentEl.removeChild(tempEl);
      convertedValue = factor * currentNumber;
    }
    decomposedValue.n = convertedValue;
    convertedValuesCache[cachedKey] = convertedValue;
  }
  decomposedValue.t === valueTypes.UNIT;
  decomposedValue.u = unit;
  return decomposedValue;
};
var cleanInlineStyles = (renderable) => {
  if (renderable._hasChildren) {
    forEachChildren(renderable, cleanInlineStyles, true);
  } else {
    const animation = (
      /** @type {JSAnimation} */
      renderable
    );
    animation.pause();
    forEachChildren(animation, (tween) => {
      const tweenProperty = tween.property;
      const tweenTarget = tween.target;
      if (tweenTarget[isDomSymbol]) {
        const targetStyle = (
          /** @type {DOMTarget} */
          tweenTarget.style
        );
        const originalInlinedValue = animation._inlineStyles[tweenProperty];
        if (tween._tweenType === tweenTypes.TRANSFORM) {
          const cachedTransforms = tweenTarget[transformsSymbol];
          if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
            delete cachedTransforms[tweenProperty];
          } else {
            cachedTransforms[tweenProperty] = originalInlinedValue;
          }
          if (tween._renderTransforms) {
            if (!Object.keys(cachedTransforms).length) {
              targetStyle.removeProperty("transform");
            } else {
              let str = emptyString;
              for (let key2 in cachedTransforms) {
                str += transformsFragmentStrings[key2] + cachedTransforms[key2] + ") ";
              }
              targetStyle.transform = str;
            }
          }
        } else {
          if (isUnd(originalInlinedValue) || originalInlinedValue === emptyString) {
            targetStyle.removeProperty(tweenProperty);
          } else {
            targetStyle[tweenProperty] = originalInlinedValue;
          }
        }
        if (animation._tail === tween) {
          animation.targets.forEach((t) => {
            if (t.getAttribute && t.getAttribute("style") === emptyString) {
              t.removeAttribute("style");
            }
          });
        }
      }
    });
  }
  return renderable;
};
var fromTargetObject = createDecomposedValueTargetObject();
var toTargetObject = createDecomposedValueTargetObject();
var toFunctionStore = { func: null };
var keyframesTargetArray = [null];
var fastSetValuesArray = [null, null];
var keyObjectTarget = { to: null };
var tweenId = 0;
var keyframes;
var key;
var generateKeyframes = (keyframes2, parameters) => {
  const properties = {};
  if (isArr(keyframes2)) {
    const propertyNames = [].concat(.../** @type {DurationKeyframes} */
    keyframes2.map((key2) => Object.keys(key2))).filter(isKey);
    for (let i = 0, l = propertyNames.length; i < l; i++) {
      const propName = propertyNames[i];
      const propArray = (
        /** @type {DurationKeyframes} */
        keyframes2.map((key2) => {
          const newKey = {};
          for (let p in key2) {
            const keyValue = (
              /** @type {TweenPropValue} */
              key2[p]
            );
            if (isKey(p)) {
              if (p === propName) {
                newKey.to = keyValue;
              }
            } else {
              newKey[p] = keyValue;
            }
          }
          return newKey;
        })
      );
      properties[propName] = /** @type {ArraySyntaxValue} */
      propArray;
    }
  } else {
    const totalDuration = (
      /** @type {Number} */
      setValue(parameters.duration, globals.defaults.duration)
    );
    const keys = Object.keys(keyframes2).map((key2) => {
      return { o: parseFloat(key2) / 100, p: keyframes2[key2] };
    }).sort((a, b) => a.o - b.o);
    keys.forEach((key2) => {
      const offset = key2.o;
      const prop = key2.p;
      for (let name in prop) {
        if (isKey(name)) {
          let propArray = (
            /** @type {Array} */
            properties[name]
          );
          if (!propArray) propArray = properties[name] = [];
          const duration = offset * totalDuration;
          let length = propArray.length;
          let prevKey = propArray[length - 1];
          const keyObj = { to: prop[name] };
          let durProgress = 0;
          for (let i = 0; i < length; i++) {
            durProgress += propArray[i].duration;
          }
          if (length === 1) {
            keyObj.from = prevKey.to;
          }
          if (prop.ease) {
            keyObj.ease = prop.ease;
          }
          keyObj.duration = duration - (length ? durProgress : 0);
          propArray.push(keyObj);
        }
      }
      return key2;
    });
    for (let name in properties) {
      const propArray = (
        /** @type {Array} */
        properties[name]
      );
      let prevEase;
      for (let i = 0, l = propArray.length; i < l; i++) {
        const prop = propArray[i];
        const currentEase = prop.ease;
        prop.ease = prevEase ? prevEase : void 0;
        prevEase = currentEase;
      }
      if (!propArray[0].duration) {
        propArray.shift();
      }
    }
  }
  return properties;
};
var JSAnimation = class extends Timer {
  /**
   * @param {TargetsParam} targets
   * @param {AnimationParams} parameters
   * @param {Timeline} [parent]
   * @param {Number} [parentPosition]
   * @param {Boolean} [fastSet=false]
   * @param {Number} [index=0]
   * @param {Number} [length=0]
   */
  constructor(targets, parameters, parent, parentPosition, fastSet = false, index = 0, length = 0) {
    super(
      /** @type {TimerParams&AnimationParams} */
      parameters,
      parent,
      parentPosition
    );
    const parsedTargets = registerTargets(targets);
    const targetsLength = parsedTargets.length;
    const kfParams = (
      /** @type {AnimationParams} */
      parameters.keyframes
    );
    const params = (
      /** @type {AnimationParams} */
      kfParams ? mergeObjects(generateKeyframes(
        /** @type {DurationKeyframes} */
        kfParams,
        parameters
      ), parameters) : parameters
    );
    const {
      delay,
      duration,
      ease,
      playbackEase,
      modifier,
      composition,
      onRender
    } = params;
    const animDefaults = parent ? parent.defaults : globals.defaults;
    const animaPlaybackEase = setValue(playbackEase, animDefaults.playbackEase);
    const animEase = animaPlaybackEase ? parseEasings(animaPlaybackEase) : null;
    const hasSpring = !isUnd(ease) && !isUnd(
      /** @type {Spring} */
      ease.ease
    );
    const tEasing = hasSpring ? (
      /** @type {Spring} */
      ease.ease
    ) : setValue(ease, animEase ? "linear" : animDefaults.ease);
    const tDuration = hasSpring ? (
      /** @type {Spring} */
      ease.duration
    ) : setValue(duration, animDefaults.duration);
    const tDelay = setValue(delay, animDefaults.delay);
    const tModifier = modifier || animDefaults.modifier;
    const tComposition = isUnd(composition) && targetsLength >= K ? compositionTypes.none : !isUnd(composition) ? composition : animDefaults.composition;
    const animInlineStyles = {};
    const absoluteOffsetTime = this._offset + (parent ? parent._offset : 0);
    let iterationDuration = NaN;
    let iterationDelay = NaN;
    let animationAnimationLength = 0;
    let shouldTriggerRender = 0;
    for (let targetIndex = 0; targetIndex < targetsLength; targetIndex++) {
      const target = parsedTargets[targetIndex];
      const ti = index || targetIndex;
      const tl = length || targetsLength;
      let lastTransformGroupIndex = NaN;
      let lastTransformGroupLength = NaN;
      for (let p in params) {
        if (isKey(p)) {
          const tweenType = getTweenType(target, p);
          const propName = sanitizePropertyName(p, target, tweenType);
          let propValue = params[p];
          const isPropValueArray = isArr(propValue);
          if (fastSet && !isPropValueArray) {
            fastSetValuesArray[0] = propValue;
            fastSetValuesArray[1] = propValue;
            propValue = fastSetValuesArray;
          }
          if (isPropValueArray) {
            const arrayLength = (
              /** @type {Array} */
              propValue.length
            );
            const isNotObjectValue = !isObj(propValue[0]);
            if (arrayLength === 2 && isNotObjectValue) {
              keyObjectTarget.to = /** @type {TweenParamValue} */
              /** @type {unknown} */
              propValue;
              keyframesTargetArray[0] = keyObjectTarget;
              keyframes = keyframesTargetArray;
            } else if (arrayLength > 2 && isNotObjectValue) {
              keyframes = [];
              propValue.forEach((v, i) => {
                if (!i) {
                  fastSetValuesArray[0] = v;
                } else if (i === 1) {
                  fastSetValuesArray[1] = v;
                  keyframes.push(fastSetValuesArray);
                } else {
                  keyframes.push(v);
                }
              });
            } else {
              keyframes = /** @type {Array.<TweenKeyValue>} */
              propValue;
            }
          } else {
            keyframesTargetArray[0] = propValue;
            keyframes = keyframesTargetArray;
          }
          let siblings = null;
          let prevTween = null;
          let firstTweenChangeStartTime = NaN;
          let lastTweenChangeEndTime = 0;
          let tweenIndex = 0;
          for (let l = keyframes.length; tweenIndex < l; tweenIndex++) {
            const keyframe = keyframes[tweenIndex];
            if (isObj(keyframe)) {
              key = keyframe;
            } else {
              keyObjectTarget.to = /** @type {TweenParamValue} */
              keyframe;
              key = keyObjectTarget;
            }
            toFunctionStore.func = null;
            const computedToValue = getFunctionValue(key.to, target, ti, tl, toFunctionStore);
            let tweenToValue;
            if (isObj(computedToValue) && !isUnd(computedToValue.to)) {
              key = computedToValue;
              tweenToValue = computedToValue.to;
            } else {
              tweenToValue = computedToValue;
            }
            const tweenFromValue = getFunctionValue(key.from, target, ti, tl);
            const keyEasing = key.ease;
            const hasSpring2 = !isUnd(keyEasing) && !isUnd(
              /** @type {Spring} */
              keyEasing.ease
            );
            const tweenEasing = hasSpring2 ? (
              /** @type {Spring} */
              keyEasing.ease
            ) : keyEasing || tEasing;
            const tweenDuration = hasSpring2 ? (
              /** @type {Spring} */
              keyEasing.duration
            ) : getFunctionValue(setValue(key.duration, l > 1 ? getFunctionValue(tDuration, target, ti, tl) / l : tDuration), target, ti, tl);
            const tweenDelay = getFunctionValue(setValue(key.delay, !tweenIndex ? tDelay : 0), target, ti, tl);
            const computedComposition = getFunctionValue(setValue(key.composition, tComposition), target, ti, tl);
            const tweenComposition = isNum(computedComposition) ? computedComposition : compositionTypes[computedComposition];
            const tweenModifier = key.modifier || tModifier;
            const hasFromvalue = !isUnd(tweenFromValue);
            const hasToValue = !isUnd(tweenToValue);
            const isFromToArray = isArr(tweenToValue);
            const isFromToValue = isFromToArray || hasFromvalue && hasToValue;
            const tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
            const absoluteStartTime = absoluteOffsetTime + tweenStartTime;
            if (!shouldTriggerRender && (hasFromvalue || isFromToArray)) shouldTriggerRender = 1;
            let prevSibling = prevTween;
            if (tweenComposition !== compositionTypes.none) {
              if (!siblings) siblings = getTweenSiblings(target, propName);
              let nextSibling = siblings._head;
              while (nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime) {
                prevSibling = nextSibling;
                nextSibling = nextSibling._nextRep;
                if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                  while (nextSibling) {
                    overrideTween(nextSibling);
                    nextSibling = nextSibling._nextRep;
                  }
                }
              }
            }
            if (isFromToValue) {
              decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[0], target, ti, tl) : tweenFromValue, fromTargetObject);
              decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[1], target, ti, tl, toFunctionStore) : tweenToValue, toTargetObject);
              if (fromTargetObject.t === valueTypes.NUMBER) {
                if (prevSibling) {
                  if (prevSibling._valueType === valueTypes.UNIT) {
                    fromTargetObject.t = valueTypes.UNIT;
                    fromTargetObject.u = prevSibling._unit;
                  }
                } else {
                  decomposeRawValue(
                    getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles),
                    decomposedOriginalValue
                  );
                  if (decomposedOriginalValue.t === valueTypes.UNIT) {
                    fromTargetObject.t = valueTypes.UNIT;
                    fromTargetObject.u = decomposedOriginalValue.u;
                  }
                }
              }
            } else {
              if (hasToValue) {
                decomposeRawValue(tweenToValue, toTargetObject);
              } else {
                if (prevTween) {
                  decomposeTweenValue(prevTween, toTargetObject);
                } else {
                  decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles), toTargetObject);
                }
              }
              if (hasFromvalue) {
                decomposeRawValue(tweenFromValue, fromTargetObject);
              } else {
                if (prevTween) {
                  decomposeTweenValue(prevTween, fromTargetObject);
                } else {
                  decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : (
                    // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                    getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles)
                  ), fromTargetObject);
                }
              }
            }
            if (fromTargetObject.o) {
              fromTargetObject.n = getRelativeValue(
                !prevSibling ? decomposeRawValue(
                  getOriginalAnimatableValue(target, propName, tweenType, animInlineStyles),
                  decomposedOriginalValue
                ).n : prevSibling._toNumber,
                fromTargetObject.n,
                fromTargetObject.o
              );
            }
            if (toTargetObject.o) {
              toTargetObject.n = getRelativeValue(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
            }
            if (fromTargetObject.t !== toTargetObject.t) {
              if (fromTargetObject.t === valueTypes.COMPLEX || toTargetObject.t === valueTypes.COMPLEX) {
                const complexValue = fromTargetObject.t === valueTypes.COMPLEX ? fromTargetObject : toTargetObject;
                const notComplexValue = fromTargetObject.t === valueTypes.COMPLEX ? toTargetObject : fromTargetObject;
                notComplexValue.t = valueTypes.COMPLEX;
                notComplexValue.s = cloneArray(complexValue.s);
                notComplexValue.d = complexValue.d.map(() => notComplexValue.n);
              } else if (fromTargetObject.t === valueTypes.UNIT || toTargetObject.t === valueTypes.UNIT) {
                const unitValue = fromTargetObject.t === valueTypes.UNIT ? fromTargetObject : toTargetObject;
                const notUnitValue = fromTargetObject.t === valueTypes.UNIT ? toTargetObject : fromTargetObject;
                notUnitValue.t = valueTypes.UNIT;
                notUnitValue.u = unitValue.u;
              } else if (fromTargetObject.t === valueTypes.COLOR || toTargetObject.t === valueTypes.COLOR) {
                const colorValue = fromTargetObject.t === valueTypes.COLOR ? fromTargetObject : toTargetObject;
                const notColorValue = fromTargetObject.t === valueTypes.COLOR ? toTargetObject : fromTargetObject;
                notColorValue.t = valueTypes.COLOR;
                notColorValue.s = colorValue.s;
                notColorValue.d = [0, 0, 0, 1];
              }
            }
            if (fromTargetObject.u !== toTargetObject.u) {
              let valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
              valueToConvert = convertValueUnit(
                /** @type {DOMTarget} */
                target,
                valueToConvert,
                toTargetObject.u ? toTargetObject.u : fromTargetObject.u,
                false
              );
            }
            if (toTargetObject.d && fromTargetObject.d && toTargetObject.d.length !== fromTargetObject.d.length) {
              const longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
              const shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
              shortestValue.d = longestValue.d.map((_, i) => isUnd(shortestValue.d[i]) ? 0 : shortestValue.d[i]);
              shortestValue.s = cloneArray(longestValue.s);
            }
            const tweenUpdateDuration = round(+tweenDuration || minValue, 12);
            const tween = {
              parent: this,
              id: tweenId++,
              property: propName,
              target,
              _value: null,
              _func: toFunctionStore.func,
              _ease: parseEasings(tweenEasing),
              _fromNumbers: cloneArray(fromTargetObject.d),
              _toNumbers: cloneArray(toTargetObject.d),
              _strings: cloneArray(toTargetObject.s),
              _fromNumber: fromTargetObject.n,
              _toNumber: toTargetObject.n,
              _numbers: cloneArray(fromTargetObject.d),
              // For additive tween and animatables
              _number: fromTargetObject.n,
              // For additive tween and animatables
              _unit: toTargetObject.u,
              _modifier: tweenModifier,
              _currentTime: 0,
              _startTime: tweenStartTime,
              _delay: +tweenDelay,
              _updateDuration: tweenUpdateDuration,
              _changeDuration: tweenUpdateDuration,
              _absoluteStartTime: absoluteStartTime,
              // NOTE: Investigate bit packing to stores ENUM / BOOL
              _tweenType: tweenType,
              _valueType: toTargetObject.t,
              _composition: tweenComposition,
              _isOverlapped: 0,
              _isOverridden: 0,
              _renderTransforms: 0,
              _prevRep: null,
              // For replaced tween
              _nextRep: null,
              // For replaced tween
              _prevAdd: null,
              // For additive tween
              _nextAdd: null,
              // For additive tween
              _prev: null,
              _next: null
            };
            if (tweenComposition !== compositionTypes.none) {
              composeTween(tween, siblings);
            }
            if (isNaN(firstTweenChangeStartTime)) {
              firstTweenChangeStartTime = tween._startTime;
            }
            lastTweenChangeEndTime = round(tweenStartTime + tweenUpdateDuration, 12);
            prevTween = tween;
            animationAnimationLength++;
            addChild(this, tween);
          }
          if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
            iterationDelay = firstTweenChangeStartTime;
          }
          if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
            iterationDuration = lastTweenChangeEndTime;
          }
          if (tweenType === tweenTypes.TRANSFORM) {
            lastTransformGroupIndex = animationAnimationLength - tweenIndex;
            lastTransformGroupLength = animationAnimationLength;
          }
        }
      }
      if (!isNaN(lastTransformGroupIndex)) {
        let i = 0;
        forEachChildren(this, (tween) => {
          if (i >= lastTransformGroupIndex && i < lastTransformGroupLength) {
            tween._renderTransforms = 1;
            if (tween._composition === compositionTypes.blend) {
              forEachChildren(additive.animation, (additiveTween) => {
                if (additiveTween.id === tween.id) {
                  additiveTween._renderTransforms = 1;
                }
              });
            }
          }
          i++;
        });
      }
    }
    if (!targetsLength) {
      console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
    }
    if (iterationDelay) {
      forEachChildren(this, (tween) => {
        if (!(tween._startTime - tween._delay)) {
          tween._delay -= iterationDelay;
        }
        tween._startTime -= iterationDelay;
      });
      iterationDuration -= iterationDelay;
    } else {
      iterationDelay = 0;
    }
    if (!iterationDuration) {
      iterationDuration = minValue;
      this.iterationCount = 0;
    }
    this.targets = parsedTargets;
    this.duration = iterationDuration === minValue ? minValue : clampInfinity((iterationDuration + this._loopDelay) * this.iterationCount - this._loopDelay) || minValue;
    this.onRender = onRender || animDefaults.onRender;
    this._ease = animEase;
    this._delay = iterationDelay;
    this.iterationDuration = iterationDuration;
    this._inlineStyles = animInlineStyles;
    if (!this._autoplay && shouldTriggerRender) this.onRender(this);
  }
  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    forEachChildren(this, (tween) => {
      tween._updateDuration = clampZero(round(tween._updateDuration * timeScale, 12));
      tween._changeDuration = clampZero(round(tween._changeDuration * timeScale, 12));
      tween._currentTime *= timeScale;
      tween._startTime *= timeScale;
      tween._absoluteStartTime *= timeScale;
    });
    return super.stretch(newDuration);
  }
  /**
   * @return {this}
   */
  refresh() {
    forEachChildren(this, (tween) => {
      const ogValue = getOriginalAnimatableValue(tween.target, tween.property, tween._tweenType);
      decomposeRawValue(ogValue, decomposedOriginalValue);
      tween._fromNumbers = cloneArray(decomposedOriginalValue.d);
      tween._fromNumber = decomposedOriginalValue.n;
      if (tween._func) {
        decomposeRawValue(tween._func(), toTargetObject);
        tween._toNumbers = cloneArray(toTargetObject.d);
        tween._strings = cloneArray(toTargetObject.s);
        tween._toNumber = toTargetObject.n;
      }
    });
    return this;
  }
  /**
   * Cancel the animation and revert all the values affected by this animation to their original state
   * @return {this}
   */
  revert() {
    super.revert();
    return cleanInlineStyles(this);
  }
  /**
   * @param  {Callback<this>} [callback]
   * @return {Promise}
   */
  then(callback) {
    return super.then(callback);
  }
};
var animate = (targets, parameters) => new JSAnimation(targets, parameters, null, 0, false).init();
var easingToLinear = (fn, samples = 100) => {
  const points = [];
  for (let i = 0; i <= samples; i++) points.push(fn(i / samples));
  return `linear(${points.join(", ")})`;
};
var WAAPIEasesLookups = {
  in: "ease-in",
  out: "ease-out",
  inOut: "ease-in-out"
};
var WAAPIeases = (() => {
  const list = {};
  for (let type in easeTypes) list[type] = (a) => easeTypes[type](easeInPower(a));
  return (
    /** @type {Record<String, EasingFunction>} */
    list
  );
})();
var parseWAAPIEasing = (ease) => {
  let parsedEase = WAAPIEasesLookups[ease];
  if (parsedEase) return parsedEase;
  parsedEase = "linear";
  if (isStr(ease)) {
    if (stringStartsWith(ease, "linear") || stringStartsWith(ease, "cubic-") || stringStartsWith(ease, "steps") || stringStartsWith(ease, "ease")) {
      parsedEase = ease;
    } else if (stringStartsWith(ease, "cubicB")) {
      parsedEase = toLowerCase(ease);
    } else {
      const parsed = parseEaseString(ease, WAAPIeases, WAAPIEasesLookups);
      if (isFnc(parsed)) parsedEase = parsed === none ? "linear" : easingToLinear(parsed);
    }
  } else if (isFnc(ease)) {
    const easing = easingToLinear(ease);
    if (easing) parsedEase = easing;
  } else if (
    /** @type {Spring} */
    ease.ease
  ) {
    parsedEase = easingToLinear(
      /** @type {Spring} */
      ease.ease
    );
  }
  return WAAPIEasesLookups[ease] = parsedEase;
};
var transformsShorthands = ["x", "y", "z"];
var commonDefaultPXProperties = [
  "perspective",
  "width",
  "height",
  "margin",
  "padding",
  "top",
  "right",
  "bottom",
  "left",
  "borderWidth",
  "fontSize",
  "borderRadius",
  ...transformsShorthands
];
var validIndividualTransforms = [...transformsShorthands, ...validTransforms.filter((t) => ["X", "Y", "Z"].some((axis) => t.endsWith(axis)))];
var transformsPropertiesRegistered = isBrowser && (isUnd(CSS) || !Object.hasOwnProperty.call(CSS, "registerProperty"));
var registerTransformsProperties = () => {
  validTransforms.forEach((t) => {
    const isSkew = stringStartsWith(t, "skew");
    const isScale = stringStartsWith(t, "scale");
    const isRotate = stringStartsWith(t, "rotate");
    const isTranslate = stringStartsWith(t, "translate");
    const isAngle = isRotate || isSkew;
    const syntax = isAngle ? "<angle>" : isScale ? "<number>" : isTranslate ? "<length-percentage>" : "*";
    CSS.registerProperty({
      name: "--" + t,
      syntax,
      inherits: false,
      initialValue: isTranslate ? "0px" : isAngle ? "0deg" : isScale ? "1" : "0"
    });
  });
  transformsPropertiesRegistered = true;
};
var WAAPIAnimationsLookups = {
  _head: null,
  _tail: null
};
var removeWAAPIAnimation = ($el, property, parent) => {
  let nextLookup = WAAPIAnimationsLookups._head;
  while (nextLookup) {
    const next = nextLookup._next;
    const matchTarget = nextLookup.$el === $el;
    const matchProperty = !property || nextLookup.property === property;
    const matchParent = !parent || nextLookup.parent === parent;
    if (matchTarget && matchProperty && matchParent) {
      const anim = nextLookup.animation;
      try {
        anim.commitStyles();
      } catch {
      }
      anim.cancel();
      removeChild(WAAPIAnimationsLookups, nextLookup);
      const lookupParent = nextLookup.parent;
      if (lookupParent) {
        lookupParent._completed++;
        if (lookupParent.animations.length === lookupParent._completed) {
          lookupParent.completed = true;
          if (!lookupParent.muteCallbacks) {
            lookupParent.paused = true;
            lookupParent.onComplete(lookupParent);
            lookupParent._resolve(lookupParent);
          }
        }
      }
    }
    nextLookup = next;
  }
};
var addWAAPIAnimation = (parent, $el, property, keyframes2, params) => {
  const animation = $el.animate(keyframes2, params);
  const animTotalDuration = params.delay + +params.duration * params.iterations;
  animation.playbackRate = parent._speed;
  if (parent.paused) animation.pause();
  if (parent.duration < animTotalDuration) {
    parent.duration = animTotalDuration;
    parent.controlAnimation = animation;
  }
  parent.animations.push(animation);
  removeWAAPIAnimation($el, property);
  addChild(WAAPIAnimationsLookups, { parent, animation, $el, property, _next: null, _prev: null });
  const handleRemove = () => {
    removeWAAPIAnimation($el, property, parent);
  };
  animation.onremove = handleRemove;
  animation.onfinish = handleRemove;
  return animation;
};
var normalizeTweenValue = (propName, value, $el, i, targetsLength) => {
  let v = getFunctionValue(
    /** @type {any} */
    value,
    $el,
    i,
    targetsLength
  );
  if (!isNum(v)) return v;
  if (commonDefaultPXProperties.includes(propName) || stringStartsWith(propName, "translate")) return `${v}px`;
  if (stringStartsWith(propName, "rotate") || stringStartsWith(propName, "skew")) return `${v}deg`;
  return `${v}`;
};
var parseIndividualTweenValue = ($el, propName, from, to, i, targetsLength) => {
  let tweenValue = "0";
  const computedTo = !isUnd(to) ? normalizeTweenValue(propName, to, $el, i, targetsLength) : getComputedStyle($el)[propName];
  if (!isUnd(from)) {
    const computedFrom = normalizeTweenValue(propName, from, $el, i, targetsLength);
    tweenValue = [computedFrom, computedTo];
  } else {
    tweenValue = isArr(to) ? to.map((v) => normalizeTweenValue(propName, v, $el, i, targetsLength)) : computedTo;
  }
  return tweenValue;
};
var WAAPIAnimation = class {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   */
  constructor(targets, params) {
    if (globals.scope) globals.scope.revertibles.push(this);
    if (!transformsPropertiesRegistered) registerTransformsProperties();
    const parsedTargets = registerTargets(targets);
    const targetsLength = parsedTargets.length;
    if (!targetsLength) {
      console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
    }
    const ease = setValue(params.ease, parseWAAPIEasing(globals.defaults.ease));
    const spring = (
      /** @type {Spring} */
      ease.ease && ease
    );
    const autoplay = setValue(params.autoplay, globals.defaults.autoplay);
    const scroll = autoplay && /** @type {ScrollObserver} */
    autoplay.link ? autoplay : false;
    const alternate = params.alternate && /** @type {Boolean} */
    params.alternate === true;
    const reversed = params.reversed && /** @type {Boolean} */
    params.reversed === true;
    const loop = setValue(params.loop, globals.defaults.loop);
    const iterations = (
      /** @type {Number} */
      loop === true || loop === Infinity ? Infinity : isNum(loop) ? loop + 1 : 1
    );
    const direction = alternate ? reversed ? "alternate-reverse" : "alternate" : reversed ? "reverse" : "normal";
    const fill = "forwards";
    const easing = parseWAAPIEasing(ease);
    const timeScale = globals.timeScale === 1 ? 1 : K;
    this.targets = parsedTargets;
    this.animations = [];
    this.controlAnimation = null;
    this.onComplete = params.onComplete || noop;
    this.duration = 0;
    this.muteCallbacks = false;
    this.completed = false;
    this.paused = !autoplay || scroll !== false;
    this.reversed = reversed;
    this.autoplay = autoplay;
    this._speed = setValue(params.playbackRate, globals.defaults.playbackRate);
    this._resolve = noop;
    this._completed = 0;
    this._inlineStyles = parsedTargets.map(($el) => $el.getAttribute("style"));
    parsedTargets.forEach(($el, i) => {
      const cachedTransforms = $el[transformsSymbol];
      const hasIndividualTransforms = validIndividualTransforms.some((t) => params.hasOwnProperty(t));
      const duration = (spring ? (
        /** @type {Spring} */
        spring.duration
      ) : getFunctionValue(setValue(params.duration, globals.defaults.duration), $el, i, targetsLength)) * timeScale;
      const delay = getFunctionValue(setValue(params.delay, globals.defaults.delay), $el, i, targetsLength) * timeScale;
      const composite = (
        /** @type {CompositeOperation} */
        setValue(params.composition, "replace")
      );
      for (let name in params) {
        if (!isKey(name)) continue;
        const keyframes2 = {};
        const tweenParams = { iterations, direction, fill, easing, duration, delay, composite };
        const propertyValue = params[name];
        const individualTransformProperty = hasIndividualTransforms ? validTransforms.includes(name) ? name : shortTransforms.get(name) : false;
        let parsedPropertyValue;
        if (isObj(propertyValue)) {
          const tweenOptions = (
            /** @type {WAAPITweenOptions} */
            propertyValue
          );
          const tweenOptionsEase = setValue(tweenOptions.ease, ease);
          const tweenOptionsSpring = (
            /** @type {Spring} */
            tweenOptionsEase.ease && tweenOptionsEase
          );
          const to = (
            /** @type {WAAPITweenOptions} */
            tweenOptions.to
          );
          const from = (
            /** @type {WAAPITweenOptions} */
            tweenOptions.from
          );
          tweenParams.duration = (tweenOptionsSpring ? (
            /** @type {Spring} */
            tweenOptionsSpring.duration
          ) : getFunctionValue(setValue(tweenOptions.duration, duration), $el, i, targetsLength)) * timeScale;
          tweenParams.delay = getFunctionValue(setValue(tweenOptions.delay, delay), $el, i, targetsLength) * timeScale;
          tweenParams.composite = /** @type {CompositeOperation} */
          setValue(tweenOptions.composition, composite);
          tweenParams.easing = parseWAAPIEasing(tweenOptionsEase);
          parsedPropertyValue = parseIndividualTweenValue($el, name, from, to, i, targetsLength);
          if (individualTransformProperty) {
            keyframes2[`--${individualTransformProperty}`] = parsedPropertyValue;
            cachedTransforms[individualTransformProperty] = parsedPropertyValue;
          } else {
            keyframes2[name] = parseIndividualTweenValue($el, name, from, to, i, targetsLength);
          }
          addWAAPIAnimation(this, $el, name, keyframes2, tweenParams);
          if (!isUnd(from)) {
            if (!individualTransformProperty) {
              $el.style[name] = keyframes2[name][0];
            } else {
              const key2 = `--${individualTransformProperty}`;
              $el.style.setProperty(key2, keyframes2[key2][0]);
            }
          }
        } else {
          parsedPropertyValue = isArr(propertyValue) ? propertyValue.map((v) => normalizeTweenValue(name, v, $el, i, targetsLength)) : normalizeTweenValue(
            name,
            /** @type {any} */
            propertyValue,
            $el,
            i,
            targetsLength
          );
          if (individualTransformProperty) {
            keyframes2[`--${individualTransformProperty}`] = parsedPropertyValue;
            cachedTransforms[individualTransformProperty] = parsedPropertyValue;
          } else {
            keyframes2[name] = parsedPropertyValue;
          }
          addWAAPIAnimation(this, $el, name, keyframes2, tweenParams);
        }
      }
      if (hasIndividualTransforms) {
        let transforms = emptyString;
        for (let t in cachedTransforms) {
          transforms += `${transformsFragmentStrings[t]}var(--${t})) `;
        }
        $el.style.transform = transforms;
      }
    });
    if (scroll) {
      this.autoplay.link(this);
    }
  }
  /**
   * @callback forEachCallback
   * @param {globalThis.Animation} animation
   */
  /**
   * @param  {forEachCallback|String} callback
   * @return {this}
   */
  forEach(callback) {
    const cb = isStr(callback) ? (a) => a[callback]() : callback;
    this.animations.forEach(cb);
    return this;
  }
  get speed() {
    return this._speed;
  }
  /** @param {Number} speed */
  set speed(speed) {
    this._speed = +speed;
    this.forEach((anim) => anim.playbackRate = speed);
  }
  get currentTime() {
    const controlAnimation = this.controlAnimation;
    const timeScale = globals.timeScale;
    return this.completed ? this.duration : controlAnimation ? +controlAnimation.currentTime * (timeScale === 1 ? 1 : timeScale) : 0;
  }
  /** @param {Number} time */
  set currentTime(time) {
    const t = time * (globals.timeScale === 1 ? 1 : K);
    this.forEach((anim) => anim.currentTime = t);
  }
  get progress() {
    return this.currentTime / this.duration;
  }
  /** @param {Number} progress */
  set progress(progress) {
    this.forEach((anim) => anim.currentTime = progress * this.duration || 0);
  }
  resume() {
    if (!this.paused) return this;
    this.paused = false;
    return this.forEach("play");
  }
  pause() {
    if (this.paused) return this;
    this.paused = true;
    return this.forEach("pause");
  }
  alternate() {
    this.reversed = !this.reversed;
    this.forEach("reverse");
    if (this.paused) this.forEach("pause");
    return this;
  }
  play() {
    if (this.reversed) this.alternate();
    return this.resume();
  }
  reverse() {
    if (!this.reversed) this.alternate();
    return this.resume();
  }
  /**
   * @param {Number} time
   * @param {Boolean} muteCallbacks
   */
  seek(time, muteCallbacks = false) {
    if (muteCallbacks) this.muteCallbacks = true;
    if (time < this.duration) this.completed = false;
    this.currentTime = time;
    this.muteCallbacks = false;
    if (this.paused) this.pause();
    return this;
  }
  restart() {
    this.completed = false;
    return this.seek(0, true).resume();
  }
  commitStyles() {
    return this.forEach("commitStyles");
  }
  complete() {
    return this.seek(this.duration);
  }
  cancel() {
    this.forEach("cancel");
    return this.pause();
  }
  revert() {
    this.cancel();
    this.targets.forEach(($el, i) => $el.setAttribute("style", this._inlineStyles[i]));
    return this;
  }
  /**
   * @param  {WAAPICallback} [callback]
   * @return {Promise}
   */
  then(callback = noop) {
    const then = this.then;
    const onResolve = () => {
      this.then = null;
      callback(this);
      this.then = then;
      this._resolve = noop;
    };
    return new Promise((r) => {
      this._resolve = () => r(onResolve());
      if (this.completed) this._resolve();
      return this;
    });
  }
};
var waapi = {
  /**
   * @param {DOMTargetsParam} targets
   * @param {WAAPIAnimationParams} params
   * @return {WAAPIAnimation}
   */
  animate: (targets, params) => new WAAPIAnimation(targets, params),
  convertEase: easingToLinear
};
var sync = (callback = noop) => {
  return new Timer({ duration: 1 * globals.timeScale, onComplete: callback }, null, 0).resume();
};
function getTargetValue(targetSelector, propName, unit) {
  const targets = registerTargets(targetSelector);
  if (!targets.length) return;
  const [target] = targets;
  const tweenType = getTweenType(target, propName);
  const normalizePropName = sanitizePropertyName(propName, target, tweenType);
  let originalValue = getOriginalAnimatableValue(target, normalizePropName);
  if (isUnd(unit)) {
    return originalValue;
  } else {
    decomposeRawValue(originalValue, decomposedOriginalValue);
    if (decomposedOriginalValue.t === valueTypes.NUMBER || decomposedOriginalValue.t === valueTypes.UNIT) {
      if (unit === false) {
        return decomposedOriginalValue.n;
      } else {
        const convertedValue = convertValueUnit(
          /** @type {DOMTarget} */
          target,
          decomposedOriginalValue,
          /** @type {String} */
          unit,
          false
        );
        return `${round(convertedValue.n, globals.precision)}${convertedValue.u}`;
      }
    }
  }
}
var setTargetValues = (targets, parameters) => {
  if (isUnd(parameters)) return;
  parameters.duration = minValue;
  parameters.composition = setValue(parameters.composition, compositionTypes.none);
  return new JSAnimation(targets, parameters, null, 0, true).resume();
};
var removeTargetsFromAnimation = (targetsArray, animation, propertyName) => {
  let tweensMatchesTargets = false;
  forEachChildren(animation, (tween) => {
    const tweenTarget = tween.target;
    if (targetsArray.includes(tweenTarget)) {
      const tweenName = tween.property;
      const tweenType = tween._tweenType;
      const normalizePropName = sanitizePropertyName(propertyName, tweenTarget, tweenType);
      if (!normalizePropName || normalizePropName && normalizePropName === tweenName) {
        if (tween.parent._tail === tween && tween._tweenType === tweenTypes.TRANSFORM && tween._prev && tween._prev._tweenType === tweenTypes.TRANSFORM) {
          tween._prev._renderTransforms = 1;
        }
        removeChild(animation, tween);
        removeTweenSliblings(tween);
        tweensMatchesTargets = true;
      }
    }
  }, true);
  return tweensMatchesTargets;
};
var remove = (targets, renderable, propertyName) => {
  const targetsArray = parseTargets(targets);
  const parent = (
    /** @type {Renderable|typeof engine} **/
    renderable ? renderable : engine
  );
  const waapiAnimation = renderable && /** @type {WAAPIAnimation} */
  renderable.controlAnimation && /** @type {WAAPIAnimation} */
  renderable;
  for (let i = 0, l = targetsArray.length; i < l; i++) {
    const $el = (
      /** @type {DOMTarget}  */
      targetsArray[i]
    );
    removeWAAPIAnimation($el, propertyName, waapiAnimation);
  }
  let removeMatches;
  if (parent._hasChildren) {
    let iterationDuration = 0;
    forEachChildren(parent, (child) => {
      if (!child._hasChildren) {
        removeMatches = removeTargetsFromAnimation(
          targetsArray,
          /** @type {JSAnimation} */
          child,
          propertyName
        );
        if (removeMatches && !child._head) {
          child.cancel();
          removeChild(parent, child);
        } else {
          const childTLOffset = child._offset + child._delay;
          const childDur = childTLOffset + child.duration;
          if (childDur > iterationDuration) {
            iterationDuration = childDur;
          }
        }
      }
      if (child._head) {
        remove(targets, child, propertyName);
      } else {
        child._hasChildren = false;
      }
    }, true);
    if (!isUnd(
      /** @type {Renderable} */
      parent.iterationDuration
    )) {
      parent.iterationDuration = iterationDuration;
    }
  } else {
    removeMatches = removeTargetsFromAnimation(
      targetsArray,
      /** @type {JSAnimation} */
      parent,
      propertyName
    );
  }
  if (removeMatches && !parent._head) {
    parent._hasChildren = false;
    if (
      /** @type {Renderable} */
      parent.cancel
    ) parent.cancel();
  }
  return targetsArray;
};
var random = (min, max2, decimalLength) => {
  const m = 10 ** (decimalLength || 0);
  return floor((Math.random() * (max2 - min + 1 / m) + min) * m) / m;
};
var randomPick = (items) => items[random(0, items.length - 1)];
var shuffle = (items) => {
  let m = items.length, t, i;
  while (m) {
    i = random(0, --m);
    t = items[m];
    items[m] = items[i];
    items[i] = t;
  }
  return items;
};
var roundPad = (v, decimalLength) => (+v).toFixed(decimalLength);
var padStart = (v, totalLength, padString) => `${v}`.padStart(totalLength, padString);
var padEnd = (v, totalLength, padString) => `${v}`.padEnd(totalLength, padString);
var wrap = (v, min, max2) => ((v - min) % (max2 - min) + (max2 - min)) % (max2 - min) + min;
var mapRange = (value, inLow, inHigh, outLow, outHigh) => outLow + (value - inLow) / (inHigh - inLow) * (outHigh - outLow);
var degToRad = (degrees) => degrees * PI / 180;
var radToDeg = (radians) => radians * 180 / PI;
var lerp = (start, end, amount, renderable) => {
  let dt = K / globals.defaults.frameRate;
  if (renderable !== false) {
    const ticker = (
      /** @type Renderable */
      renderable || engine._hasChildren && engine
    );
    if (ticker && ticker.deltaTime) {
      dt = ticker.deltaTime;
    }
  }
  const t = 1 - Math.exp(-amount * dt * 0.1);
  return !amount ? start : amount === 1 ? end : (1 - t) * start + t * end;
};
var curry = (fn, last = 0) => (...args) => last ? (v) => fn(...args, v) : (v) => fn(v, ...args);
var chain = (fn) => {
  return (...args) => {
    const result = fn(...args);
    return new Proxy(noop, {
      apply: (_, __, [v]) => result(v),
      get: (_, prop) => chain(
        /**@param {...Number|String} nextArgs */
        (...nextArgs) => {
          const nextResult = utils[prop](...nextArgs);
          return (v) => nextResult(result(v));
        }
      )
    });
  };
};
var makeChainable = (fn, right = 0) => (...args) => (args.length < fn.length ? chain(curry(fn, right)) : fn)(...args);
var utils = {
  $: registerTargets,
  get: getTargetValue,
  set: setTargetValues,
  remove,
  cleanInlineStyles,
  random,
  randomPick,
  shuffle,
  lerp,
  sync,
  clamp: (
    /** @type {typeof clamp & ChainedClamp} */
    makeChainable(clamp)
  ),
  round: (
    /** @type {typeof round & ChainedRound} */
    makeChainable(round)
  ),
  snap: (
    /** @type {typeof snap & ChainedSnap} */
    makeChainable(snap)
  ),
  wrap: (
    /** @type {typeof wrap & ChainedWrap} */
    makeChainable(wrap)
  ),
  interpolate: (
    /** @type {typeof interpolate & ChainedInterpolate} */
    makeChainable(interpolate, 1)
  ),
  mapRange: (
    /** @type {typeof mapRange & ChainedMapRange} */
    makeChainable(mapRange)
  ),
  roundPad: (
    /** @type {typeof roundPad & ChainedRoundPad} */
    makeChainable(roundPad)
  ),
  padStart: (
    /** @type {typeof padStart & ChainedPadStart} */
    makeChainable(padStart)
  ),
  padEnd: (
    /** @type {typeof padEnd & ChainedPadEnd} */
    makeChainable(padEnd)
  ),
  degToRad: (
    /** @type {typeof degToRad & ChainedDegToRad} */
    makeChainable(degToRad)
  ),
  radToDeg: (
    /** @type {typeof radToDeg & ChainedRadToDeg} */
    makeChainable(radToDeg)
  )
};
var getPrevChildOffset = (timeline, timePosition) => {
  if (stringStartsWith(timePosition, "<")) {
    const goToPrevAnimationOffset = timePosition[1] === "<";
    const prevAnimation = (
      /** @type {Tickable} */
      timeline._tail
    );
    const prevOffset = prevAnimation ? prevAnimation._offset + prevAnimation._delay : 0;
    return goToPrevAnimationOffset ? prevOffset : prevOffset + prevAnimation.duration;
  }
};
var parseTimelinePosition = (timeline, timePosition) => {
  let tlDuration = timeline.iterationDuration;
  if (tlDuration === minValue) tlDuration = 0;
  if (isUnd(timePosition)) return tlDuration;
  if (isNum(+timePosition)) return +timePosition;
  const timePosStr = (
    /** @type {String} */
    timePosition
  );
  const tlLabels = timeline ? timeline.labels : null;
  const hasLabels = !isNil(tlLabels);
  const prevOffset = getPrevChildOffset(timeline, timePosStr);
  const hasSibling = !isUnd(prevOffset);
  const matchedRelativeOperator = relativeValuesExecRgx.exec(timePosStr);
  if (matchedRelativeOperator) {
    const fullOperator = matchedRelativeOperator[0];
    const split = timePosStr.split(fullOperator);
    const labelOffset = hasLabels && split[0] ? tlLabels[split[0]] : tlDuration;
    const parsedOffset = hasSibling ? prevOffset : hasLabels ? labelOffset : tlDuration;
    const parsedNumericalOffset = +split[1];
    return getRelativeValue(parsedOffset, parsedNumericalOffset, fullOperator[0]);
  } else {
    return hasSibling ? prevOffset : hasLabels ? !isUnd(tlLabels[timePosStr]) ? tlLabels[timePosStr] : tlDuration : tlDuration;
  }
};
function getTimelineTotalDuration(tl) {
  return clampInfinity((tl.iterationDuration + tl._loopDelay) * tl.iterationCount - tl._loopDelay) || minValue;
}
function addTlChild(childParams, tl, timePosition, targets, index, length) {
  const isSetter = isNum(childParams.duration) && /** @type {Number} */
  childParams.duration <= minValue;
  const adjustedPosition = isSetter ? timePosition - minValue : timePosition;
  tick(tl, adjustedPosition, 1, 1, tickModes.AUTO);
  const tlChild = targets ? new JSAnimation(
    targets,
    /** @type {AnimationParams} */
    childParams,
    tl,
    adjustedPosition,
    false,
    index,
    length
  ) : new Timer(
    /** @type {TimerParams} */
    childParams,
    tl,
    adjustedPosition
  );
  tlChild.init(1);
  addChild(tl, tlChild);
  forEachChildren(tl, (child) => {
    const childTLOffset = child._offset + child._delay;
    const childDur = childTLOffset + child.duration;
    if (childDur > tl.iterationDuration) tl.iterationDuration = childDur;
  });
  tl.duration = getTimelineTotalDuration(tl);
  return tl;
}
var Timeline = class extends Timer {
  /**
   * @param {TimelineParams} [parameters]
   */
  constructor(parameters = {}) {
    super(
      /** @type {TimerParams&TimelineParams} */
      parameters,
      null,
      0
    );
    this.duration = 0;
    this.labels = {};
    const defaultsParams = parameters.defaults;
    const globalDefaults = globals.defaults;
    this.defaults = defaultsParams ? mergeObjects(defaultsParams, globalDefaults) : globalDefaults;
    this.onRender = parameters.onRender || globalDefaults.onRender;
    const tlPlaybackEase = setValue(parameters.playbackEase, globalDefaults.playbackEase);
    this._ease = tlPlaybackEase ? parseEasings(tlPlaybackEase) : null;
    this.iterationDuration = 0;
  }
  /**
   * @overload
   * @param {TargetsParam} a1
   * @param {AnimationParams} a2
   * @param {TimePosition} [a3]
   * @return {this}
   *
   * @overload
   * @param {TimerParams} a1
   * @param {TimePosition} [a2]
   * @return {this}
   *
   * @param {TargetsParam|TimerParams} a1
   * @param {AnimationParams|TimePosition} a2
   * @param {TimePosition} [a3]
   */
  add(a1, a2, a3) {
    const isAnim = isObj(a2);
    const isTimer = isObj(a1);
    if (isAnim || isTimer) {
      this._hasChildren = true;
      if (isAnim) {
        const childParams = (
          /** @type {AnimationParams} */
          a2
        );
        if (isFnc(a3)) {
          const staggeredPosition = (
            /** @type {Function} */
            a3
          );
          const parsedTargetsArray = parseTargets(
            /** @type {TargetsParam} */
            a1
          );
          const tlDuration = this.duration;
          const tlIterationDuration = this.iterationDuration;
          const id = childParams.id;
          let i = 0;
          const parsedLength = parsedTargetsArray.length;
          parsedTargetsArray.forEach((target) => {
            const staggeredChildParams = { ...childParams };
            this.duration = tlDuration;
            this.iterationDuration = tlIterationDuration;
            if (!isUnd(id)) staggeredChildParams.id = id + "-" + i;
            addTlChild(
              staggeredChildParams,
              this,
              staggeredPosition(target, i, parsedLength, this),
              target,
              i,
              parsedLength
            );
            i++;
          });
        } else {
          addTlChild(
            childParams,
            this,
            parseTimelinePosition(this, a3),
            /** @type {TargetsParam} */
            a1
          );
        }
      } else {
        addTlChild(
          /** @type TimerParams */
          a1,
          this,
          parseTimelinePosition(
            this,
            /** @type TimePosition */
            a2
          )
        );
      }
      return this.init(1);
    }
  }
  /**
   * @overload
   * @param {Tickable} [synced]
   * @param {TimePosition} [position]
   * @return {this}
   *
   * @overload
   * @param {globalThis.Animation} [synced]
   * @param {TimePosition} [position]
   * @return {this}
   *
   * @overload
   * @param {WAAPIAnimation} [synced]
   * @param {TimePosition} [position]
   * @return {this}
   *
   * @param {Tickable|WAAPIAnimation|globalThis.Animation} [synced]
   * @param {TimePosition} [position]
   */
  sync(synced, position) {
    if (isUnd(synced) || synced && isUnd(synced.pause)) return this;
    synced.pause();
    const duration = +/** @type {globalThis.Animation} */
    (synced.effect ? (
      /** @type {globalThis.Animation} */
      synced.effect.getTiming().duration
    ) : (
      /** @type {Tickable} */
      synced.duration
    ));
    return this.add(synced, { currentTime: [0, duration], duration, ease: "linear" }, position);
  }
  /**
   * @param  {TargetsParam} targets
   * @param  {AnimationParams} parameters
   * @param  {TimePosition} [position]
   * @return {this}
   */
  set(targets, parameters, position) {
    if (isUnd(parameters)) return this;
    parameters.duration = minValue;
    parameters.composition = compositionTypes.replace;
    return this.add(targets, parameters, position);
  }
  /**
   * @param {Callback<Timer>} callback
   * @param {TimePosition} [position]
   * @return {this}
   */
  call(callback, position) {
    if (isUnd(callback) || callback && !isFnc(callback)) return this;
    return this.add({ duration: 0, onComplete: () => callback(this) }, position);
  }
  /**
   * @param {String} labelName
   * @param {TimePosition} [position]
   * @return {this}
   *
   */
  label(labelName, position) {
    if (isUnd(labelName) || labelName && !isStr(labelName)) return this;
    this.labels[labelName] = parseTimelinePosition(
      this,
      /** @type TimePosition */
      position
    );
    return this;
  }
  /**
   * @param  {TargetsParam} targets
   * @param  {String} [propertyName]
   * @return {this}
   */
  remove(targets, propertyName) {
    remove(targets, this, propertyName);
    return this;
  }
  /**
   * @param  {Number} newDuration
   * @return {this}
   */
  stretch(newDuration) {
    const currentDuration = this.duration;
    if (currentDuration === clampZero(newDuration)) return this;
    const timeScale = newDuration / currentDuration;
    const labels = this.labels;
    forEachChildren(this, (child) => {
      child.stretch(child.duration * timeScale);
    });
    for (let labelName in labels) {
      labels[labelName] *= timeScale;
    }
    return super.stretch(newDuration);
  }
  /**
   * @return {this}
   */
  refresh() {
    forEachChildren(this, (child) => {
      if (child.refresh) child.refresh();
    });
    return this;
  }
  /**
   * @return {this}
   */
  revert() {
    super.revert();
    forEachChildren(this, (child) => child.revert, true);
    return cleanInlineStyles(this);
  }
  /**
   * @param  {Callback<this>} [callback]
   * @return {Promise}
   */
  then(callback) {
    return super.then(callback);
  }
};
var createTimeline = (parameters) => new Timeline(parameters).init();
var Animatable = class {
  /**
   * @param {TargetsParam} targets
   * @param {AnimatableParams} parameters
   */
  constructor(targets, parameters) {
    if (globals.scope) globals.scope.revertibles.push(this);
    const globalParams = {};
    const properties = {};
    this.targets = [];
    this.animations = {};
    if (isUnd(targets) || isUnd(parameters)) return;
    for (let propName in parameters) {
      const paramValue = parameters[propName];
      if (isKey(propName)) {
        properties[propName] = paramValue;
      } else {
        globalParams[propName] = paramValue;
      }
    }
    for (let propName in properties) {
      const propValue = properties[propName];
      const isObjValue = isObj(propValue);
      let propParams = {};
      let to = "+=0";
      if (isObjValue) {
        const unit = propValue.unit;
        if (isStr(unit)) to += unit;
      } else {
        propParams.duration = propValue;
      }
      propParams[propName] = isObjValue ? mergeObjects({ to }, propValue) : to;
      const animParams = mergeObjects(globalParams, propParams);
      animParams.composition = compositionTypes.replace;
      animParams.autoplay = false;
      const animation = this.animations[propName] = new JSAnimation(targets, animParams, null, 0, false).init();
      if (!this.targets.length) this.targets.push(...animation.targets);
      this[propName] = (to2, duration, ease) => {
        const tween = (
          /** @type {Tween} */
          animation._head
        );
        if (isUnd(to2) && tween) {
          const numbers = tween._numbers;
          if (numbers && numbers.length) {
            return numbers;
          } else {
            return tween._modifier(tween._number);
          }
        } else {
          forEachChildren(animation, (tween2) => {
            if (isArr(to2)) {
              for (let i = 0, l = (
                /** @type {Array} */
                to2.length
              ); i < l; i++) {
                if (!isUnd(tween2._numbers[i])) {
                  tween2._fromNumbers[i] = /** @type {Number} */
                  tween2._modifier(tween2._numbers[i]);
                  tween2._toNumbers[i] = to2[i];
                }
              }
            } else {
              tween2._fromNumber = /** @type {Number} */
              tween2._modifier(tween2._number);
              tween2._toNumber = /** @type {Number} */
              to2;
            }
            if (!isUnd(ease)) tween2._ease = parseEasings(ease);
            tween2._currentTime = 0;
          });
          if (!isUnd(duration)) animation.stretch(duration);
          animation.reset(1).resume();
          return this;
        }
      };
    }
  }
  revert() {
    for (let propName in this.animations) {
      this[propName] = noop;
      this.animations[propName].revert();
    }
    this.animations = {};
    this.targets.length = 0;
    return this;
  }
};
var createAnimatable = (targets, parameters) => (
  /** @type {AnimatableObject} */
  new Animatable(targets, parameters)
);
var Spring = class {
  /**
   * @param {SpringParams} [parameters]
   */
  constructor(parameters = {}) {
    this.timeStep = 0.02;
    this.restThreshold = 5e-4;
    this.restDuration = 200;
    this.maxDuration = 6e4;
    this.maxRestSteps = this.restDuration / this.timeStep / K;
    this.maxIterations = this.maxDuration / this.timeStep / K;
    this.m = clamp(setValue(parameters.mass, 1), 0, K);
    this.s = clamp(setValue(parameters.stiffness, 100), 1, K);
    this.d = clamp(setValue(parameters.damping, 10), 0.1, K);
    this.v = clamp(setValue(parameters.velocity, 0), -1e3, K);
    this.w0 = 0;
    this.zeta = 0;
    this.wd = 0;
    this.b = 0;
    this.solverDuration = 0;
    this.duration = 0;
    this.compute();
    this.ease = (t) => t === 0 || t === 1 ? t : this.solve(t * this.solverDuration);
  }
  /** @type {EasingFunction} */
  solve(time) {
    const { zeta, w0, wd, b } = this;
    let t = time;
    if (zeta < 1) {
      t = exp(-t * zeta * w0) * (1 * cos(wd * t) + b * sin(wd * t));
    } else {
      t = (1 + b * t) * exp(-t * w0);
    }
    return 1 - t;
  }
  compute() {
    const { maxRestSteps, maxIterations, restThreshold, timeStep, m, d, s, v } = this;
    const w0 = this.w0 = clamp(sqrt(s / m), minValue, K);
    const zeta = this.zeta = d / (2 * sqrt(s * m));
    const wd = this.wd = zeta < 1 ? w0 * sqrt(1 - zeta * zeta) : 0;
    this.b = zeta < 1 ? (zeta * w0 + -v) / wd : -v + w0;
    let solverTime = 0;
    let restSteps = 0;
    let iterations = 0;
    while (restSteps < maxRestSteps && iterations < maxIterations) {
      if (abs(1 - this.solve(solverTime)) < restThreshold) {
        restSteps++;
      } else {
        restSteps = 0;
      }
      this.solverDuration = solverTime;
      solverTime += timeStep;
      iterations++;
    }
    this.duration = round(this.solverDuration * K, 0) * globals.timeScale;
  }
  get mass() {
    return this.m;
  }
  set mass(v) {
    this.m = clamp(setValue(v, 1), 0, K);
    this.compute();
  }
  get stiffness() {
    return this.s;
  }
  set stiffness(v) {
    this.s = clamp(setValue(v, 100), 1, K);
    this.compute();
  }
  get damping() {
    return this.d;
  }
  set damping(v) {
    this.d = clamp(setValue(v, 10), 0.1, K);
    this.compute();
  }
  get velocity() {
    return this.v;
  }
  set velocity(v) {
    this.v = clamp(setValue(v, 0), -1e3, K);
    this.compute();
  }
};
var createSpring = (parameters) => new Spring(parameters);
var preventDefault = (e) => {
  if (e.cancelable) e.preventDefault();
};
var DOMProxy = class {
  /** @param {Object} el */
  constructor(el) {
    this.el = el;
    this.zIndex = 0;
    this.parentElement = null;
    this.classList = {
      add: noop,
      remove: noop
    };
  }
  get x() {
    return this.el.x || 0;
  }
  set x(v) {
    this.el.x = v;
  }
  get y() {
    return this.el.y || 0;
  }
  set y(v) {
    this.el.y = v;
  }
  get width() {
    return this.el.width || 0;
  }
  set width(v) {
    this.el.width = v;
  }
  get height() {
    return this.el.height || 0;
  }
  set height(v) {
    this.el.height = v;
  }
  getBoundingClientRect() {
    return {
      top: this.y,
      right: this.x,
      bottom: this.y + this.height,
      left: this.x + this.width
    };
  }
};
var Transforms = class {
  /**
   * @param {DOMTarget|DOMProxy} $el
   */
  constructor($el) {
    this.$el = $el;
    this.inlineTransforms = [];
    this.point = new DOMPoint();
    this.inversedMatrix = this.getMatrix().inverse();
  }
  /**
   * @param {Number} x
   * @param {Number} y
   * @return {DOMPoint}
   */
  normalizePoint(x, y) {
    this.point.x = x;
    this.point.y = y;
    return this.point.matrixTransform(this.inversedMatrix);
  }
  /**
   * @callback TraverseParentsCallback
   * @param {DOMTarget} $el
   * @param {Number} i
   */
  /**
   * @param {TraverseParentsCallback} cb
   */
  traverseUp(cb) {
    let $el = (
      /** @type {DOMTarget|Document} */
      this.$el.parentElement
    ), i = 0;
    while ($el && $el !== doc) {
      cb(
        /** @type {DOMTarget} */
        $el,
        i
      );
      $el = /** @type {DOMTarget} */
      $el.parentElement;
      i++;
    }
  }
  getMatrix() {
    const matrix = new DOMMatrix();
    this.traverseUp(($el) => {
      const transformValue = getComputedStyle($el).transform;
      if (transformValue) {
        const elMatrix = new DOMMatrix(transformValue);
        matrix.preMultiplySelf(elMatrix);
      }
    });
    return matrix;
  }
  remove() {
    this.traverseUp(($el, i) => {
      this.inlineTransforms[i] = $el.style.transform;
      $el.style.transform = "none";
    });
  }
  revert() {
    this.traverseUp(($el, i) => {
      const ct = this.inlineTransforms[i];
      if (ct === "") {
        $el.style.removeProperty("transform");
      } else {
        $el.style.transform = ct;
      }
    });
  }
};
var parseDraggableFunctionParameter = (value, draggable) => value && isFnc(value) ? (
  /** @type {Function} */
  value(draggable)
) : value;
var zIndex = 0;
var Draggable = class {
  /**
   * @param {TargetsParam} target
   * @param {DraggableParams} [parameters]
   */
  constructor(target, parameters = {}) {
    if (!target) return;
    if (globals.scope) globals.scope.revertibles.push(this);
    const paramX = parameters.x;
    const paramY = parameters.y;
    const trigger = parameters.trigger;
    const modifier = parameters.modifier;
    const ease = parameters.releaseEase;
    const customEase = ease && parseEasings(ease);
    const hasSpring = !isUnd(ease) && !isUnd(
      /** @type {Spring} */
      ease.ease
    );
    const xProp = (
      /** @type {String} */
      isObj(paramX) && !isUnd(
        /** @type {Object} */
        paramX.mapTo
      ) ? (
        /** @type {Object} */
        paramX.mapTo
      ) : "translateX"
    );
    const yProp = (
      /** @type {String} */
      isObj(paramY) && !isUnd(
        /** @type {Object} */
        paramY.mapTo
      ) ? (
        /** @type {Object} */
        paramY.mapTo
      ) : "translateY"
    );
    const container = parseDraggableFunctionParameter(parameters.container, this);
    this.containerArray = isArr(container) ? container : null;
    this.$container = /** @type {HTMLElement} */
    container && !this.containerArray ? parseTargets(
      /** @type {DOMTarget} */
      container
    )[0] : doc.body;
    this.useWin = this.$container === doc.body;
    this.$scrollContainer = this.useWin ? win : this.$container;
    this.$target = /** @type {HTMLElement} */
    isObj(target) ? new DOMProxy(target) : parseTargets(target)[0];
    this.$trigger = /** @type {HTMLElement} */
    parseTargets(trigger ? trigger : target)[0];
    this.fixed = getTargetValue(this.$target, "position") === "fixed";
    this.isFinePointer = true;
    this.containerPadding = [0, 0, 0, 0];
    this.containerFriction = 0;
    this.releaseContainerFriction = 0;
    this.snapX = 0;
    this.snapY = 0;
    this.scrollSpeed = 0;
    this.scrollThreshold = 0;
    this.dragSpeed = 0;
    this.maxVelocity = 0;
    this.minVelocity = 0;
    this.velocityMultiplier = 0;
    this.cursor = false;
    this.releaseXSpring = hasSpring ? (
      /** @type {Spring} */
      ease
    ) : createSpring({
      mass: setValue(parameters.releaseMass, 1),
      stiffness: setValue(parameters.releaseStiffness, 80),
      damping: setValue(parameters.releaseDamping, 20)
    });
    this.releaseYSpring = hasSpring ? (
      /** @type {Spring} */
      ease
    ) : createSpring({
      mass: setValue(parameters.releaseMass, 1),
      stiffness: setValue(parameters.releaseStiffness, 80),
      damping: setValue(parameters.releaseDamping, 20)
    });
    this.releaseEase = customEase || eases.outQuint;
    this.hasReleaseSpring = hasSpring;
    this.onGrab = parameters.onGrab || noop;
    this.onDrag = parameters.onDrag || noop;
    this.onRelease = parameters.onRelease || noop;
    this.onUpdate = parameters.onUpdate || noop;
    this.onSettle = parameters.onSettle || noop;
    this.onSnap = parameters.onSnap || noop;
    this.onResize = parameters.onResize || noop;
    this.onAfterResize = parameters.onAfterResize || noop;
    this.disabled = [0, 0];
    const animatableParams = {};
    if (modifier) animatableParams.modifier = modifier;
    if (isUnd(paramX) || paramX === true) {
      animatableParams[xProp] = 0;
    } else if (isObj(paramX)) {
      const paramXObject = (
        /** @type {DraggableAxisParam} */
        paramX
      );
      const animatableXParams = {};
      if (paramXObject.modifier) animatableXParams.modifier = paramXObject.modifier;
      if (paramXObject.composition) animatableXParams.composition = paramXObject.composition;
      animatableParams[xProp] = animatableXParams;
    } else if (paramX === false) {
      animatableParams[xProp] = 0;
      this.disabled[0] = 1;
    }
    if (isUnd(paramY) || paramY === true) {
      animatableParams[yProp] = 0;
    } else if (isObj(paramY)) {
      const paramYObject = (
        /** @type {DraggableAxisParam} */
        paramY
      );
      const animatableYParams = {};
      if (paramYObject.modifier) animatableYParams.modifier = paramYObject.modifier;
      if (paramYObject.composition) animatableYParams.composition = paramYObject.composition;
      animatableParams[yProp] = animatableYParams;
    } else if (paramY === false) {
      animatableParams[yProp] = 0;
      this.disabled[1] = 1;
    }
    this.animate = /** @type {AnimatableObject} */
    new Animatable(this.$target, animatableParams);
    this.xProp = xProp;
    this.yProp = yProp;
    this.destX = 0;
    this.destY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    this.scroll = { x: 0, y: 0 };
    this.coords = [this.x, this.y, 0, 0];
    this.snapped = [0, 0];
    this.pointer = [0, 0, 0, 0, 0, 0, 0, 0];
    this.scrollView = [0, 0];
    this.dragArea = [0, 0, 0, 0];
    this.containerBounds = [-1e12, maxValue, maxValue, -1e12];
    this.scrollBounds = [0, 0, 0, 0];
    this.targetBounds = [0, 0, 0, 0];
    this.window = [0, 0];
    this.velocityStack = [0, 0, 0];
    this.velocityStackIndex = 0;
    this.velocityTime = now();
    this.velocity = 0;
    this.angle = 0;
    this.cursorStyles = null;
    this.triggerStyles = null;
    this.bodyStyles = null;
    this.targetStyles = null;
    this.touchActionStyles = null;
    this.transforms = new Transforms(this.$target);
    this.overshootCoords = { x: 0, y: 0 };
    this.overshootXTicker = new Timer({ autoplay: false }, null, 0).init();
    this.overshootYTicker = new Timer({ autoplay: false }, null, 0).init();
    this.updateTicker = new Timer({ autoplay: false }, null, 0).init();
    this.overshootXTicker.onUpdate = () => {
      if (this.disabled[0]) return;
      this.updated = true;
      this.manual = true;
      this.animate[this.xProp](this.overshootCoords.x, 0);
    };
    this.overshootXTicker.onComplete = () => {
      if (this.disabled[0]) return;
      this.manual = false;
      this.animate[this.xProp](this.overshootCoords.x, 0);
    };
    this.overshootYTicker.onUpdate = () => {
      if (this.disabled[1]) return;
      this.updated = true;
      this.manual = true;
      this.animate[this.yProp](this.overshootCoords.y, 0);
    };
    this.overshootYTicker.onComplete = () => {
      if (this.disabled[1]) return;
      this.manual = false;
      this.animate[this.yProp](this.overshootCoords.y, 0);
    };
    this.updateTicker.onUpdate = () => this.update();
    this.contained = !isUnd(container);
    this.manual = false;
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.enabled = false;
    this.initialized = false;
    this.activeProp = this.disabled[0] ? yProp : xProp;
    this.animate.animations[this.activeProp].onRender = () => {
      const hasUpdated = this.updated;
      const hasMoved = this.grabbed && hasUpdated;
      const hasReleased = !hasMoved && this.released;
      const x = this.x;
      const y = this.y;
      const dx = x - this.coords[2];
      const dy = y - this.coords[3];
      this.deltaX = dx;
      this.deltaY = dy;
      this.coords[2] = x;
      this.coords[3] = y;
      if (hasUpdated) {
        this.onUpdate(this);
      }
      if (!hasReleased) {
        this.updated = false;
      } else {
        this.computeVelocity(dx, dy);
        this.angle = atan2(dy, dx);
      }
    };
    this.animate.animations[this.activeProp].onComplete = () => {
      if (!this.grabbed && this.released) {
        this.released = false;
      }
      if (!this.manual) {
        this.deltaX = 0;
        this.deltaY = 0;
        this.velocity = 0;
        this.velocityStack[0] = 0;
        this.velocityStack[1] = 0;
        this.velocityStack[2] = 0;
        this.velocityStackIndex = 0;
        this.onSettle(this);
      }
    };
    this.resizeTicker = new Timer({
      autoplay: false,
      duration: 150 * globals.timeScale,
      onComplete: () => {
        this.onResize(this);
        this.refresh();
        this.onAfterResize(this);
      }
    }).init();
    this.parameters = parameters;
    this.resizeObserver = new ResizeObserver(() => {
      if (this.initialized) {
        this.resizeTicker.restart();
      } else {
        this.initialized = true;
      }
    });
    this.enable();
    this.refresh();
    this.resizeObserver.observe(this.$container);
    if (!isObj(target)) this.resizeObserver.observe(this.$target);
  }
  /**
   * @param  {Number} dx
   * @param  {Number} dy
   * @return {Number}
   */
  computeVelocity(dx, dy) {
    const prevTime = this.velocityTime;
    const curTime = now();
    const elapsed = curTime - prevTime;
    if (elapsed < 17) return this.velocity;
    this.velocityTime = curTime;
    const velocityStack = this.velocityStack;
    const vMul = this.velocityMultiplier;
    const minV = this.minVelocity;
    const maxV = this.maxVelocity;
    const vi = this.velocityStackIndex;
    velocityStack[vi] = round(clamp(sqrt(dx * dx + dy * dy) / elapsed * vMul, minV, maxV), 5);
    const velocity = max(velocityStack[0], velocityStack[1], velocityStack[2]);
    this.velocity = velocity;
    this.velocityStackIndex = (vi + 1) % 3;
    return velocity;
  }
  /**
   * @param {Number}  x
   * @param {Boolean} [muteUpdateCallback]
   * @return {this}
   */
  setX(x, muteUpdateCallback = false) {
    if (this.disabled[0]) return;
    const v = round(x, 5);
    this.overshootXTicker.pause();
    this.manual = true;
    this.updated = !muteUpdateCallback;
    this.destX = v;
    this.snapped[0] = snap(v, this.snapX);
    this.animate[this.xProp](v, 0);
    this.manual = false;
    return this;
  }
  /**
   * @param {Number}  y
   * @param {Boolean} [muteUpdateCallback]
   * @return {this}
   */
  setY(y, muteUpdateCallback = false) {
    if (this.disabled[1]) return;
    const v = round(y, 5);
    this.overshootYTicker.pause();
    this.manual = true;
    this.updated = !muteUpdateCallback;
    this.destY = v;
    this.snapped[1] = snap(v, this.snapY);
    this.animate[this.yProp](v, 0);
    this.manual = false;
    return this;
  }
  get x() {
    return round(
      /** @type {Number} */
      this.animate[this.xProp](),
      globals.precision
    );
  }
  set x(x) {
    this.setX(x, false);
  }
  get y() {
    return round(
      /** @type {Number} */
      this.animate[this.yProp](),
      globals.precision
    );
  }
  set y(y) {
    this.setY(y, false);
  }
  get progressX() {
    return mapRange(this.x, this.containerBounds[3], this.containerBounds[1], 0, 1);
  }
  set progressX(x) {
    this.setX(mapRange(x, 0, 1, this.containerBounds[3], this.containerBounds[1]), false);
  }
  get progressY() {
    return mapRange(this.y, this.containerBounds[0], this.containerBounds[2], 0, 1);
  }
  set progressY(y) {
    this.setY(mapRange(y, 0, 1, this.containerBounds[0], this.containerBounds[2]), false);
  }
  updateScrollCoords() {
    const sx = round(this.useWin ? win.scrollX : this.$container.scrollLeft, 0);
    const sy = round(this.useWin ? win.scrollY : this.$container.scrollTop, 0);
    const [cpt, cpr, cpb, cpl] = this.containerPadding;
    const threshold = this.scrollThreshold;
    this.scroll.x = sx;
    this.scroll.y = sy;
    this.scrollBounds[0] = sy - this.targetBounds[0] + cpt - threshold;
    this.scrollBounds[1] = sx - this.targetBounds[1] - cpr + threshold;
    this.scrollBounds[2] = sy - this.targetBounds[2] - cpb + threshold;
    this.scrollBounds[3] = sx - this.targetBounds[3] + cpl - threshold;
  }
  updateBoundingValues() {
    const $container = this.$container;
    const cx = this.x;
    const cy = this.y;
    const cx2 = this.coords[2];
    const cy2 = this.coords[3];
    this.coords[2] = 0;
    this.coords[3] = 0;
    this.setX(0, true);
    this.setY(0, true);
    this.transforms.remove();
    const iw = this.window[0] = win.innerWidth;
    const ih = this.window[1] = win.innerHeight;
    const uw = this.useWin;
    const sw = $container.scrollWidth;
    const sh = $container.scrollHeight;
    const fx = this.fixed;
    const transformContainerRect = $container.getBoundingClientRect();
    const [cpt, cpr, cpb, cpl] = this.containerPadding;
    this.dragArea[0] = uw ? 0 : transformContainerRect.left;
    this.dragArea[1] = uw ? 0 : transformContainerRect.top;
    this.scrollView[0] = uw ? clamp(sw, iw, sw) : sw;
    this.scrollView[1] = uw ? clamp(sh, ih, sh) : sh;
    this.updateScrollCoords();
    const { width, height, left, top, right, bottom } = $container.getBoundingClientRect();
    this.dragArea[2] = round(uw ? clamp(width, iw, iw) : width, 0);
    this.dragArea[3] = round(uw ? clamp(height, ih, ih) : height, 0);
    const containerOverflow = getTargetValue($container, "overflow");
    const visibleOverflow = containerOverflow === "visible";
    const hiddenOverflow = containerOverflow === "hidden";
    this.canScroll = fx ? false : this.contained && ($container === doc.body && visibleOverflow || !hiddenOverflow && !visibleOverflow) && (sw > this.dragArea[2] + cpl - cpr || sh > this.dragArea[3] + cpt - cpb) && (!this.containerArray || this.containerArray && !isArr(this.containerArray));
    if (this.contained) {
      const sx = this.scroll.x;
      const sy = this.scroll.y;
      const canScroll = this.canScroll;
      const targetRect = this.$target.getBoundingClientRect();
      const hiddenLeft = canScroll ? uw ? 0 : $container.scrollLeft : 0;
      const hiddenTop = canScroll ? uw ? 0 : $container.scrollTop : 0;
      const hiddenRight = canScroll ? this.scrollView[0] - hiddenLeft - width : 0;
      const hiddenBottom = canScroll ? this.scrollView[1] - hiddenTop - height : 0;
      this.targetBounds[0] = round(targetRect.top + sy - (uw ? 0 : top), 0);
      this.targetBounds[1] = round(targetRect.right + sx - (uw ? iw : right), 0);
      this.targetBounds[2] = round(targetRect.bottom + sy - (uw ? ih : bottom), 0);
      this.targetBounds[3] = round(targetRect.left + sx - (uw ? 0 : left), 0);
      if (this.containerArray) {
        this.containerBounds[0] = this.containerArray[0] + cpt;
        this.containerBounds[1] = this.containerArray[1] - cpr;
        this.containerBounds[2] = this.containerArray[2] - cpb;
        this.containerBounds[3] = this.containerArray[3] + cpl;
      } else {
        this.containerBounds[0] = -round(targetRect.top - (fx ? clamp(top, 0, ih) : top) + hiddenTop - cpt, 0);
        this.containerBounds[1] = -round(targetRect.right - (fx ? clamp(right, 0, iw) : right) - hiddenRight + cpr, 0);
        this.containerBounds[2] = -round(targetRect.bottom - (fx ? clamp(bottom, 0, ih) : bottom) - hiddenBottom + cpb, 0);
        this.containerBounds[3] = -round(targetRect.left - (fx ? clamp(left, 0, iw) : left) + hiddenLeft - cpl, 0);
      }
    }
    this.transforms.revert();
    this.coords[2] = cx2;
    this.coords[3] = cy2;
    this.setX(cx, true);
    this.setY(cy, true);
  }
  /**
   * Returns 0 if not OB, 1 if x is OB, 2 if y is OB, 3 if both x and y are OB
   *
   * @param  {Array} bounds
   * @param  {Number} x
   * @param  {Number} y
   * @return {Number}
   */
  isOutOfBounds(bounds, x, y) {
    if (!this.contained) return 0;
    const [bt, br, bb, bl] = bounds;
    const [dx, dy] = this.disabled;
    const obx = !dx && x < bl || !dx && x > br;
    const oby = !dy && y < bt || !dy && y > bb;
    return obx && !oby ? 1 : !obx && oby ? 2 : obx && oby ? 3 : 0;
  }
  refresh() {
    const params = this.parameters;
    const paramX = params.x;
    const paramY = params.y;
    const container = parseDraggableFunctionParameter(params.container, this);
    const cp = parseDraggableFunctionParameter(params.containerPadding, this) || 0;
    const containerPadding = (
      /** @type {[Number, Number, Number, Number]} */
      isArr(cp) ? cp : [cp, cp, cp, cp]
    );
    const cx = this.x;
    const cy = this.y;
    const parsedCursorStyles = parseDraggableFunctionParameter(params.cursor, this);
    const cursorStyles = { onHover: "grab", onGrab: "grabbing" };
    if (parsedCursorStyles) {
      const { onHover, onGrab } = (
        /** @type {DraggableCursorParams} */
        parsedCursorStyles
      );
      if (onHover) cursorStyles.onHover = onHover;
      if (onGrab) cursorStyles.onGrab = onGrab;
    }
    this.containerArray = isArr(container) ? container : null;
    this.$container = /** @type {HTMLElement} */
    container && !this.containerArray ? parseTargets(
      /** @type {DOMTarget} */
      container
    )[0] : doc.body;
    this.useWin = this.$container === doc.body;
    this.$scrollContainer = this.useWin ? win : this.$container;
    this.isFinePointer = matchMedia("(pointer:fine)").matches;
    this.containerPadding = setValue(containerPadding, [0, 0, 0, 0]);
    this.containerFriction = clamp(setValue(parseDraggableFunctionParameter(params.containerFriction, this), 0.8), 0, 1);
    this.releaseContainerFriction = clamp(setValue(parseDraggableFunctionParameter(params.releaseContainerFriction, this), this.containerFriction), 0, 1);
    this.snapX = parseDraggableFunctionParameter(isObj(paramX) && !isUnd(paramX.snap) ? paramX.snap : params.snap, this);
    this.snapY = parseDraggableFunctionParameter(isObj(paramY) && !isUnd(paramY.snap) ? paramY.snap : params.snap, this);
    this.scrollSpeed = setValue(parseDraggableFunctionParameter(params.scrollSpeed, this), 1.5);
    this.scrollThreshold = setValue(parseDraggableFunctionParameter(params.scrollThreshold, this), 20);
    this.dragSpeed = setValue(parseDraggableFunctionParameter(params.dragSpeed, this), 1);
    this.minVelocity = setValue(parseDraggableFunctionParameter(params.minVelocity, this), 0);
    this.maxVelocity = setValue(parseDraggableFunctionParameter(params.maxVelocity, this), 50);
    this.velocityMultiplier = setValue(parseDraggableFunctionParameter(params.velocityMultiplier, this), 1);
    this.cursor = parsedCursorStyles === false ? false : cursorStyles;
    this.updateBoundingValues();
    const [bt, br, bb, bl] = this.containerBounds;
    this.setX(clamp(cx, bl, br), true);
    this.setY(clamp(cy, bt, bb), true);
  }
  update() {
    this.updateScrollCoords();
    if (this.canScroll) {
      const [cpt, cpr, cpb, cpl] = this.containerPadding;
      const [sw, sh] = this.scrollView;
      const daw = this.dragArea[2];
      const dah = this.dragArea[3];
      const csx = this.scroll.x;
      const csy = this.scroll.y;
      const nsw = this.$container.scrollWidth;
      const nsh = this.$container.scrollHeight;
      const csw = this.useWin ? clamp(nsw, this.window[0], nsw) : nsw;
      const csh = this.useWin ? clamp(nsh, this.window[1], nsh) : nsh;
      const swd = sw - csw;
      const shd = sh - csh;
      if (this.dragged && swd > 0) {
        this.coords[0] -= swd;
        this.scrollView[0] = csw;
      }
      if (this.dragged && shd > 0) {
        this.coords[1] -= shd;
        this.scrollView[1] = csh;
      }
      const s = this.scrollSpeed * 10;
      const threshold = this.scrollThreshold;
      const [x, y] = this.coords;
      const [st, sr, sb, sl] = this.scrollBounds;
      const t = round(clamp((y - st + cpt) / threshold, -1, 0) * s, 0);
      const r = round(clamp((x - sr - cpr) / threshold, 0, 1) * s, 0);
      const b = round(clamp((y - sb - cpb) / threshold, 0, 1) * s, 0);
      const l = round(clamp((x - sl + cpl) / threshold, -1, 0) * s, 0);
      if (t || b || l || r) {
        const [nx, ny] = this.disabled;
        let scrollX = csx;
        let scrollY = csy;
        if (!nx) {
          scrollX = round(clamp(csx + (l || r), 0, sw - daw), 0);
          this.coords[0] -= csx - scrollX;
        }
        if (!ny) {
          scrollY = round(clamp(csy + (t || b), 0, sh - dah), 0);
          this.coords[1] -= csy - scrollY;
        }
        if (this.useWin) {
          this.$scrollContainer.scrollBy(-(csx - scrollX), -(csy - scrollY));
        } else {
          this.$scrollContainer.scrollTo(scrollX, scrollY);
        }
      }
    }
    const [ct, cr, cb, cl] = this.containerBounds;
    const [px1, py1, px2, py2, px3, py3] = this.pointer;
    this.coords[0] += (px1 - px3) * this.dragSpeed;
    this.coords[1] += (py1 - py3) * this.dragSpeed;
    this.pointer[4] = px1;
    this.pointer[5] = py1;
    const [cx, cy] = this.coords;
    const [sx, sy] = this.snapped;
    const cf = (1 - this.containerFriction) * this.dragSpeed;
    this.setX(cx > cr ? cr + (cx - cr) * cf : cx < cl ? cl + (cx - cl) * cf : cx, false);
    this.setY(cy > cb ? cb + (cy - cb) * cf : cy < ct ? ct + (cy - ct) * cf : cy, false);
    this.computeVelocity(px1 - px3, py1 - py3);
    this.angle = atan2(py1 - py2, px1 - px2);
    const [nsx, nsy] = this.snapped;
    if (nsx !== sx && this.snapX || nsy !== sy && this.snapY) {
      this.onSnap(this);
    }
  }
  stop() {
    this.updateTicker.pause();
    this.overshootXTicker.pause();
    this.overshootYTicker.pause();
    for (let prop in this.animate.animations) this.animate.animations[prop].pause();
    remove(this, null, "x");
    remove(this, null, "y");
    remove(this, null, "progressX");
    remove(this, null, "progressY");
    remove(this.scroll);
    remove(this.overshootCoords);
    return this;
  }
  /**
   * @param {Number} [duration]
   * @param {Number} [gap]
   * @param {EasingParam} [ease]
   * @return {this}
   */
  scrollInView(duration, gap = 0, ease = eases.inOutQuad) {
    this.updateScrollCoords();
    const x = this.destX;
    const y = this.destY;
    const scroll = this.scroll;
    const scrollBounds = this.scrollBounds;
    const canScroll = this.canScroll;
    if (!this.containerArray && this.isOutOfBounds(scrollBounds, x, y)) {
      const [st, sr, sb, sl] = scrollBounds;
      const t = round(clamp(y - st, -1e12, 0), 0);
      const r = round(clamp(x - sr, 0, maxValue), 0);
      const b = round(clamp(y - sb, 0, maxValue), 0);
      const l = round(clamp(x - sl, -1e12, 0), 0);
      new JSAnimation(scroll, {
        x: round(scroll.x + (l ? l - gap : r ? r + gap : 0), 0),
        y: round(scroll.y + (t ? t - gap : b ? b + gap : 0), 0),
        duration: isUnd(duration) ? 350 * globals.timeScale : duration,
        ease,
        onUpdate: () => {
          this.canScroll = false;
          this.$scrollContainer.scrollTo(scroll.x, scroll.y);
        }
      }).init().then(() => {
        this.canScroll = canScroll;
      });
    }
    return this;
  }
  handleHover() {
    if (this.isFinePointer && this.cursor && !this.cursorStyles) {
      this.cursorStyles = setTargetValues(this.$trigger, {
        cursor: (
          /** @type {DraggableCursorParams} */
          this.cursor.onHover
        )
      });
    }
  }
  /**
   * @param  {Number} [duration]
   * @param  {Number} [gap]
   * @param  {EasingParam} [ease]
   * @return {this}
   */
  animateInView(duration, gap = 0, ease = eases.inOutQuad) {
    this.stop();
    this.updateBoundingValues();
    const x = this.x;
    const y = this.y;
    const [cpt, cpr, cpb, cpl] = this.containerPadding;
    const bt = this.scroll.y - this.targetBounds[0] + cpt + gap;
    const br = this.scroll.x - this.targetBounds[1] - cpr - gap;
    const bb = this.scroll.y - this.targetBounds[2] - cpb - gap;
    const bl = this.scroll.x - this.targetBounds[3] + cpl + gap;
    const ob = this.isOutOfBounds([bt, br, bb, bl], x, y);
    if (ob) {
      const [disabledX, disabledY] = this.disabled;
      const destX = clamp(snap(x, this.snapX), bl, br);
      const destY = clamp(snap(y, this.snapY), bt, bb);
      const dur = isUnd(duration) ? 350 * globals.timeScale : duration;
      if (!disabledX && (ob === 1 || ob === 3)) this.animate[this.xProp](destX, dur, ease);
      if (!disabledY && (ob === 2 || ob === 3)) this.animate[this.yProp](destY, dur, ease);
    }
    return this;
  }
  /**
   * @param {MouseEvent|TouchEvent} e
   */
  handleDown(e) {
    const $eTarget = (
      /** @type {HTMLElement} */
      e.target
    );
    if (this.grabbed || /** @type {HTMLInputElement}  */
    $eTarget.type === "range") return;
    e.stopPropagation();
    this.grabbed = true;
    this.released = false;
    this.stop();
    this.updateBoundingValues();
    const touches = (
      /** @type {TouchEvent} */
      e.changedTouches
    );
    const eventX = touches ? touches[0].clientX : (
      /** @type {MouseEvent} */
      e.clientX
    );
    const eventY = touches ? touches[0].clientY : (
      /** @type {MouseEvent} */
      e.clientY
    );
    const { x, y } = this.transforms.normalizePoint(eventX, eventY);
    const [ct, cr, cb, cl] = this.containerBounds;
    const cf = (1 - this.containerFriction) * this.dragSpeed;
    const cx = this.x;
    const cy = this.y;
    this.coords[0] = this.coords[2] = !cf ? cx : cx > cr ? cr + (cx - cr) / cf : cx < cl ? cl + (cx - cl) / cf : cx;
    this.coords[1] = this.coords[3] = !cf ? cy : cy > cb ? cb + (cy - cb) / cf : cy < ct ? ct + (cy - ct) / cf : cy;
    this.pointer[0] = x;
    this.pointer[1] = y;
    this.pointer[2] = x;
    this.pointer[3] = y;
    this.pointer[4] = x;
    this.pointer[5] = y;
    this.pointer[6] = x;
    this.pointer[7] = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.velocity = 0;
    this.velocityStack[0] = 0;
    this.velocityStack[1] = 0;
    this.velocityStack[2] = 0;
    this.velocityStackIndex = 0;
    this.angle = 0;
    if (this.targetStyles) {
      this.targetStyles.revert();
      this.targetStyles = null;
    }
    const z = (
      /** @type {Number} */
      getTargetValue(this.$target, "zIndex", false)
    );
    zIndex = (z > zIndex ? z : zIndex) + 1;
    this.targetStyles = setTargetValues(this.$target, { zIndex });
    if (this.triggerStyles) {
      this.triggerStyles.revert();
      this.triggerStyles = null;
    }
    if (this.cursorStyles) {
      this.cursorStyles.revert();
      this.cursorStyles = null;
    }
    if (this.isFinePointer && this.cursor) {
      this.bodyStyles = setTargetValues(doc.body, {
        cursor: (
          /** @type {DraggableCursorParams} */
          this.cursor.onGrab
        )
      });
    }
    this.scrollInView(100, 0, eases.out(3));
    this.onGrab(this);
    doc.addEventListener("touchmove", this);
    doc.addEventListener("touchend", this);
    doc.addEventListener("touchcancel", this);
    doc.addEventListener("mousemove", this);
    doc.addEventListener("mouseup", this);
    doc.addEventListener("selectstart", this);
  }
  /**
   * @param {MouseEvent|TouchEvent} e
   */
  handleMove(e) {
    if (!this.grabbed) return;
    const touches = (
      /** @type {TouchEvent} */
      e.changedTouches
    );
    const eventX = touches ? touches[0].clientX : (
      /** @type {MouseEvent} */
      e.clientX
    );
    const eventY = touches ? touches[0].clientY : (
      /** @type {MouseEvent} */
      e.clientY
    );
    const { x, y } = this.transforms.normalizePoint(eventX, eventY);
    const movedX = x - this.pointer[6];
    const movedY = y - this.pointer[7];
    let $parent = (
      /** @type {HTMLElement} */
      e.target
    );
    let isAtTop = false;
    let isAtBottom = false;
    let canTouchScroll = false;
    while (touches && $parent && $parent !== this.$trigger) {
      const overflowY = getTargetValue($parent, "overflow-y");
      if (overflowY !== "hidden" && overflowY !== "visible") {
        const { scrollTop, scrollHeight, clientHeight } = $parent;
        if (scrollHeight > clientHeight) {
          canTouchScroll = true;
          isAtTop = scrollTop <= 3;
          isAtBottom = scrollTop >= scrollHeight - clientHeight - 3;
          break;
        }
      }
      $parent = /** @type {HTMLElement} */
      $parent.parentNode;
    }
    if (canTouchScroll && (!isAtTop && !isAtBottom || isAtTop && movedY < 0 || isAtBottom && movedY > 0)) {
      this.pointer[0] = x;
      this.pointer[1] = y;
      this.pointer[2] = x;
      this.pointer[3] = y;
      this.pointer[4] = x;
      this.pointer[5] = y;
      this.pointer[6] = x;
      this.pointer[7] = y;
    } else {
      preventDefault(e);
      if (!this.triggerStyles) this.triggerStyles = setTargetValues(this.$trigger, { pointerEvents: "none" });
      this.$trigger.addEventListener("touchstart", preventDefault, { passive: false });
      this.$trigger.addEventListener("touchmove", preventDefault, { passive: false });
      this.$trigger.addEventListener("touchend", preventDefault);
      if (!this.disabled[0] && abs(movedX) > 3 || !this.disabled[1] && abs(movedY) > 3) {
        this.updateTicker.resume();
        this.pointer[2] = this.pointer[0];
        this.pointer[3] = this.pointer[1];
        this.pointer[0] = x;
        this.pointer[1] = y;
        this.dragged = true;
        this.released = false;
        this.onDrag(this);
      }
    }
  }
  handleUp() {
    if (!this.grabbed) return;
    this.updateTicker.pause();
    if (this.triggerStyles) {
      this.triggerStyles.revert();
      this.triggerStyles = null;
    }
    if (this.bodyStyles) {
      this.bodyStyles.revert();
      this.bodyStyles = null;
    }
    const [disabledX, disabledY] = this.disabled;
    const [px1, py1, px2, py2, px3, py3] = this.pointer;
    const [ct, cr, cb, cl] = this.containerBounds;
    const [sx, sy] = this.snapped;
    const springX = this.releaseXSpring;
    const springY = this.releaseYSpring;
    const releaseEase = this.releaseEase;
    const hasReleaseSpring = this.hasReleaseSpring;
    const overshootCoords = this.overshootCoords;
    const cx = this.x;
    const cy = this.y;
    const pv = this.computeVelocity(px1 - px3, py1 - py3);
    const pa = this.angle = atan2(py1 - py2, px1 - px2);
    const ds = pv * 150;
    const cf = (1 - this.releaseContainerFriction) * this.dragSpeed;
    const nx = cx + cos(pa) * ds;
    const ny = cy + sin(pa) * ds;
    const bx = nx > cr ? cr + (nx - cr) * cf : nx < cl ? cl + (nx - cl) * cf : nx;
    const by = ny > cb ? cb + (ny - cb) * cf : ny < ct ? ct + (ny - ct) * cf : ny;
    const dx = this.destX = clamp(round(snap(bx, this.snapX), 5), cl, cr);
    const dy = this.destY = clamp(round(snap(by, this.snapY), 5), ct, cb);
    const ob = this.isOutOfBounds(this.containerBounds, nx, ny);
    let durationX = 0;
    let durationY = 0;
    let easeX = releaseEase;
    let easeY = releaseEase;
    let longestReleaseDuration = 0;
    overshootCoords.x = cx;
    overshootCoords.y = cy;
    if (!disabledX) {
      const directionX = dx === cr ? cx > cr ? -1 : 1 : cx < cl ? -1 : 1;
      const distanceX = round(cx - dx, 0);
      springX.velocity = disabledY && hasReleaseSpring ? distanceX ? ds * directionX / abs(distanceX) : 0 : pv;
      const { ease, duration, restDuration } = springX;
      durationX = cx === dx ? 0 : hasReleaseSpring ? duration : duration - restDuration * globals.timeScale;
      if (hasReleaseSpring) easeX = ease;
      if (durationX > longestReleaseDuration) longestReleaseDuration = durationX;
    }
    if (!disabledY) {
      const directionY = dy === cb ? cy > cb ? -1 : 1 : cy < ct ? -1 : 1;
      const distanceY = round(cy - dy, 0);
      springY.velocity = disabledX && hasReleaseSpring ? distanceY ? ds * directionY / abs(distanceY) : 0 : pv;
      const { ease, duration, restDuration } = springY;
      durationY = cy === dy ? 0 : hasReleaseSpring ? duration : duration - restDuration * globals.timeScale;
      if (hasReleaseSpring) easeY = ease;
      if (durationY > longestReleaseDuration) longestReleaseDuration = durationY;
    }
    if (!hasReleaseSpring && ob && cf && (durationX || durationY)) {
      const composition = compositionTypes.blend;
      new JSAnimation(overshootCoords, {
        x: { to: bx, duration: durationX * 0.65 },
        y: { to: by, duration: durationY * 0.65 },
        ease: releaseEase,
        composition
      }).init();
      new JSAnimation(overshootCoords, {
        x: { to: dx, duration: durationX },
        y: { to: dy, duration: durationY },
        ease: releaseEase,
        composition
      }).init();
      this.overshootXTicker.stretch(durationX).restart();
      this.overshootYTicker.stretch(durationY).restart();
    } else {
      if (!disabledX) this.animate[this.xProp](dx, durationX, easeX);
      if (!disabledY) this.animate[this.yProp](dy, durationY, easeY);
    }
    this.scrollInView(longestReleaseDuration, this.scrollThreshold, releaseEase);
    let hasSnapped = false;
    if (dx !== sx) {
      this.snapped[0] = dx;
      if (this.snapX) hasSnapped = true;
    }
    if (dy !== sy && this.snapY) {
      this.snapped[1] = dy;
      if (this.snapY) hasSnapped = true;
    }
    if (hasSnapped) this.onSnap(this);
    this.grabbed = false;
    this.dragged = false;
    this.updated = true;
    this.released = true;
    this.onRelease(this);
    this.$trigger.removeEventListener("touchstart", preventDefault);
    this.$trigger.removeEventListener("touchmove", preventDefault);
    this.$trigger.removeEventListener("touchend", preventDefault);
    doc.removeEventListener("touchmove", this);
    doc.removeEventListener("touchend", this);
    doc.removeEventListener("touchcancel", this);
    doc.removeEventListener("mousemove", this);
    doc.removeEventListener("mouseup", this);
    doc.removeEventListener("selectstart", this);
  }
  reset() {
    this.stop();
    this.resizeTicker.pause();
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.setX(0, true);
    this.setY(0, true);
    this.coords[0] = 0;
    this.coords[1] = 0;
    this.pointer[0] = 0;
    this.pointer[1] = 0;
    this.pointer[2] = 0;
    this.pointer[3] = 0;
    this.pointer[4] = 0;
    this.pointer[5] = 0;
    this.pointer[6] = 0;
    this.pointer[7] = 0;
    this.velocity = 0;
    this.velocityStack[0] = 0;
    this.velocityStack[1] = 0;
    this.velocityStack[2] = 0;
    this.velocityStackIndex = 0;
    this.angle = 0;
    return this;
  }
  enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.$target.classList.remove("is-disabled");
      this.touchActionStyles = setTargetValues(this.$trigger, {
        touchAction: this.disabled[0] ? "pan-x" : this.disabled[1] ? "pan-y" : "none"
      });
      this.$trigger.addEventListener("touchstart", this, { passive: true });
      this.$trigger.addEventListener("mousedown", this, { passive: true });
      this.$trigger.addEventListener("mouseenter", this);
    }
    return this;
  }
  disable() {
    this.enabled = false;
    this.grabbed = false;
    this.dragged = false;
    this.updated = false;
    this.released = false;
    this.canScroll = false;
    this.touchActionStyles.revert();
    if (this.cursorStyles) {
      this.cursorStyles.revert();
      this.cursorStyles = null;
    }
    if (this.triggerStyles) {
      this.triggerStyles.revert();
      this.triggerStyles = null;
    }
    if (this.bodyStyles) {
      this.bodyStyles.revert();
      this.bodyStyles = null;
    }
    if (this.targetStyles) {
      this.targetStyles.revert();
      this.targetStyles = null;
    }
    this.stop();
    this.$target.classList.add("is-disabled");
    this.$trigger.removeEventListener("touchstart", this);
    this.$trigger.removeEventListener("mousedown", this);
    this.$trigger.removeEventListener("mouseenter", this);
    doc.removeEventListener("touchmove", this);
    doc.removeEventListener("touchend", this);
    doc.removeEventListener("touchcancel", this);
    doc.removeEventListener("mousemove", this);
    doc.removeEventListener("mouseup", this);
    doc.removeEventListener("selectstart", this);
    return this;
  }
  revert() {
    this.reset();
    this.disable();
    this.$target.classList.remove("is-disabled");
    this.updateTicker.revert();
    this.overshootXTicker.revert();
    this.overshootYTicker.revert();
    this.resizeTicker.revert();
    return this;
  }
  /**
   * @param {Event} e
   */
  handleEvent(e) {
    switch (e.type) {
      case "mousedown":
        this.handleDown(
          /** @type {MouseEvent} */
          e
        );
        break;
      case "touchstart":
        this.handleDown(
          /** @type {TouchEvent} */
          e
        );
        break;
      case "mousemove":
        this.handleMove(
          /** @type {MouseEvent} */
          e
        );
        break;
      case "touchmove":
        this.handleMove(
          /** @type {TouchEvent} */
          e
        );
        break;
      case "mouseup":
        this.handleUp();
        break;
      case "touchend":
        this.handleUp();
        break;
      case "touchcancel":
        this.handleUp();
        break;
      case "mouseenter":
        this.handleHover();
        break;
      case "selectstart":
        preventDefault(e);
        break;
    }
  }
};
var createDraggable = (target, parameters) => new Draggable(target, parameters);
var Scope = class {
  /** @param {ScopeParams} [parameters] */
  constructor(parameters = {}) {
    if (globals.scope) globals.scope.revertibles.push(this);
    const rootParam = parameters.root;
    let root = doc;
    if (rootParam) {
      root = /** @type {ReactRef} */
      rootParam.current || /** @type {AngularRef} */
      rootParam.nativeElement || parseTargets(
        /** @type {DOMTargetSelector} */
        rootParam
      )[0] || doc;
    }
    const scopeDefaults = parameters.defaults;
    const globalDefault = globals.defaults;
    const mediaQueries = parameters.mediaQueries;
    this.defaults = scopeDefaults ? mergeObjects(scopeDefaults, globalDefault) : globalDefault;
    this.root = root;
    this.constructors = [];
    this.revertConstructors = [];
    this.revertibles = [];
    this.methods = {};
    this.matches = {};
    this.mediaQueryLists = {};
    this.data = {};
    if (mediaQueries) {
      for (let mq in mediaQueries) {
        const _mq = win.matchMedia(mediaQueries[mq]);
        this.mediaQueryLists[mq] = _mq;
        _mq.addEventListener("change", this);
      }
    }
  }
  /**
   * @callback ScoppedCallback
   * @param {this} scope
   * @return {any}
   *
   * @param {ScoppedCallback} cb
   * @return {this}
   */
  execute(cb) {
    let activeScope = globals.scope;
    let activeRoot = globals.root;
    let activeDefaults = globals.defaults;
    globals.scope = this;
    globals.root = this.root;
    globals.defaults = this.defaults;
    const mqs = this.mediaQueryLists;
    for (let mq in mqs) this.matches[mq] = mqs[mq].matches;
    const returned = cb(this);
    globals.scope = activeScope;
    globals.root = activeRoot;
    globals.defaults = activeDefaults;
    return returned;
  }
  /**
   * @return {this}
   */
  refresh() {
    this.execute(() => {
      let i = this.revertibles.length;
      let y = this.revertConstructors.length;
      while (i--) this.revertibles[i].revert();
      while (y--) this.revertConstructors[y](this);
      this.revertibles.length = 0;
      this.revertConstructors.length = 0;
      this.constructors.forEach((constructor) => {
        const revertConstructor = constructor(this);
        if (revertConstructor) {
          this.revertConstructors.push(revertConstructor);
        }
      });
    });
    return this;
  }
  /**
   * @callback contructorCallback
   * @param {this} self
   *
   * @overload
   * @param {String} a1
   * @param {ScopeMethod} a2
   * @return {this}
   *
   * @overload
   * @param {contructorCallback} a1
   * @return {this}
   *
   * @param {String|contructorCallback} a1
   * @param {ScopeMethod} [a2]
   */
  add(a1, a2) {
    if (isFnc(a1)) {
      const constructor = (
        /** @type {contructorCallback} */
        a1
      );
      this.constructors.push(constructor);
      this.execute(() => {
        const revertConstructor = constructor(this);
        if (revertConstructor) {
          this.revertConstructors.push(revertConstructor);
        }
      });
    } else {
      this.methods[
        /** @type {String} */
        a1
      ] = (...args) => this.execute(() => a2(...args));
    }
    return this;
  }
  /**
   * @param {Event} e
   */
  handleEvent(e) {
    switch (e.type) {
      case "change":
        this.refresh();
        break;
    }
  }
  revert() {
    const revertibles = this.revertibles;
    const revertConstructors = this.revertConstructors;
    const mqs = this.mediaQueryLists;
    let i = revertibles.length;
    let y = revertConstructors.length;
    while (i--) revertibles[i].revert();
    while (y--) revertConstructors[y](this);
    for (let mq in mqs) mqs[mq].removeEventListener("change", this);
    revertibles.length = 0;
    revertConstructors.length = 0;
    this.constructors.length = 0;
    this.matches = {};
    this.methods = {};
    this.mediaQueryLists = {};
    this.data = {};
  }
};
var createScope = (params) => new Scope(params);
var getMaxViewHeight = () => {
  const $el = document.createElement("div");
  doc.body.appendChild($el);
  $el.style.height = "100lvh";
  const height = $el.offsetHeight;
  doc.body.removeChild($el);
  return height;
};
var parseScrollObserverFunctionParameter = (value, scroller) => value && isFnc(value) ? (
  /** @type {Function} */
  value(scroller)
) : value;
var scrollContainers = /* @__PURE__ */ new Map();
var ScrollContainer = class {
  /**
   * @param {HTMLElement} $el
   */
  constructor($el) {
    this.element = $el;
    this.useWin = this.element === doc.body;
    this.winWidth = 0;
    this.winHeight = 0;
    this.width = 0;
    this.height = 0;
    this.left = 0;
    this.top = 0;
    this.zIndex = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.prevScrollX = 0;
    this.prevScrollY = 0;
    this.scrollWidth = 0;
    this.scrollHeight = 0;
    this.velocity = 0;
    this.backwardX = false;
    this.backwardY = false;
    this.scrollTicker = new Timer({
      autoplay: false,
      onBegin: () => this.dataTimer.resume(),
      onUpdate: () => {
        const backwards = this.backwardX || this.backwardY;
        forEachChildren(this, (child) => child.handleScroll(), backwards);
      },
      onComplete: () => this.dataTimer.pause()
    }).init();
    this.dataTimer = new Timer({
      autoplay: false,
      frameRate: 30,
      onUpdate: (self) => {
        const dt = self.deltaTime;
        const px = this.prevScrollX;
        const py = this.prevScrollY;
        const nx = this.scrollX;
        const ny = this.scrollY;
        const dx = px - nx;
        const dy = py - ny;
        this.prevScrollX = nx;
        this.prevScrollY = ny;
        if (dx) this.backwardX = px > nx;
        if (dy) this.backwardY = py > ny;
        this.velocity = round(dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt : 0, 5);
      }
    }).init();
    this.resizeTicker = new Timer({
      autoplay: false,
      duration: 250 * globals.timeScale,
      onComplete: () => {
        this.updateWindowBounds();
        this.refreshScrollObservers();
        this.handleScroll();
      }
    }).init();
    this.wakeTicker = new Timer({
      autoplay: false,
      duration: 500 * globals.timeScale,
      onBegin: () => {
        this.scrollTicker.resume();
      },
      onComplete: () => {
        this.scrollTicker.pause();
      }
    }).init();
    this._head = null;
    this._tail = null;
    this.updateScrollCoords();
    this.updateWindowBounds();
    this.updateBounds();
    this.refreshScrollObservers();
    this.handleScroll();
    this.resizeObserver = new ResizeObserver(() => this.resizeTicker.restart());
    this.resizeObserver.observe(this.element);
    (this.useWin ? win : this.element).addEventListener("scroll", this, false);
  }
  updateScrollCoords() {
    const useWin = this.useWin;
    const $el = this.element;
    this.scrollX = round(useWin ? win.scrollX : $el.scrollLeft, 0);
    this.scrollY = round(useWin ? win.scrollY : $el.scrollTop, 0);
  }
  updateWindowBounds() {
    this.winWidth = win.innerWidth;
    this.winHeight = getMaxViewHeight();
  }
  updateBounds() {
    const style = getComputedStyle(this.element);
    const $el = this.element;
    this.scrollWidth = $el.scrollWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    this.scrollHeight = $el.scrollHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    this.updateWindowBounds();
    let width, height;
    if (this.useWin) {
      width = this.winWidth;
      height = this.winHeight;
    } else {
      const elRect = $el.getBoundingClientRect();
      width = elRect.width;
      height = elRect.height;
      this.top = elRect.top;
      this.left = elRect.left;
    }
    this.width = width;
    this.height = height;
  }
  refreshScrollObservers() {
    forEachChildren(this, (child) => {
      if (child._debug) {
        child.removeDebug();
      }
    });
    this.updateBounds();
    forEachChildren(this, (child) => {
      child.refresh();
      if (child._debug) {
        child.debug();
      }
    });
  }
  refresh() {
    this.updateWindowBounds();
    this.updateBounds();
    this.refreshScrollObservers();
    this.handleScroll();
  }
  handleScroll() {
    this.updateScrollCoords();
    this.wakeTicker.restart();
  }
  /**
   * @param {Event} e
   */
  handleEvent(e) {
    switch (e.type) {
      case "scroll":
        this.handleScroll();
        break;
    }
  }
  revert() {
    this.scrollTicker.cancel();
    this.dataTimer.cancel();
    this.resizeTicker.cancel();
    this.wakeTicker.cancel();
    this.resizeObserver.unobserve(this.element);
    (this.useWin ? win : this.element).removeEventListener("scroll", this);
    scrollContainers.delete(this.element);
  }
};
var registerAndGetScrollContainer = (target) => {
  const $el = (
    /** @type {HTMLElement} */
    target ? parseTargets(target)[0] || doc.body : doc.body
  );
  let scrollContainer = scrollContainers.get($el);
  if (!scrollContainer) {
    scrollContainer = new ScrollContainer($el);
    scrollContainers.set($el, scrollContainer);
  }
  return scrollContainer;
};
var convertValueToPx = ($el, v, size, under, over) => {
  const clampMin = v === "min";
  const clampMax = v === "max";
  const value = v === "top" || v === "left" || v === "start" || clampMin ? 0 : v === "bottom" || v === "right" || v === "end" || clampMax ? "100%" : v === "center" ? "50%" : v;
  const { n, u } = decomposeRawValue(value, decomposedOriginalValue);
  let px = n;
  if (u === "%") {
    px = n / 100 * size;
  } else if (u) {
    px = convertValueUnit($el, decomposedOriginalValue, "px", true).n;
  }
  if (clampMax && under < 0) px += under;
  if (clampMin && over > 0) px += over;
  return px;
};
var parseBoundValue = ($el, v, size, under, over) => {
  let value;
  if (isStr(v)) {
    const matchedOperator = relativeValuesExecRgx.exec(
      /** @type {String} */
      v
    );
    if (matchedOperator) {
      const splitter = matchedOperator[0];
      const operator = splitter[0];
      const splitted = (
        /** @type {String} */
        v.split(splitter)
      );
      const clampMin = splitted[0] === "min";
      const clampMax = splitted[0] === "max";
      const valueAPx = convertValueToPx($el, splitted[0], size, under, over);
      const valueBPx = convertValueToPx($el, splitted[1], size, under, over);
      if (clampMin) {
        const min = getRelativeValue(convertValueToPx($el, "min", size), valueBPx, operator);
        value = min < valueAPx ? valueAPx : min;
      } else if (clampMax) {
        const max2 = getRelativeValue(convertValueToPx($el, "max", size), valueBPx, operator);
        value = max2 > valueAPx ? valueAPx : max2;
      } else {
        value = getRelativeValue(valueAPx, valueBPx, operator);
      }
    } else {
      value = convertValueToPx($el, v, size, under, over);
    }
  } else {
    value = /** @type {Number} */
    v;
  }
  return round(value, 0);
};
var getAnimationDomTarget = (linked) => {
  let $linkedTarget;
  const linkedTargets = linked.targets;
  for (let i = 0, l = linkedTargets.length; i < l; i++) {
    const target = linkedTargets[i];
    if (target[isDomSymbol]) {
      $linkedTarget = /** @type {HTMLElement} */
      target;
      break;
    }
  }
  return $linkedTarget;
};
var scrollerIndex = 0;
var debugColors = ["#FF4B4B", "#FF971B", "#FFC730", "#F9F640", "#7AFF5A", "#18FF74", "#17E09B", "#3CFFEC", "#05DBE9", "#33B3F1", "#638CF9", "#C563FE", "#FF4FCF", "#F93F8A"];
var ScrollObserver = class {
  /**
   * @param {ScrollObserverParams} parameters
   */
  constructor(parameters = {}) {
    if (globals.scope) globals.scope.revertibles.push(this);
    const syncMode = setValue(parameters.sync, "play pause");
    const ease = syncMode ? parseEasings(
      /** @type {EasingParam} */
      syncMode
    ) : null;
    const isLinear = syncMode && (syncMode === "linear" || syncMode === none);
    const isEase = syncMode && !(ease === none && !isLinear);
    const isSmooth = syncMode && (isNum(syncMode) || syncMode === true || isLinear);
    const isMethods = syncMode && (isStr(syncMode) && !isEase && !isSmooth);
    const syncMethods = isMethods ? (
      /** @type {String} */
      syncMode.split(" ").map(
        (m) => () => {
          const linked = this.linked;
          return linked && linked[m] ? linked[m]() : null;
        }
      )
    ) : null;
    const biDirSync = isMethods && syncMethods.length > 2;
    this.index = scrollerIndex++;
    this.id = !isUnd(parameters.id) ? parameters.id : this.index;
    this.container = registerAndGetScrollContainer(parameters.container);
    this.target = null;
    this.linked = null;
    this.repeat = null;
    this.horizontal = null;
    this.enter = null;
    this.leave = null;
    this.sync = isEase || isSmooth || !!syncMethods;
    this.syncEase = isEase ? ease : null;
    this.syncSmooth = isSmooth ? syncMode === true || isLinear ? 1 : (
      /** @type {Number} */
      syncMode
    ) : null;
    this.onSyncEnter = syncMethods && !biDirSync && syncMethods[0] ? syncMethods[0] : noop;
    this.onSyncLeave = syncMethods && !biDirSync && syncMethods[1] ? syncMethods[1] : noop;
    this.onSyncEnterForward = syncMethods && biDirSync && syncMethods[0] ? syncMethods[0] : noop;
    this.onSyncLeaveForward = syncMethods && biDirSync && syncMethods[1] ? syncMethods[1] : noop;
    this.onSyncEnterBackward = syncMethods && biDirSync && syncMethods[2] ? syncMethods[2] : noop;
    this.onSyncLeaveBackward = syncMethods && biDirSync && syncMethods[3] ? syncMethods[3] : noop;
    this.onEnter = parameters.onEnter || noop;
    this.onLeave = parameters.onLeave || noop;
    this.onEnterForward = parameters.onEnterForward || noop;
    this.onLeaveForward = parameters.onLeaveForward || noop;
    this.onEnterBackward = parameters.onEnterBackward || noop;
    this.onLeaveBackward = parameters.onLeaveBackward || noop;
    this.onUpdate = parameters.onUpdate || noop;
    this.onSyncComplete = parameters.onSyncComplete || noop;
    this.reverted = false;
    this.completed = false;
    this.began = false;
    this.isInView = false;
    this.forceEnter = false;
    this.hasEntered = false;
    this.offsets = [];
    this.offset = 0;
    this.offsetStart = 0;
    this.offsetEnd = 0;
    this.distance = 0;
    this.prevProgress = 0;
    this.thresholds = ["start", "end", "end", "start"];
    this.coords = [0, 0, 0, 0];
    this.debugStyles = null;
    this.$debug = null;
    this._params = parameters;
    this._debug = setValue(parameters.debug, false);
    this._next = null;
    this._prev = null;
    addChild(this.container, this);
    sync(() => {
      if (this.reverted) return;
      if (!this.target) {
        const target = (
          /** @type {HTMLElement} */
          parseTargets(parameters.target)[0]
        );
        this.target = target || doc.body;
        this.refresh();
      }
      if (this._debug) this.debug();
    });
  }
  /**
   * @param {Tickable|WAAPIAnimation} linked
   */
  link(linked) {
    if (linked) {
      linked.pause();
      this.linked = linked;
      if (!this._params.target) {
        let $linkedTarget;
        if (!isUnd(
          /** @type {JSAnimation} */
          linked.targets
        )) {
          $linkedTarget = getAnimationDomTarget(
            /** @type {JSAnimation} */
            linked
          );
        } else {
          forEachChildren(
            /** @type {Timeline} */
            linked,
            (child) => {
              if (child.targets && !$linkedTarget) {
                $linkedTarget = getAnimationDomTarget(
                  /** @type {JSAnimation} */
                  child
                );
              }
            }
          );
        }
        this.target = $linkedTarget || doc.body;
        this.refresh();
      }
    }
    return this;
  }
  get velocity() {
    return this.container.velocity;
  }
  get backward() {
    return this.horizontal ? this.container.backwardX : this.container.backwardY;
  }
  get scroll() {
    return this.horizontal ? this.container.scrollX : this.container.scrollY;
  }
  get progress() {
    const p = (this.scroll - this.offsetStart) / this.distance;
    return p === Infinity || isNaN(p) ? 0 : round(clamp(p, 0, 1), 6);
  }
  refresh() {
    this.reverted = false;
    const params = this._params;
    this.repeat = setValue(parseScrollObserverFunctionParameter(params.repeat, this), true);
    this.horizontal = setValue(parseScrollObserverFunctionParameter(params.axis, this), "y") === "x";
    this.enter = setValue(parseScrollObserverFunctionParameter(params.enter, this), "end start");
    this.leave = setValue(parseScrollObserverFunctionParameter(params.leave, this), "start end");
    this.updateBounds();
    this.handleScroll();
    return this;
  }
  removeDebug() {
    if (this.$debug) {
      this.$debug.parentNode.removeChild(this.$debug);
      this.$debug = null;
    }
    if (this.debugStyles) {
      this.debugStyles.revert();
      this.$debug = null;
    }
    return this;
  }
  debug() {
    this.removeDebug();
    const container = this.container;
    const isHori = this.horizontal;
    const $existingDebug = container.element.querySelector(":scope > .animejs-onscroll-debug");
    const $debug = doc.createElement("div");
    const $thresholds = doc.createElement("div");
    const $triggers = doc.createElement("div");
    const color = debugColors[this.index % debugColors.length];
    const useWin = container.useWin;
    const containerWidth = useWin ? container.winWidth : container.width;
    const containerHeight = useWin ? container.winHeight : container.height;
    const scrollWidth = container.scrollWidth;
    const scrollHeight = container.scrollHeight;
    const size = this.container.width > 360 ? 320 : 260;
    const offLeft = isHori ? 0 : 10;
    const offTop = isHori ? 10 : 0;
    const half = isHori ? 24 : size / 2;
    const labelHeight = isHori ? half : 15;
    const labelWidth = isHori ? 60 : half;
    const labelSize = isHori ? labelWidth : labelHeight;
    const repeat = isHori ? "repeat-x" : "repeat-y";
    const gradientOffset = (v) => isHori ? "0px " + v + "px" : v + "px 2px";
    const lineCSS = (c) => `linear-gradient(${isHori ? 90 : 0}deg, ${c} 2px, transparent 1px)`;
    const baseCSS = (p, l, t, w, h) => `position:${p};left:${l}px;top:${t}px;width:${w}px;height:${h}px;`;
    $debug.style.cssText = `${baseCSS("absolute", offLeft, offTop, isHori ? scrollWidth : size, isHori ? size : scrollHeight)}
      pointer-events: none;
      z-index: ${this.container.zIndex++};
      display: flex;
      flex-direction: ${isHori ? "column" : "row"};
      filter: drop-shadow(0px 1px 0px rgba(0,0,0,.75));
    `;
    $thresholds.style.cssText = `${baseCSS("sticky", 0, 0, isHori ? containerWidth : half, isHori ? half : containerHeight)}`;
    if (!$existingDebug) {
      $thresholds.style.cssText += `background:
        ${lineCSS("#FFFF")}${gradientOffset(half - 10)} / ${isHori ? "100px 100px" : "100px 100px"} ${repeat},
        ${lineCSS("#FFF8")}${gradientOffset(half - 10)} / ${isHori ? "10px 10px" : "10px 10px"} ${repeat};
      `;
    }
    $triggers.style.cssText = `${baseCSS("relative", 0, 0, isHori ? scrollWidth : half, isHori ? half : scrollHeight)}`;
    if (!$existingDebug) {
      $triggers.style.cssText += `background:
        ${lineCSS("#FFFF")}${gradientOffset(0)} / ${isHori ? "100px 10px" : "10px 100px"} ${repeat},
        ${lineCSS("#FFF8")}${gradientOffset(0)} / ${isHori ? "10px 0px" : "0px 10px"} ${repeat};
      `;
    }
    const labels = [" enter: ", " leave: "];
    this.coords.forEach((v, i) => {
      const isView = i > 1;
      const value = (isView ? 0 : this.offset) + v;
      const isTail = i % 2;
      const isFirst = value < labelSize;
      const isOver = value > (isView ? isHori ? containerWidth : containerHeight : isHori ? scrollWidth : scrollHeight) - labelSize;
      const isFlip = (isView ? isTail && !isFirst : !isTail && !isFirst) || isOver;
      const $label = doc.createElement("div");
      const $text = doc.createElement("div");
      const dirProp = isHori ? isFlip ? "right" : "left" : isFlip ? "bottom" : "top";
      const flipOffset = isFlip ? (isHori ? labelWidth : labelHeight) + (!isView ? isHori ? -1 : -2 : isHori ? -1 : isOver ? 0 : -2) : !isView ? isHori ? 1 : 0 : isHori ? 1 : 0;
      $text.innerHTML = `${this.id}${labels[isTail]}${this.thresholds[i]}`;
      $label.style.cssText = `${baseCSS("absolute", 0, 0, labelWidth, labelHeight)}
        display: flex;
        flex-direction: ${isHori ? "column" : "row"};
        justify-content: flex-${isView ? "start" : "end"};
        align-items: flex-${isFlip ? "end" : "start"};
        border-${dirProp}: 2px ${isTail ? "solid" : "solid"} ${color};
      `;
      $text.style.cssText = `
        overflow: hidden;
        max-width: ${size / 2 - 10}px;
        height: ${labelHeight};
        margin-${isHori ? isFlip ? "right" : "left" : isFlip ? "bottom" : "top"}: -2px;
        padding: 1px;
        font-family: ui-monospace, monospace;
        font-size: 10px;
        letter-spacing: -.025em;
        line-height: 9px;
        font-weight: 600;
        text-align: ${isHori && isFlip || !isHori && !isView ? "right" : "left"};
        white-space: pre;
        text-overflow: ellipsis;
        color: ${isTail ? color : "rgba(0,0,0,.75)"};
        background-color: ${isTail ? "rgba(0,0,0,.65)" : color};
        border: 2px solid ${isTail ? color : "transparent"};
        border-${isHori ? isFlip ? "top-left" : "top-right" : isFlip ? "top-left" : "bottom-left"}-radius: 5px;
        border-${isHori ? isFlip ? "bottom-left" : "bottom-right" : isFlip ? "top-right" : "bottom-right"}-radius: 5px;
      `;
      $label.appendChild($text);
      let position = value - flipOffset + (isHori ? 1 : 0);
      $label.style[isHori ? "left" : "top"] = `${position}px`;
      (isView ? $thresholds : $triggers).appendChild($label);
    });
    $debug.appendChild($thresholds);
    $debug.appendChild($triggers);
    container.element.appendChild($debug);
    if (!$existingDebug) $debug.classList.add("animejs-onscroll-debug");
    this.$debug = $debug;
    const containerPosition = getTargetValue(container.element, "position");
    if (containerPosition === "static") {
      this.debugStyles = setTargetValues(container.element, { position: "relative " });
    }
  }
  updateBounds() {
    if (this._debug) {
      this.removeDebug();
    }
    let stickys;
    const $target = this.target;
    const container = this.container;
    const isHori = this.horizontal;
    const linked = this.linked;
    let linkedTime;
    let $el = $target;
    let offsetX = 0;
    let offsetY = 0;
    let $offsetParent = $el;
    if (linked) {
      linkedTime = linked.currentTime;
      linked.seek(0, true);
    }
    const isContainerStatic = getTargetValue(container.element, "position") === "static" ? setTargetValues(container.element, { position: "relative " }) : false;
    while ($el && $el !== container.element && $el !== doc.body) {
      const isSticky = getTargetValue($el, "position") === "sticky" ? setTargetValues($el, { position: "static" }) : false;
      if ($el === $offsetParent) {
        offsetX += $el.offsetLeft || 0;
        offsetY += $el.offsetTop || 0;
        $offsetParent = $el.offsetParent;
      }
      $el = /** @type {HTMLElement} */
      $el.parentElement;
      if (isSticky) {
        if (!stickys) stickys = [];
        stickys.push(isSticky);
      }
    }
    if (isContainerStatic) isContainerStatic.revert();
    const offset = isHori ? offsetX : offsetY;
    const targetSize = isHori ? $target.offsetWidth : $target.offsetHeight;
    const containerSize = isHori ? container.width : container.height;
    const scrollSize = isHori ? container.scrollWidth : container.scrollHeight;
    const maxScroll = scrollSize - containerSize;
    const enter = this.enter;
    const leave = this.leave;
    let enterTarget = "start";
    let leaveTarget = "end";
    let enterContainer = "end";
    let leaveContainer = "start";
    if (isStr(enter)) {
      const splitted = (
        /** @type {String} */
        enter.split(" ")
      );
      enterContainer = splitted[0];
      enterTarget = splitted.length > 1 ? splitted[1] : enterTarget;
    } else if (isObj(enter)) {
      const e = (
        /** @type {ScrollThresholdParam} */
        enter
      );
      if (!isUnd(e.container)) enterContainer = e.container;
      if (!isUnd(e.target)) enterTarget = e.target;
    } else if (isNum(enter)) {
      enterContainer = /** @type {Number} */
      enter;
    }
    if (isStr(leave)) {
      const splitted = (
        /** @type {String} */
        leave.split(" ")
      );
      leaveContainer = splitted[0];
      leaveTarget = splitted.length > 1 ? splitted[1] : leaveTarget;
    } else if (isObj(leave)) {
      const t = (
        /** @type {ScrollThresholdParam} */
        leave
      );
      if (!isUnd(t.container)) leaveContainer = t.container;
      if (!isUnd(t.target)) leaveTarget = t.target;
    } else if (isNum(leave)) {
      leaveContainer = /** @type {Number} */
      leave;
    }
    const parsedEnterTarget = parseBoundValue($target, enterTarget, targetSize);
    const parsedLeaveTarget = parseBoundValue($target, leaveTarget, targetSize);
    const under = parsedEnterTarget + offset - containerSize;
    const over = parsedLeaveTarget + offset - maxScroll;
    const parsedEnterContainer = parseBoundValue($target, enterContainer, containerSize, under, over);
    const parsedLeaveContainer = parseBoundValue($target, leaveContainer, containerSize, under, over);
    const offsetStart = parsedEnterTarget + offset - parsedEnterContainer;
    const offsetEnd = parsedLeaveTarget + offset - parsedLeaveContainer;
    const scrollDelta = offsetEnd - offsetStart;
    this.offsets[0] = offsetX;
    this.offsets[1] = offsetY;
    this.offset = offset;
    this.offsetStart = offsetStart;
    this.offsetEnd = offsetEnd;
    this.distance = scrollDelta <= 0 ? 0 : scrollDelta;
    this.thresholds = [enterTarget, leaveTarget, enterContainer, leaveContainer];
    this.coords = [parsedEnterTarget, parsedLeaveTarget, parsedEnterContainer, parsedLeaveContainer];
    if (stickys) {
      stickys.forEach((sticky) => sticky.revert());
    }
    if (linked) {
      linked.seek(linkedTime, true);
    }
    if (this._debug) {
      this.debug();
    }
  }
  handleScroll() {
    const linked = this.linked;
    const sync2 = this.sync;
    const syncEase = this.syncEase;
    const syncSmooth = this.syncSmooth;
    const shouldSeek = linked && (syncEase || syncSmooth);
    const isHori = this.horizontal;
    const container = this.container;
    const scroll = this.scroll;
    const isBefore = scroll <= this.offsetStart;
    const isAfter = scroll >= this.offsetEnd;
    const isInView = !isBefore && !isAfter;
    const isOnTheEdge = scroll === this.offsetStart || scroll === this.offsetEnd;
    const forceEnter = !this.hasEntered && isOnTheEdge;
    const $debug = this._debug && this.$debug;
    let hasUpdated = false;
    let syncCompleted = false;
    let p = this.progress;
    if (isBefore && this.began) {
      this.began = false;
    }
    if (p > 0 && !this.began) {
      this.began = true;
    }
    if (shouldSeek) {
      const lp = linked.progress;
      if (syncSmooth && isNum(syncSmooth)) {
        if (
          /** @type {Number} */
          syncSmooth < 1
        ) {
          const step = 1e-4;
          const snap2 = lp < p && p === 1 ? step : lp > p && !p ? -1e-4 : 0;
          p = round(lerp(lp, p, interpolate(
            0.01,
            0.2,
            /** @type {Number} */
            syncSmooth
          ), false) + snap2, 6);
        }
      } else if (syncEase) {
        p = syncEase(p);
      }
      hasUpdated = p !== this.prevProgress;
      syncCompleted = lp === 1;
      if (hasUpdated && !syncCompleted && (syncSmooth && lp)) {
        container.wakeTicker.restart();
      }
    }
    if ($debug) {
      const sticky = isHori ? container.scrollY : container.scrollX;
      $debug.style[isHori ? "top" : "left"] = sticky + 10 + "px";
    }
    if (isInView && !this.isInView || forceEnter && !this.forceEnter && !this.hasEntered) {
      if (isInView) this.isInView = true;
      if (!this.forceEnter || !this.hasEntered) {
        if ($debug && isInView) $debug.style.zIndex = `${this.container.zIndex++}`;
        this.onSyncEnter(this);
        this.onEnter(this);
        if (this.backward) {
          this.onSyncEnterBackward(this);
          this.onEnterBackward(this);
        } else {
          this.onSyncEnterForward(this);
          this.onEnterForward(this);
        }
        this.hasEntered = true;
        if (forceEnter) this.forceEnter = true;
      } else if (isInView) {
        this.forceEnter = false;
      }
    }
    if (isInView || !isInView && this.isInView) {
      hasUpdated = true;
    }
    if (hasUpdated) {
      if (shouldSeek) linked.seek(linked.duration * p);
      this.onUpdate(this);
    }
    if (!isInView && this.isInView) {
      this.isInView = false;
      this.onSyncLeave(this);
      this.onLeave(this);
      if (this.backward) {
        this.onSyncLeaveBackward(this);
        this.onLeaveBackward(this);
      } else {
        this.onSyncLeaveForward(this);
        this.onLeaveForward(this);
      }
      if (sync2 && !syncSmooth) {
        syncCompleted = true;
      }
    }
    if (p >= 1 && this.began && !this.completed && (sync2 && syncCompleted || !sync2)) {
      if (sync2) {
        this.onSyncComplete(this);
      }
      this.completed = true;
      if (!this.repeat && !linked || !this.repeat && linked && linked.completed) {
        this.revert();
      }
    }
    if (p < 1 && this.completed) {
      this.completed = false;
    }
    this.prevProgress = p;
  }
  revert() {
    if (this.reverted) return;
    const container = this.container;
    removeChild(container, this);
    if (!container._head) {
      container.revert();
    }
    if (this._debug) {
      this.removeDebug();
    }
    this.reverted = true;
    return this;
  }
};
var onScroll = (parameters = {}) => new ScrollObserver(parameters);
var stagger = (val, params = {}) => {
  let values = [];
  let maxValue2 = 0;
  const from = params.from;
  const reversed = params.reversed;
  const ease = params.ease;
  const hasEasing = !isUnd(ease);
  const hasSpring = hasEasing && !isUnd(
    /** @type {Spring} */
    ease.ease
  );
  const staggerEase = hasSpring ? (
    /** @type {Spring} */
    ease.ease
  ) : hasEasing ? parseEasings(ease) : null;
  const grid = params.grid;
  const axis = params.axis;
  const fromFirst = isUnd(from) || from === 0 || from === "first";
  const fromCenter = from === "center";
  const fromLast = from === "last";
  const isRange = isArr(val);
  const val1 = isRange ? parseNumber(val[0]) : parseNumber(val);
  const val2 = isRange ? parseNumber(val[1]) : 0;
  const unitMatch = unitsExecRgx.exec((isRange ? val[1] : val) + emptyString);
  const start = params.start || 0 + (isRange ? val1 : 0);
  let fromIndex = fromFirst ? 0 : isNum(from) ? from : 0;
  return (_, i, t, tl) => {
    if (fromCenter) fromIndex = (t - 1) / 2;
    if (fromLast) fromIndex = t - 1;
    if (!values.length) {
      for (let index = 0; index < t; index++) {
        if (!grid) {
          values.push(abs(fromIndex - index));
        } else {
          const fromX = !fromCenter ? fromIndex % grid[0] : (grid[0] - 1) / 2;
          const fromY = !fromCenter ? floor(fromIndex / grid[0]) : (grid[1] - 1) / 2;
          const toX = index % grid[0];
          const toY = floor(index / grid[0]);
          const distanceX = fromX - toX;
          const distanceY = fromY - toY;
          let value = sqrt(distanceX * distanceX + distanceY * distanceY);
          if (axis === "x") value = -distanceX;
          if (axis === "y") value = -distanceY;
          values.push(value);
        }
        maxValue2 = max(...values);
      }
      if (staggerEase) values = values.map((val3) => staggerEase(val3 / maxValue2) * maxValue2);
      if (reversed) values = values.map((val3) => axis ? val3 < 0 ? val3 * -1 : -val3 : abs(maxValue2 - val3));
    }
    const spacing = isRange ? (val2 - val1) / maxValue2 : val1;
    const offset = tl ? parseTimelinePosition(tl, isUnd(params.start) ? tl.iterationDuration : start) : (
      /** @type {Number} */
      start
    );
    let output = offset + (spacing * round(values[i], 2) || 0);
    if (params.modifier) output = params.modifier(output);
    if (unitMatch) output = `${output}${unitMatch[2]}`;
    return output;
  };
};
export {
  Animatable,
  Draggable,
  JSAnimation,
  Scope,
  ScrollObserver,
  Spring,
  Timeline,
  Timer,
  WAAPIAnimation,
  animate,
  createAnimatable,
  createDraggable,
  createScope,
  createSpring,
  createTimeline,
  createTimer,
  eases,
  engine,
  onScroll,
  scrollContainers,
  stagger,
  svg,
  utils,
  waapi
};
/*! Bundled license information:

animejs/lib/anime.esm.js:
  (**
   * anime.js - ESM
   * @version v4.0.1
   * @author Julian Garnier
   * @license MIT
   * @copyright (c) 2025 Julian Garnier
   * @see https://animejs.com
   *)
*/
//# sourceMappingURL=animejs.js.map
