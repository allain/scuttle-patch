var assert = require('chai').assert,
    ScuttlePatch = require('..');

describe('scuttle-patch', function() {
  it('supports creation', function(done) {
    var model = new ScuttlePatch();
    assert.isNotNull(model);
    done();
  });
});
