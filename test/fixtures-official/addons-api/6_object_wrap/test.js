'use strict';
const common = require('../../common');
const commonBindingName = require("../../common-require-binding-name");
const assert = require('assert');
const bindingPath = require.resolve(`./build/${common.buildType}/${commonBindingName()}`);
const addon = require(bindingPath);

const obj = new addon.MyObject(9);
var a = obj.value;

assert.strictEqual(obj.value, 9);
obj.value = 10;
assert.strictEqual(obj.value, 10);
assert.strictEqual(obj.plusOne(), 11);
assert.strictEqual(obj.plusOne(), 12);
assert.strictEqual(obj.plusOne(), 13);

assert.strictEqual(obj.multiply().value, 13);
assert.strictEqual(obj.multiply(10).value, 130);

const newobj = obj.multiply(-1);
assert.strictEqual(newobj.value, -13);
assert.notStrictEqual(obj, newobj);
