import * as INTL from "../../intl"

export function napi_create_reference(env, value, nitial_refcount, result) {
  // value's ref is value's ptr itself
  // console.log("napi_create_reference", value, INTL.handles[value]);
  return INTL.setResult(result, INTL.createReference(INTL.handles[value]))
}

export function napi_delete_reference(env, ref) {
  // INTL.releaseValueByIndex(ref);
  INTL.deleteReference(INTL.references[ref])
  return INTL.STATUS.Ok();
}

export function napi_get_reference_value(env, ref, result) {
  // console.log("napi_get_reference_value", ref, INTL.references[ref]);
  return INTL.setResult(result, INTL.createValue(INTL.references[ref]));
}
