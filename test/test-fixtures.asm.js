const path = require("path");
const { expect } = require("chai");
const shell = require("shelljs");

const relativeDir = relative => path.join(__dirname, relative);

describe('test-fixtures:asmjs', function() {
  before(function(done) {
    this.enableTimeouts(false);
    shell.cd(relativeDir("./fixtures/helloworld"));
    shell.rm("./build/Release/helloworld.js");
    shell.exec("npm run build:asmjs --color=always");
    shell.cd(relativeDir("./fixtures/test-any"));
    shell.rm("./build/Release/test_any.js");
    shell.exec("npm run build:asmjs --color=always");
    shell.cd(relativeDir("./"));
    done();
  });

  it('test-helloworld', function() {
    const TARGET = require("./fixtures/helloworld/build/Release/helloworld.js");
    expect(TARGET.hello).to.be.a("function");
    expect(TARGET.hello()).to.be.equal("world");
  });

  it('test-any', function() {
    const TARGET = require("./fixtures/test-any/build/Release/test_any.js");
    expect(TARGET.SomeClass).to.be.a("function");
    var callSomeClassWithoutNew = function () { TARGET.SomeClass(); };
    expect(callSomeClassWithoutNew).to.throw();
    const instance = new TARGET.SomeClass();

    expect(instance).to.have.property("foo");
    expect(instance).to.have.property("bar_enumerable");
    expect(instance.foo).to.be.a("function");
    expect(instance.bar_enumerable).to.be.equal("bar");
    expect(Object.getOwnPropertyDescriptor(instance, "bar_enumerable")).to.have.property("enumerable", true);

    expect(TARGET).to.have.property("SomeClass_instance");
    expect(TARGET.SomeClass_instance).to.be.instanceOf(TARGET.SomeClass);

    expect(instance.new_target).to.be.deep.equal(TARGET.SomeClass_instance.new_target)
    expect(instance.new_target).to.be.deep.equal({name: "SomeClass"})
  })
})

