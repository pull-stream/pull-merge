
function isUndef(a) {
  return a === undefined
}

function cmp (a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

module.exports = function (left, right, compare) {

  compare = compare || cmp

  function abortAll(abort, cb) {
    throw new Error('abort not implemented yet')
  }

  var readyLeft, readyRight, endedLeft, endedRight

  function pull (cb) {

    if(readyLeft === undefined && !endedLeft)
      left(null, function (err, data) {
        readyLeft = data
        endedLeft = err
        next()
      })
    if(readyRight === undefined && !endedRight)
      right(null, function (err, data) {
        readyRight = data
        endedRight = err
        next()
      })

    function next (err) {
      var data
      console.log(readyLeft, readyRight, endedLeft, endedRight)
      if(err) throw err
      if(err) return abortAll(err, cb)

      if(endedLeft && endedRight)
        return cb(true)

      if(endedLeft && !isUndef(readyRight)) {
        data = readyRight
        readyRight = undefined
      }
      else if(endedRight && !isUndef(readyLeft)) {
        data = readyLeft
        readyLeft = undefined
      }
      else if(isUndef(readyLeft) || isUndef(readyRight))
        return
      else
        //compare the comparitor with 0, incase user provided compare() return decimals.
        switch (cmp(compare(readyLeft, readyRight), 0)) {
          case  0:
            data = readyRight;
            readyLeft = readyRight = undefined;
            break;
          case  1:
            data = readyRight;
            readyRight = undefined;
            break;
          case -1:
            data = readyLeft;
            readyLeft = undefined;
            break;
        }

      cb(null, data)
    }
  }

  return function (abort, cb) {
    if(abort) return abortAll(cb)
    pull(cb)
  }
}
