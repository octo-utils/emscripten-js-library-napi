#!/usr/bin/env node

// This script prints out the absolute path to the emcc wrapper script in
// this directory. node-gyp make_global_settings CXX and LINK require
// absolute paths to the compiler.

const path = require("path");
process.stdout.write(path.resolve(__dirname, 'emcc'));
