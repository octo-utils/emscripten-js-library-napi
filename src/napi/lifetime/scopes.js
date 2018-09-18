import * as INTL from "../../intl"

export function napi_open_handle_scope(env, result) {
	HEAPU32[result >> 2] = INTL.createScope();
	return INTL.STATUS.Ok();
}

export function napi_close_handle_scope(env, scope) {
	INTL.leaveScope(scope);
	return INTL.STATUS.Ok();
}

export function napi_open_escapable_handle_scope(env, result) {
	var status = napi_open_handle_scope(env, result);
	INTL.handles.push(INTL.SENTINEL);
	return status;
}

export function napi_close_escapable_handle_scope(env, scope) {
  var { handles, SENTINEL } = INTL;
  var scope_ = scope;
	if (INTL.handles[scope_] !== SENTINEL) {
		// a value has escaped, need to keep it
		scope_++;
	}
	return napi_close_handle_scope(env, scope_);
}

export function napi_escape_handle(env, scope, escapee, result) {
  var { handles, SENTINEL, STATUS } = INTL;
  var scope_ = scope;
	if (handles[scope_] !== SENTINEL) {
		// something has already escaped
		return STATUS.GenericFailure();
	}
	handles[scope_] = handles[escapee];
	HEAPU32[result >> 2] = scope_;
	return STATUS.Ok();
}
