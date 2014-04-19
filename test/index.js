
var tape = require('tape')
var pull = require('pull-stream')

var merge = require('../')

tape('empty', function (t) {

  pull(
    merge(pull.values([]), pull.values([])),
    pull.collect(function (err, ary) {
      console.log(ary)
      t.deepEqual(ary, [])
      t.end()
    })
  )

})

tape('equal', function (t) {

  pull(
    merge(pull.values([1]), pull.values([1])),
    pull.collect(function (err, ary) {
      console.log(ary)
      t.deepEqual(ary, [1])
      t.end()
    })
  )

})

tape('different', function (t) {

  pull(
    merge(pull.values([1]), pull.values([2])),
    pull.collect(function (err, ary) {
      console.log(ary)
      t.deepEqual(ary, [1, 2])
      t.end()
    })
  )

})

tape('different', function (t) {

  pull(
    merge(pull.values([2, 3]), pull.values([1])),
    pull.collect(function (err, ary) {
      console.log(ary)
      t.deepEqual(ary, [1, 2, 3])
      t.end()
    })
  )

})

return


tape('simple', function (t) {

  pull(
    merge(pull.values([0, 2, 4, 6]), pull.values([1,3,5,7])),
    pull.collect(function (err, ary) {
      console.log(ary)
      t.deepEqual(ary, [0,1,2,3,4,5,6,7])
      t.end()
    })
  )

})

return
tape('overwrite', function (t) {
  pull(
    merge(pull.values([0, 2, 3, 5, 6]), pull.values([1,4,5,7])),
    pull.collect(function (err, ary) {
      t.deepEqual(ary, [0,1,2,3,4,5,6,7])
      console.log(ary)
      t.end()
    })
  )
})

// HOW TO DECIDE WHEN TO COMPACT?
// idea: after a write to the memtable,
// if a threashold was passed write out memtable into sst and compact.

// to do a compaction, check if there are 2 or more tables the same size.
// if the tables are 1 1 2 4 then compact all 1+1+2+4 into a 8 sized table.
// and keep track of which SSTs are in use. GC tables which are not in a snapshot.

//have a manifest.json that is the current selection of ssts.

// to do a GET retrive the closest to a key from each SST.
// (smallest to largest)

// to do a stream, merge the streams from each SST.


