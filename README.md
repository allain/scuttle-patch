# scuttle-patch

A JSON-Patch backed scuttlebutt that supports replicating arbitrary JSON objects.

[![build status](https://secure.travis-ci.org/allain/scuttle-patch.png)](http://travis-ci.org/allain/scuttle-patch)

## Installation

This module is installed via npm:

``` bash
$ npm install scuttle-patch
```

## Example Usage

``` js
var ScuttlePatch = require('scuttle-patch');

var model = new ScuttlePatch();
model.on('change', function(updatedDoc) {
  console.log(JSON.stringify(updatedDoc));
});

model.update({a: 10, b: true, c:[2, 1]});
model.update({a: 10, c: [1, 2]});

model.patch([{op: 'add', path: '/d', value: 'Hello'}]);

console.log(model.toJSON());

//should output:
// {"a": 10, "c": [1, 2], "d": "Hello"}
```
