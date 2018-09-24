#include <stdio.h>
#include <node_api.h>
#include <assert.h>
#include <string>

#define DECLARE_NAPI_FUNCTION(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

#define DECLARE_NAPI_VALUE(name, value)                          \
  { name, 0, 0, 0, 0, value, napi_default, 0 }

class SomeClass {
  public:
    int value;
    SomeClass() {
      value = 0;
    };
    void setValue(int value_to_set) {
      this -> value = value_to_set;
    };
};

static SomeClass global_instance;

napi_value Noop(napi_env env, napi_callback_info info) {
  // napi_status status;
  napi_value result;
  napi_get_undefined(env, &result);
  return result;
}

napi_value CreateFatalError(napi_env env, napi_callback_info info) {
  std::string location = "fatal_error_location";
  std::string message = "fatal_error_message";

  napi_fatal_error(location.c_str(), location.size(), message.c_str(), message.size());

  napi_value result;
  napi_get_undefined(env, &result);
  return result;
}

napi_value Method(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value world;
  status = napi_create_string_utf8(env, "world", 5, &world);
  assert(status == napi_ok);
  return world;
}

napi_value SomeClassCtor(napi_env env, napi_callback_info info) {
  // printf("global_instance %d\n", global_instance.value);
  napi_status status;

  size_t argc = 1;
  napi_value args[1];
  napi_value _this;
  status = napi_get_cb_info(env, info, &argc, args, &_this, nullptr);

  napi_value new_target;
  status = napi_get_new_target(env, info, &new_target);

  {
    napi_property_descriptor desc = DECLARE_NAPI_VALUE("new_target", new_target);
    status = napi_define_properties(env, _this, 1, &desc);
  }

  napi_value result;
  napi_get_undefined(env, &result);

  return result;
}

napi_value Init(napi_env env, napi_value exports) {
  global_instance = SomeClass();
  global_instance.setValue(233);
  printf("should output 233, actual %d\n", global_instance.value);
  // printf("global_instance %d\n", global_instance.value);

  napi_status status;
  {
    napi_property_descriptor desc = DECLARE_NAPI_FUNCTION("hello", Method);
    status = napi_define_properties(env, exports, 1, &desc);
  }
  
  {
    napi_property_descriptor desc = DECLARE_NAPI_FUNCTION("createFatalError", CreateFatalError);
    status = napi_define_properties(env, exports, 1, &desc);
  }

  /** napi_define_class, napi_get_new_target **/
  napi_value class_value;
  std::string class_name = "SomeClass";
  napi_value bar_value;
  std::string bar_str = "bar";
  status = napi_create_string_utf8(env, bar_str.c_str(), bar_str.size(), &bar_value);

  napi_property_descriptor class_desc[] = {
    { "foo", 0, Noop, 0, 0, 0, napi_default, 0 },
    { "bar_enumerable", 0, 0, 0, 0, bar_value, static_cast<napi_property_attributes>(napi_default | napi_enumerable), 0 }
  };
  status = napi_define_class(env, class_name.c_str(), class_name.size(), SomeClassCtor, 0, sizeof(class_desc) / sizeof(class_desc[0]), class_desc, &class_value);

  {
    napi_property_descriptor desc = DECLARE_NAPI_VALUE(class_name.c_str(), class_value);
    status = napi_define_properties(env, exports, 1, &desc);
  }
  /****/

  /** napi_new_instance **/
  napi_value class_instance;
  status = napi_new_instance(env, class_value, 0, nullptr, &class_instance);
  {
    napi_property_descriptor desc = DECLARE_NAPI_VALUE("SomeClass_instance", class_instance);
    status = napi_define_properties(env, exports, 1, &desc);
  }
  /****/

  /** napi_create_reference, napi_delete_reference **/
  {
    napi_value something;
    napi_create_object(env, &something);
    napi_ref something_ref;
    napi_create_reference(env, something, 1, &something_ref);
    napi_delete_reference(env, something_ref);
  }
  /****/

  // /** napi_wrap, napi_unwrap **/

  // /****/
  
  if (status != napi_ok) {
    const napi_extended_error_info *error_info;
    napi_get_last_error_info(env, &error_info);
    napi_throw_error(env, nullptr, error_info -> error_message);
  }

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
