import * as INTL from "../../intl"

export function napi_get_cb_info(env, cbinfoPtr, argcPtr, argvPtr, thisArgPtr, dataPtrPtr) {
	const { STATUS, handles } = INTL;
	var cbinfo = handles[cbinfoPtr];
	var argcPtr_ = argcPtr >> 2;
	var argc = argcPtr_ === 0 ? 0 : HEAPU32[argcPtr_];
	var actualArgc = cbinfo.args.length;
	HEAPU32[argcPtr_] = actualArgc;
	if (argc < actualArgc) {
		actualArgc = argc;
	}
	var argvPtr_ = argvPtr >> 2;
	var i = 0;
	for (; i < actualArgc; i++) {
		HEAPU32[argvPtr_ + i] = INTL.createValue(cbinfo.args[i]);
	}
	for (; i < argc; i++) {
		HEAPU32[argvPtr_ + i] = INTL.undefined_handle;
	}

	if (thisArgPtr !== 0) {
		INTL.setValue(thisArgPtr, cbinfo.this);
	}
	if (dataPtrPtr !== 0) {
		HEAPU32[dataPtrPtr >> 2] = cbinfo.data;
	}

	return STATUS.Ok();
}

export function napi_create_function(env, namePtr, nameLen, cb, data, result) {
	var func = INTL.wrapCallback(cb, data, INTL.readString(namePtr, nameLen));
	return INTL.setValue(result, func);
}

export function napi_call_function(env, recv, func, argc, argv, result) {
	const { STATUS, handles } = INTL;
	if (INTL.hasPendingException()) {
		return STATUS.PendingException();
	}
	var recv_ = handles[recv];
	var func_ = handles[func];
	var argv_ = argv >> 2;
	var args = new Array(argc);
	for (var i = 0; i < argc; i++) {
		args[i] = handles[HEAPU32[argv_ + i]];
	}
	try {
		return INTL.setValue(result, func_.apply(recv_, args));
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}
