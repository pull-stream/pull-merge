
var k = 1000, n = 100000, C = 0

function cmp (a, b) {
  C ++
  return a < b ? -1 : a > b ? 1 : 0
}


var arrays = new Array(k)
for(var i = 0; i < k; i++)
  arrays[i] = []

for(var i = 0; i < n; i++)
  arrays[~~(Math.random()*k)].push(i)

var pull = require('pull-stream')
var Merge = require('./')

var start = Date.now()
var _v = -1

pull(
  Merge(arrays.map(function (ary) {
    return pull.values(ary)
  }), cmp),
  pull.drain(function (v) {
    if(v <= _v) throw new Error('out of order!')
    _v = v
  }, function () {
    console.log(Date.now() - start, C)
  })
)
