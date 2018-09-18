import * as INTL from "../../intl"

export function napi_create_reference(env, value, nitial_refcount, result) {
  var handle_index = INTL.createValue(value);
  HEAPU32[result >> 2] = handle_index; // ref is handle_index itself
  return INTL.STATUS.Ok();
}

export function napi_delete_reference(env, ref) {
  INTL.releaseValueByIndex(ref);
  return INTL.STATUS.Ok();
}

export function napi_get_reference_value(env, ref, result) {
  return ref;
}
