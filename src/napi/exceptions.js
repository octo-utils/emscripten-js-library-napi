import * as INTL from "../intl"

export function napi_fatal_error(location, locationLength, msg, msgLength) {
	const location_ = INTL.readString(location, locationLength);
	const msg_ = INTL.readString(msg, msgLength);
	const err = new Error(`Fatal Error: ${location_} ${msg_}`);
	err.stack = "";
	throw err;
}

export function napi_create_error(env, code, msg, result) {
	return INTL.createException(Error, code, msg, result);
}

export function napi_create_type_error(env, code, msg, result) {
	return INTL.createException(TypeError, code, msg, result);
}

export function napi_create_range_error(env, code, msg, result) {
	return INTL.createException(RangeError, code, msg, result);
}

export function napi_throw(env, error) {
	const status = INTL.setPendingException(INTL.handles[error]);
	throw INTL._pending_exception;
	return status;
}

export function napi_throw_error(env, code, msg) {
	const status = INTL.throwException(Error, code, msg);
	throw INTL._pending_exception;
	return status;
}

export function napi_throw_type_error(env, code, msg) {
	const status = INTL.throwException(TypeError, code, msg);
	throw INTL._pending_exception;
	return status;
}

export function napi_throw_range_error(env, code, msg) {
	const status = INTL.throwException(RangeError, code, msg);
	throw INTL._pending_exception;
	return status;
}

export function napi_is_exception_pending(env, result) {
	return INTL.setResult(result, INTL.hasPendingException());
}

export function napi_get_and_clear_last_exception(env, result) {
	return INTL.setValue(result, INTL.extractPendingException());
}

export function napi_get_last_error_info(env, result) {
	return INTL.setResult(result, INTL.getStatusErrorInfo()[lastError]);
}
