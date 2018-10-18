'use strict';
const common = require('../../common');
const commonBindingName = require("../../common-require-binding-name");
const assert = require('assert');
const bindingPath = require.resolve(`./build/${common.buildType}/${commonBindingName()}`);
const binding = require(bindingPath);

assert.strictEqual(binding.hello(), 'world');

// Test multiple loading of the same module.
delete require.cache[bindingPath];
const rebinding = require(bindingPath);
assert.strictEqual(rebinding.hello(), 'world');
assert.notStrictEqual(binding.hello, rebinding.hello);
