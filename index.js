var Scuttlebutt = require('scuttlebutt');
var filter = Scuttlebutt.filter;
var u = require('scuttlebutt/util');
var inherits = require('util').inherits;
var jiff = require('jiff');
var debug = require('debug')('scuttle-patch');

module.exports = ScuttlePatch;

inherits(ScuttlePatch, Scuttlebutt);

function ScuttlePatch(options) {
  options = options || {};

  if (! (this instanceof ScuttlePatch)) {
    return new ScuttlePatch(options);
  }

  Scuttlebutt.call(this, options);

  debug('scuttlebutt id', this.id);

  // backend to persist across restarts, when not given assumes
  // fresh start every time
  var persist = this._persist = options.persist || {
    set: function(key, val) {},
    get: function(key) {}
  };

  this._store = persist.get('_updates') || [];
  this._doc = persist.get('_doc') || {};

  this._hashFunction = options.hashFunction || function(obj) {
    return obj.id || obj._id || obj.hash || JSON.stringify(obj);
  };
}

ScuttlePatch.prototype.update = function(newDoc) {
  var patch = jiff.diff(this._doc, newDoc);
  return this.patch(patch);
};

ScuttlePatch.prototype.patch = function(patch) {
  this.localUpdate(patch);
  return patch;
};

ScuttlePatch.prototype.history = function(sources) {
  var self = this;
  var result = [];

  this._store.forEach(function (e) {
    if (u.filter(e, sources)) {
      result.push(e);
    }
  });

  return u.sort(result);
};

ScuttlePatch.prototype.applyUpdate = function (update) {
  var patch = update[0];
  try {
    this._doc = jiff.patch(patch, this._doc, this._hashFunction);
    this._store.push(update);

    this._persist.set('_doc', this._doc);
    // persist should support failure of this assignment
    this._persist.set('_updates', this._store);
  } catch (e) {
    debug('skipping patch', e);
    return false;
  }

  this.emit('change', this._doc);

  return true;
};

ScuttlePatch.prototype.toJSON = function() {
  // clone _doc
  return JSON.parse(JSON.stringify(this._doc));
};
