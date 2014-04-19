var tape = require('tape')
var pull = require('pull-stream')
var merge = require('../')

function rand(n) {
  var a = []
  while(n--) a.push(Math.random())
  return a.sort(comp)
}

function comp (a, b) {
  return a - b
}

var a = rand(100)
var b = rand(100)

tape('merge random arrays', function (t) {

  pull(
    merge(pull.values(a), pull.values(b), comp),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, a.concat(b).sort(comp))
      t.end()
    })
  )

})
