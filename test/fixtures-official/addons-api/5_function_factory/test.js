'use strict';
const common = require('../../common');
const commonBindingName = require("../../common-require-binding-name");
const assert = require('assert');
const bindingPath = require.resolve(`./build/${common.buildType}/${commonBindingName()}`);
const addon = require(bindingPath);

const fn = addon();
assert.strictEqual(fn(), 'hello world'); // 'hello world'
