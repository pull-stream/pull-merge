var ary = [
0, 3, 6, 9, 10, 32
]

var search = require('../sst').search
var tape = require('tape')

tape('binary search', function (t) {
  t.equal(search(ary, 0), 0)
  t.equal(search(ary, 9), 3)
  t.equal(search(ary, 3), 1)
  t.equal(search(ary, 10), 4)
  t.end()
})

tape('binary search - NEXT', function (t) {
  t.equal(search(ary, 9.5), 4)
  t.equal(search(ary, 4), 2)
  t.equal(search(ary, 1), 1)
  //these return an index that is past the end
  t.equal(search(ary, 33), 6)
  t.equal(search(ary, 100), 6)
  t.end()
})


