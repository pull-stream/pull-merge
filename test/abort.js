var tape = require('tape')
var pull = require('pull-stream')

var merge = require('../')

function counter(i, j) {
  return function read(end, cb) {
    if (end) {
      read.ended = end
      return cb()
    }
    var n = i
    i += j
    setImmediate(function () {
      cb(null, n)
    })
  }
}

tape('counter', function (t) {
  pull(
    counter(1, 2),
    pull.take(4),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [1, 3, 5, 7], 'values')
      t.end()
    })
  )
})


tape('abort both', function (t) {
  var odd = counter(1, 2)
  var even = counter(0, 2)

  pull(
    merge(odd, even),
    pull.take(4),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [0, 1, 2, 3], 'values')
      t.ok(odd.ended, 'odd aborted')
      t.ok(even.ended, 'even aborted')
      t.end()
    })
  )
})

tape('abort left', function (t) {
  var odd = counter(1, 2)
  var even = pull(counter(0, 2), pull.take(1))

  pull(
    merge(odd, even),
    pull.take(4),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [0, 1, 3, 5], 'values')
      t.ok(odd.ended, 'odd aborted')
      t.equal(even.ended, undefined, 'even aborted')
      t.end()
    })
  )
})

tape('abort right', function (t) {
  var odd = pull(counter(1, 2), pull.take(1))
  var even = counter(0, 2)

  pull(
    merge(odd, even),
    pull.take(4),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [0, 1, 2, 4], 'values')
      t.equal(odd.ended, undefined, 'odd aborted')
      t.ok(even.ended, 'even aborted')
      t.end()
    })
  )
})
