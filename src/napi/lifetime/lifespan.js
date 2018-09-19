import * as INTL from "../../intl"

export function napi_create_reference(env, value, nitial_refcount, result) {
  HEAPU32[result >> 2] = value; // value's ref is value's ptr itself
  return INTL.STATUS.Ok();
}

export function napi_delete_reference(env, ref) {
  INTL.releaseValueByIndex(ref);
  return INTL.STATUS.Ok();
}

export function napi_get_reference_value(env, ref, result) {
  INTL.setResult(result, ref);
  return INTL.STATUS.Ok();
}
