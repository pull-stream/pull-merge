
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
  var called = false, id = k++, c = 0
  return function (value, cb) {
    console.log('called', id, ++c)
    if(called) throw new Error('called twice')
    var n = 0
    console.log('cb', id, c)
    called = true
    fun(value, function (err, value) {
//      if(n++) throw new Error('called back twice')
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
{
  READY: { read: READING },
  READING: { cb: READY }
}



*/

module.exports = function (left, right, compare) {

  compare = compare || cmp
  var cb
  function abortAll(abort, cb) {
    throw new Error('abort not implemented yet')
  }

  var getLeft = singly(left)
  var getRight = singly(right)

  var readyLeft, readyRight, endedLeft, endedRight, n = 0
    var id = Math.random()
    var done = false

  function next (err) {
    var _cb
    var data
    if(err) throw err
    if(err) return abortAll(done = err, cb)

    console.log('NEXT', n, i, id, readyLeft, readyRight)

    if(!cb) return

    if(endedLeft && endedRight) {
      console.log('ended', n, endedLeft, endedRight)
      console.log('ENDED', n, i, data)
      _cb = cb; cb = null;
      return _cb(done = true)
    }

    console.log('ready?', n, readyLeft, readyRight, endedLeft, endedRight)

    if(endedLeft && isOkay(readyRight)) {
      data = readyRight
      console.log('dump right', n, data)
      readyRight = undefined
    }
    else if(endedRight && isOkay(readyLeft)) {
      data = readyLeft
      console.log('dump left', n, data)
      readyLeft = undefined
    }
    else if(isUndef(readyLeft) || isUndef(readyRight))
      return console.error('do nothing yet')
    else
      //compare the comparitor with 0, incase user provided compare() return decimals.
      switch (cmp(compare(readyLeft, readyRight), 0)) {
        case  0:
          data = readyRight;
          console.log('EQUAL', n, data)
          readyLeft = readyRight = undefined;
          break;
        case  1:
          data = readyRight;
          console.log('take right',n,  data)
          readyRight = undefined;
          break;
        case -1:
          data = readyLeft;
          console.log('take left', n, data)
          readyLeft = undefined;
          break;
      }
    n++
    console.log('RESULT', n, i, id, data)
    _cb = cb; cb = null;
    _cb(null, done = data)
  }


  var i = 0
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
      console.log('get-right', n)
      getRight(null, once(function (err, data) {
        console.log('set-right', n, err, data)
        if(readyRight) throw new Error('overwrite! '+readyRight+' / ' + data)
        readyRight = data
        endedRight = err
        next()
      }), 'right')
    }

    console.log(i++)
  }

  return function (abort, _cb) {
    cb = _cb
    if(abort) return abortAll(cb)
   pull()
  }
}
