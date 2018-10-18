const path = require("path");
const { expect } = require("chai");
const shell = require("shelljs");

const relativeDir = relative => path.join(__dirname, relative);



describe('test-node-official', function() {
  const cases = [
    "1_hello_world",
    "2_function_arguments",
    "3_callbacks",
    "4_object_factory",
    "5_function_factory",
    "6_object_wrap",
    "7_factory_wrap",
    "8_passing_wrapped"
  ];

  before(function(done) {
    this.enableTimeouts(false);
    cases.forEach(function(caseItem) {
      const casePath = relativeDir(`./fixtures-official/addons-api/${caseItem}`);
      shell.cd(casePath);
      shell.rm("-f", path.join(casePath, "/build/Release/binding.js"));
      shell.rm("-f", path.join(casePath, "/build/Release/binding.node"));
      shell.exec("npm run build:asmjs --color=always");
      shell.exec("npm run build:node --color=always");
      shell.cd(__dirname);
    });
    done();
  });

  it('test.js with binding.node', function() {
    this.slow(50000);
    this.timeout(10000);
    cases.forEach(function(caseItem) {
      const casePath = relativeDir(`./fixtures-official/addons-api/${caseItem}`);
      shell.cd(casePath);
      shell.exec("node test.js");
      shell.cd(__dirname);
    })
  });

  it('test.js with binding.js(asmjs)', function() {
    this.slow(80000);
    this.timeout(20000);
    cases.forEach(function(caseItem) {
      const casePath = relativeDir(`./fixtures-official/addons-api/${caseItem}`);
      shell.cd(casePath);
      shell.exec("node test.js --binding asmjs");
      shell.cd(__dirname);
    })
  });

  it.skip('test.js with binding_wasm.js(wasm)', function() {
    // TODO:...
  });

})
