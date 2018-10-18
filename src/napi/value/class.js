import * as INTL from "../../intl"

export function napi_define_class(env, namePtr, nameLen, ctorPtr, data, propCount, props, result) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
  
  var className = INTL.readString(namePtr, nameLen);
  var descriptors = INTL.readProps(propCount, props);

  var descriptorsStatic = Object.create(null);
  var descriptorsOfValue = Object.create(null);
  var descriptorsEtc = Object.create(null);

  for (let i = 0; i < descriptors.length; i++) {
    var descriptor = descriptors[i];
    var typeofDescriptorValue = typeof descriptor.value
    if (descriptor.static) {
      descriptorsStatic[descriptor.name] = descriptor;
    } else {
      if (typeofDescriptorValue !== "function" && !descriptor.get && !descriptor.set) {
        descriptorsOfValue[descriptor.name] = descriptor;
      } else {
        descriptorsEtc[descriptor.name] = descriptor;
      }
    }
  }

  var classCtor = new Function('ctor', 'data', 'descriptorsOfValue', 'INTL', `
  var Ctor_ = function ${className} (/*...args*/) {
    if (!(this instanceof Ctor_)) {
      throw new TypeError("Class constructor a cannot be invoked without 'new'");
    };
    if (INTL.hasPendingException()) {
      return INTL.STATUS.PendingException();
    }
    var cbInfo = {
      this: this,
      args: Array.prototype.slice.call(arguments),
      data,
      __newTarget: Object.freeze({ name: "${className}" })
    };
    Object.defineProperties(this, descriptorsOfValue);
    ctor(0, INTL.createValue(cbInfo));
  };
  Ctor_.toString = function() { 
    return "class ${className} { [emscripten-js-library-napi internal code] }";
  };
  return Ctor_;`
	)(INTL.getFunctionPointer(ctorPtr), data, descriptorsOfValue, INTL);

  Object.defineProperties(classCtor, descriptorsStatic);
  Object.defineProperties(classCtor.prototype, descriptorsEtc);

  try {
		return INTL.setValue(result, classCtor);
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}

export function napi_get_new_target(env, cbInfoPtr, result) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
  
  var cbInfo = INTL.getValue(cbInfoPtr);
  if (cbInfo.__newTarget) {
    return INTL.setValue(result, cbInfo.__newTarget);
  }
  return INTL.setResult(result, INTL.null_handle);
}

export function napi_new_instance(env, classCtorPtr, argc, argv, result) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}

  const { handles } = INTL;

  var classCtor = handles[classCtorPtr];

  if (typeof classCtor !== "function" || classCtorPtr < INTL.global_handle) {
    return INTL.STATUS.FunctionExpected();
  }

  var argv_ = argv >> 2;
	var args = new Array(argc);
  for (var i = 0; i < argc; i++) {
		args[i] = handles[HEAPU32[argv_ + i]];
	}

  try {
		return INTL.setValue(result, INTL.callConstructor(classCtor, args));
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}

export function napi_wrap(
  env, objectPtr, nativeObjectPtr, nativeFinalizeCallbackPtr, finalizeHint, result
) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}

  var object = INTL.getValue(objectPtr);

  Object.defineProperty(object, INTL.getKeyNapiWrap(), {
    enumerable: false,
    writable: true,
    value: Object.freeze([nativeObjectPtr, nativeFinalizeCallbackPtr, finalizeHint])
  });

  return INTL.setResult(result, INTL.createReference(object));
}

export function napi_unwrap(env, objectPtr, result) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}

  var object = INTL.getValue(objectPtr);
  var wrapped_info = object[INTL.getKeyNapiWrap()];

  if (typeof object !== "object") {
    return INTL.STATUS.GenericFailure();
  }

  if (Array.isArray(wrapped_info)) {
    var nativeObjectPtr = wrapped_info[0];
    INTL.setResult(result, nativeObjectPtr);
  } else {
    return INTL.STATUS.GenericFailure();
  }

  return INTL.STATUS.Ok();
}

export function napi_remove_wrap(env, objectPtr, result) {
  if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}

  var object = INTL.getValue(objectPtr);
  var wrapped_info = object[INTL.getKeyNapiWrap()];

  if (Array.isArray(wrapped_info)) {
    var nativeObjectPtr = wrapped_info[0];
    INTL.setResult(result, nativeObjectPtr);
    object[INTL.getKeyNapiWrap()] = void 0;
  } else {
    return INTL.STATUS.GenericFailure();
  }

  return INTL.STATUS.Ok();
}
