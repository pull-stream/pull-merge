# pull-merge

merge sorted pull-streams into one pull stream, while maintaining back-pressure.
Source pull streams MUST be in order.

## example

``` js
var pull = require('pull-stream')
var merge = require('pull-merge')

pull(
  merge(pull.values([1, 5, 6]), pull.values([2, 4, 7])),
  pull.collect(function (err, ary) {
    if(err) throw err

    console.log(ary)
    //=> [1, 2, 4, 5, 6, 7]
  })
)

```

## signatures

### merge(left, right, compare?)

return a stream that is the merge of left and right streams.
merge pulls a chunk from both `left` and `right` and then
compares them. `compare` has the same signature as `Array#sort(compare)`.
If the two chunks are compared the same, the chunk from the right stream
is taken, but the left chunk is dropped.
Otherwise, the lowest chunk is passed to the stream.

### merge([streams...], compare?)

Merge a collection of steams. This calls the first signature recursively.


## License

MIT
