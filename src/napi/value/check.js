import * as INTL from "../../intl"

export function napi_is_error(env, value, result) {
	return INTL.safeCheckTag(result, value, 'Error');
}

export function napi_instanceof(env, value, Ctor, result) {
	return INTL.safeJS(
		result,
		false,
		function(value, Ctor) {
			// can fail on non-objects and more
			// https://tc39.github.io/ecma262/#sec-instanceofoperator
			return value instanceof Ctor;
		},
		value,
		Ctor
	);
}

export function napi_is_array(env, value, result) {
	// can fail on a revoked Proxy
	// https://tc39.github.io/ecma262/#sec-isarray
	return INTL.safeJS(result, false, Array.isArray, value);
}

export function napi_is_arraybuffer(env, value, result) {
	return INTL.safeCheckTag(result, value, 'ArrayBuffer');
}

export function napi_is_typedarray(env, value, result) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	// can't fail, only checks if an internal slot is present
	// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
	return INTL.setResult(result, ArrayBuffer.isView(INTL.handles[value]));
}

export function napi_typeof(env, value, result) {
	const { value_type, handles } = INTL;
	var value_ = handles[value];
	var t = typeof value_;
	if (t === 'object' && value_ === null) {
		t = 'null';
	}
	return INTL.setResult(result, value_type[t]);
}

export function napi_strict_equals(env, lhs, rhs, result) {
	const { STATUS, handles } = INTL;
	if (INTL.hasPendingException()) {
		return STATUS.PendingException();
	}
	// can't fail
	// https://tc39.github.io/ecma262/#sec-strict-equality-comparison
	return setResult(result, handles[lhs] === handles[rhs]);
}
