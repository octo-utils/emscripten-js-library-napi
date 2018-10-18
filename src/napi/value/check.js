import * as INTL from "../../intl"

export function napi_is_error(env, value, result) {
	return INTL.safeCheckTag(result, INTL.getValue(value), 'Error');
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
		INTL.getValue(value),
		INTL.getValue(Ctor)
	);
}

export function napi_is_array(env, value, result) {
	// can fail on a revoked Proxy
	// https://tc39.github.io/ecma262/#sec-isarray
	return INTL.safeJS(result, false, Array.isArray, INTL.getValue(value));
}

export function napi_is_arraybuffer(env, value, result) {
	return INTL.safeCheckTag(result, INTL.getValue(value), 'ArrayBuffer');
}

export function napi_is_typedarray(env, value, result) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	// can't fail, only checks if an internal slot is present
	// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
	return INTL.setResult(result, ArrayBuffer.isView(INTL.getValue(value)));
}

export function napi_typeof(env, value, result) {
	const { value_type } = INTL;
	var value_ = INTL.getValue(value);
	var t = typeof value_;
	if (t === 'object' && value_ === null) {
		t = 'null';
	}
	return INTL.setResult(result, value_type[t]);
}

export function napi_strict_equals(env, lhs, rhs, result) {
	const { STATUS } = INTL;
	if (INTL.hasPendingException()) {
		return STATUS.PendingException();
	}
	// can't fail
	// https://tc39.github.io/ecma262/#sec-strict-equality-comparison
	return INTL.setResult(result, INTL.getValue(lhs) === INTL.getValue(rhs));
}
