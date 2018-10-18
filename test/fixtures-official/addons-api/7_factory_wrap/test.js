'use strict';
// Flags: --expose-gc
const common = require('../../common');
const commonBindingName = require("../../common-require-binding-name");
const assert = require('assert');
const bindingPath = require.resolve(`./build/${common.buildType}/${commonBindingName()}`);
const test = require(bindingPath);

assert.strictEqual(test.finalizeCount, 0);
(() => {
  const obj = test.createObject(10);
  assert.strictEqual(obj.plusOne(), 11);
  assert.strictEqual(obj.plusOne(), 12);
  assert.strictEqual(obj.plusOne(), 13);
  assert.strictEqual(test.releaseObject(obj), true); // release manually
})();
if (typeof global.gc === "function") {
  global.gc();
}
assert.strictEqual(test.finalizeCount, 1);

(() => {
  const obj2 = test.createObject(20);
  assert.strictEqual(obj2.plusOne(), 21);
  assert.strictEqual(obj2.plusOne(), 22);
  assert.strictEqual(obj2.plusOne(), 23);
  assert.strictEqual(test.releaseObject(obj2), true); // release manually
  assert.strictEqual(test.releaseObject(obj2), false); //
})();
if (typeof global.gc === "function") {
  global.gc();
}
assert.strictEqual(test.finalizeCount, 2);
