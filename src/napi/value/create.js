"use strict";
import * as INTL from "../../intl"

export function napi_create_string_utf8(env, str, length, result) {
  return INTL.setValue(result, INTL.readString(str, length));
}

export function napi_create_int32(env, value, result) {
	return napi_create_double(env, value, result);
}

export function napi_create_uint32(env, value, result) {
	return napi_create_double(env, value, result >>> 0);
}

export function napi_create_double(env, value, result) {
	return INTL.setValue(result, value);
}

export function napi_create_object(env, result) {
	return INTL.setValue(result, {});
}

export function napi_create_array(env, result) {
	return INTL.setValue(result, []);
}

export function napi_create_array_with_length(env, length, result) {
	return INTL.setValue(result, new Array(length));
}

export function napi_create_symbol(env, description, result) {
	description = description ? INTL.getValue(description) : '';
	return INTL.setValue(result, Symbol(description));
}
