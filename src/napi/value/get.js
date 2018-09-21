import * as INTL from "../../intl"

export function napi_get_boolean(env, value, result) {
	return INTL.setResult(result, INTL.bool_handle + value);
}

export function napi_get_null(env, result) {
	return INTL.setResult(result, INTL.null_handle);
}

export function napi_get_undefined(env, result) {
	return INTL.setResult(result, INTL.undefined_handle);
}

export function napi_get_global(env, result) {
	return INTL.setResult(result, INTL.global_handle);
}

export function napi_get_value_double(env, value, result) {
	var value_ = INTL.handles[value];
	if (typeof value_ !== 'number') {
		return INTL.STATUS.NumberExpected();
	}
	HEAPF64[result >> 3] = value_;
	return INTL.STATUS.Ok();
}

export function napi_get_value_uint32(env, value, result) {
	var value_ = INTL.handles[value];
	if (typeof value_ !== 'number') {
		return INTL.STATUS.NumberExpected();
	}
	return INTL.setResult(result, value_);
}

export function napi_get_value_int32(env, value, result) {
	return napi_get_value_uint32(env, value, result);
}

export function napi_get_value_bool(env, value, result) {
	var value_ = INTL.handles[value];
	if (typeof value_ !== 'boolean') {
		return INTL.STATUS.BooleanExpected();
	}
	return INTL.setResult(result, value_);
}

export function napi_get_array_length(env, value, result) {
	var value_ = INTL.handles[value];
	if (!Array.isArray(value_)) {
		return INTL.STATUS.ArrayExpected();
	}
	return INTL.setResult(result, value_.length);
}

export function napi_get_value_string_utf8(env, value, buf, bufSize, result) {
	var value_ = INTL.handles[value];
	if (typeof value_ !== "string") {
		return INTL.STATUS.StringExpected();
	}

	var bufSize_ = bufSize;
	if (bufSize === 0) {
		bufSize_ = value_.length + 1;
	}

	return INTL.setResult(result, INTL.writeString(value_, buf, bufSize_));
}
