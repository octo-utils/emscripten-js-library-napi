#include "myobject.h"
#include "../common.h"
#include <stdio.h>
#include <set>

napi_value ReleaseObject(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

  MyObject* obj = nullptr;
  NAPI_CALL(env, napi_unwrap(env, args[0], reinterpret_cast<void**>(&obj)));

  bool is_in_pool = MyObject::pool.find(obj) != MyObject::pool.end();

  if (is_in_pool) {
    MyObject::Destructor(env, obj, nullptr); // release memory manually
    MyObject::pool.erase(obj);
  }
  
  napi_value result;
  napi_get_boolean(env, is_in_pool, &result);
  return result;
}

napi_value CreateObject(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value args[1];
  NAPI_CALL(env, napi_get_cb_info(env, info, &argc, args, nullptr, nullptr));

  napi_value instance;
  NAPI_CALL(env, MyObject::NewInstance(env, args[0], &instance));

  return instance;
}

napi_value Init(napi_env env, napi_value exports) {
  NAPI_CALL(env, MyObject::Init(env));

  napi_property_descriptor descriptors[] = {
    DECLARE_NAPI_GETTER("finalizeCount", MyObject::GetFinalizeCount),
    DECLARE_NAPI_PROPERTY("createObject", CreateObject),
    DECLARE_NAPI_PROPERTY("releaseObject", ReleaseObject),
  };

  NAPI_CALL(env, napi_define_properties(
      env, exports, sizeof(descriptors) / sizeof(*descriptors), descriptors));

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
