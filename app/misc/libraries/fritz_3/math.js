/*
  Expose common Math function to global
  Better random function
  Vec 2
*/

const {round, floor, ceil, PI, abs, min, max, sign} = Math
const random = (...args) => {
  if (args.length == 0) {
    return Math.random()
  } else if (args.length == 1) {
    if (Array.isArray(args[0])) {
      return args[0][Math.floor(Math.random() * min.length)]
    } else {
      return Math.random() * args[0]
    }
  } else {
    return Math.random() * (args[1] - args[0]) + args[0]
  }
}

function getXY(x, y) {
  if (Array.isArray(x)) {
    return x
  }

  if (typeof y == 'undefined') y = x

  return [x, y]
}

class Vec2 extends Array {
  constructor(x = 0, y) {
    if (typeof y == 'undefined') y = x

    super(x, y)
  }

  get x() { return this[0] }
  get y() { return this[1] }

  set x(x) { this[0] = x }
  set y(y) { this[1] = y }

  set(x, y) {
    [x, y] = getXY(x, y)

    this[0] = x
    this[1] = y
    return this
  }

  add(x, y) {
    [x, y] = getXY(x, y)

    this[0] += x
    this[1] += y
    return this
  }

  sub(x, y) {
    [x, y] = getXY(x, y)

    this[0] -= x
    this[1] -= y
    return this
  }

  mult(x, y) {
    [x, y] = getXY(x, y)

    this[0] *= x
    this[1] *= y
    return this
  }

  div(x, y) {
    [x, y] = getXY(x, y)

    this[0] /= x
    this[1] /= y
    return this
  }

  reset() {
    this[0] = 0
    this[1] = 0
    return this
  }

  equals(x, y) {
    [x, y] = getXY(x, y)

    return this[0] == x && this[1] == y
  }

  magSq() {
    return this[0] * this[0] + this[1] * this[1]
  }

  mag() {
    return Math.sqrt(this.magSq())
  }

  normalize() {
    const len = this.mag()

    if (len !== 0) this.mult(1 / len)
    return this
  }

  setMag(mag) {
    return this.normalize.mult(mag)
  }

  copy() {
    const copy = new this.constructor(this)
    return copy
  }
}


function addVec2(target, name, dim1, dim2) {
  const {prototype} = target
  const capName = capitalize(name);

  class CustomVec extends Vec2 {
    constructor(x, y) {
      super(x, y)
    }

    get [dim1]() { return this[0] }
    get [dim2]() { return this[1] }

    set [dim1](x) { this[0] = x }
    set [dim2](y) { this[1] = y }

    bind(binded, dim1, dim2, px, fun) {
      let x = this[0], y = this[1]
      const setX = px ? to => binded[dim1] = (x = to) + 'px' : to => binded[dim1] = x = to
      const setY = px ? to => binded[dim2] = (y = to) + 'px' : to => binded[dim2] = y = to

      Object.defineProperties(this, {
        0: {
          get: function() { return x },
          set: fun ? to => { setX(to); fun(x, y) } : setX
        },
        1: {
          get: function() { return y },
          set: fun ? to => { setY(to); fun(x, y) } : setY
        }
      })
    }
  }

  ['set', 'add', 'sub', 'mult', 'div', 'magSq', 'mag', 'setMag', 'normalize', 'equals', 'reset'].forEach(funName => {
    prototype[funName + capName] = function(...to) { this[name][funName](...to); return this; }
  })

  Object.defineProperty(prototype, dim1, {
    get: function() { return this[name][0] },
    set: function(val) { this[name][0] = val }
  });

  Object.defineProperty(prototype, dim2, {
    get: function() { return this[name][1] },
    set: function(val) { this[name][1] = val }
  });

  Object.defineProperty(prototype, name, {
    set: function([x, y]) {
      const thisVec = new CustomVec(x, y)

      Object.defineProperty(this, name, {
        get: function() { return thisVec },
        set: function(to) {
          console.log(to);
          if (Array.isArray(to) || typeof to != 'object') {
            thisVec.set(to)
            console.log(typeof to);
          } else {
            const x = typeof to[dim1] != 'undefined' ? to[dim1] : to.x
            const y = typeof to[dim2] != 'undefined' ? to[dim2] : to.y
            thisVec.set(x, y)
          }

          return thisVec
        }
      });
    }
  })
}

class ChangeVec extends Vec2 {
  constructor(x, y) {
    super(x, y)

    this.oldVec = new Vec2(this[0], this[1])
    this.changedAccesed = false
  }

  get changed() {
    if (this.changedAccesed) {
      return false
    }

    const ret = !this.equals(this.oldVec)
    // console.log(this, this.oldVec);
    this.oldVec.set(this)
    this.changedAccesed = true

    return ret
  }

  get isDifferent() {
    return this.equals(this.oldVec)
  }

  set(x, y) {
    this.oldVec.set(this)
    this.changedAccesed = false;

    // this.__proto__.__proto__.set(x, y) NOPE, this points to __proto__.__proto__
    [x, y] = getXY(x, y)
    this[0] = x
    this[1] = y

    return this
  }

  equalize() {
    this.oldVec.set(this)
    return this
  }
}
