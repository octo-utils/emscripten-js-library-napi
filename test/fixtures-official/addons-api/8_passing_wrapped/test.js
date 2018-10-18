'use strict';
const common = require('../../common');
const commonBindingName = require("../../common-require-binding-name");
const assert = require('assert');
const bindingPath = require.resolve(`./build/${common.buildType}/${commonBindingName()}`);
const addon = require(bindingPath);

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);
assert.strictEqual(result, 30);
