var tape = require('tape')
var pull = require('pull-stream')
var merge = require('../')
var createHash = require('crypto').createHash
var i = 0
function rand(n) {
  var a = []
  while(n--) a.push(createHash('sha256').update(''+i++).digest('hex'))
  return a.sort()
}

var a = rand(3)
var b = rand(3)
var c = rand(3)

tape('merge random arrays', function (t) {

  pull(
    merge(pull.values(a), pull.values(b)),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, a.concat(b).sort())
      t.end()
    })
  )

})

tape('merge different sized arrays', function (t) {
  var a = rand(6)
  var b = rand(3)
  pull(
    merge(pull.values(a), pull.values(b)),
    pull.collect(function (err, ary) {
      t.deepEqual(ary.length, a.length + b.length) // + c.length)
      t.deepEqual(ary, a.concat(b).sort())
      t.end()
    })
  )
})

tape('merge multiple sized arrays', function (t) {

  var a = rand(4)
  var b = rand(2)
  var c = rand(3)

  console.log('a', a)
  console.log('b', b)
  console.log('c', c)
  console.log(a.concat(b).length)

  pull(
    merge(
      pull.values(a),
      merge(pull.values(c), pull.values(b))
    ),
    pull.collect(function (err, ary) {
      t.deepEqual(ary.length, a.length + b.length + c.length) // + c.length)
      t.deepEqual(ary, a.concat(b).concat(c).sort())
      t.end()
    })
  )
})


tape('merge many', function (t) {
  var a = rand(45)
  var b = rand(92)
  var c = rand(78)
  var d = rand(100)
  var e = rand(87)

  pull(
    merge(
      merge(
        pull.values(a),
        merge(pull.values(c), pull.values(b))
      ),
      merge(pull.values(d), pull.values(e))
    ),
    pull.collect(function (err, ary) {
      t.deepEqual(ary.length, a.length + b.length + c.length + d.length + e.length) // + c.length)
      t.deepEqual(ary, a.concat(b).concat(c).concat(d).concat(e).sort())
      t.end()
    })
  )

})

