const TARGET = require("./fixtures/test-any/build/Release/test_any.js");
const { expect } = require("chai");

describe('test-all', function() {
  it('napi_define_class', function() {
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

