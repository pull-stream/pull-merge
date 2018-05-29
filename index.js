
function isUndef(a) {
  return a == null
}

function isOkay(a) {
  return a != null
}

function cmp (a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}
var k = 0

function singly(fun) {
  var called = false
  return function (value, cb) {
    if(called) return
    called = true
    fun(value, function (err, value) {
      called = false
      cb(err, value)
    })
  }
}

function once (cb, name) {
  var called = false
  name = name || ''
  return function (err, data) {
    if(called) throw new Error(name + ' calledback twice!')
    called = true
    return cb.call(this, err, data)
  }
}

/*
every pull stream has these states.
{
  READY: { read: READING },
  READING: { data: READY, end: END, error: END}
  END: {}
}

{
  NADA: {}
  READY1: {send1: NADA, end1; }
  READY2: {send2: NADA}
  READY12: {send1: READY1, send2: READY1}
  END1READY1: {send2: 
  END2READY2
  END12
}

// cat two streams
{
  READ1: {end1: READ2}
  READ2: {end2: END}
  END:{}
}

*/

var merge = module.exports = function (left, right, compare) {
  if(Array.isArray(left)) {
    compare = right
    if(left.length === 0)
      return function (abort, cb) { cb(true) } //empty stream
    else if(left.length === 1)
      return left[0]
    else if(left.length === 2)
      return merge(left[0], left[1], compare)
    else if(left.length === 3)
      return merge(left[0], merge(left[1], left[2], compare), compare)
    else if(left.length >= 4) {
      var i = ~~left.length/2
      return merge(
        merge(left.slice(0, i), compare),
        merge(left.slice(i), compare),
        compare
      )
    }
  }
  compare = compare || cmp
  var cb
  function abortAll(abort, cb) {
    var waiting = 2
    var erred
    if(endedLeft) done()
    else getLeft(true, done)
    if(endedRight) done()
    else getRight(true, done)
    function done(err) {
      erred = erred || (err === true ? null : err)
      if (!--waiting) cb(erred || true)
    }
  }

  var getLeft = singly(left)
  var getRight = singly(right)

  var readyLeft, readyRight, endedLeft, endedRight

  function next () {
    var _cb
    var data

    if(!cb) return

    if(endedLeft && endedRight) {
      _cb = cb; cb = null;
      return _cb(true)
    }

    if(endedLeft && isOkay(readyRight)) {
      data = readyRight
      readyRight = undefined
    }
    else if(endedRight && isOkay(readyLeft)) {
      data = readyLeft
      readyLeft = undefined
    }
    else if(isUndef(readyLeft) || isUndef(readyRight))
      return
    else
      //compare the comparitor with 0, incase user provided compare() return decimals.
      switch (cmp(compare(readyLeft, readyRight), 0)) {
        case  0:
          data = readyRight
          readyLeft = readyRight = undefined
          break
        case  1:
          data = readyRight
          readyRight = undefined
          break
        case -1:
          data = readyLeft
          readyLeft = undefined
          break
      }
    _cb = cb; cb = null;
    _cb(null, done = data)
  }

  function pull () {
    if((readyLeft || endedLeft) && (readyRight || endedRight))
      return next()

    if(isUndef(readyLeft) && !endedLeft)
      getLeft(null, function (err, data) {
        readyLeft = data
        endedLeft = err
        next()
      })

    if(isUndef(readyRight) && !endedRight) {
      getRight(null, once(function (err, data) {
        readyRight = data
        endedRight = err
        next()
      }))
    }
  }

  return function (abort, _cb) {
    cb = _cb
    if(abort) return abortAll(abort, cb)
   pull()
  }
}

