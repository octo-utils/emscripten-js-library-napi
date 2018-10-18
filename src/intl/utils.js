/*
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
*/
export var status_error_info = void 0;

export function getStatusErrorInfo() {
	if (INTL.status_error_info) return INTL.status_error_info;

	INTL.status_error_info = Object.keys(INTL._status_msgs).map(function(key, i) {
		/* eslint-disable no-undef */
		// allocate space
		var ptr = allocate(16, 'i8', ALLOC_STATIC);
		if (i > 0) {
			var msg = INTL._status_msgs[key];
			HEAPU32[ptr >> 2] = allocate(intArrayFromString(msg), 'i8', ALLOC_STATIC);
		}
		HEAPU32[(ptr >> 2) + 3] = i;
		return ptr;
	});

	return INTL.status_error_info;
};

export function getValue(handle) {
	return INTL.handles[handle || INTL.undefined_handle];
}

export function createValue(value) {
	let index = INTL.handles.indexOf(value);
	if (index === -1) {
		index = INTL.handles.push(value) - 1;
	}
	return index;
}

export function setResult(result, value) {
	HEAPU32[result >> 2] = value;
	return INTL.STATUS.Ok();
}

export function setValue(result, value) {
	return INTL.setResult(result, INTL.createValue(value));
}

export function createReference(value) {
	let ref = INTL.references.indexOf(value);
	if (ref < 0) {
		ref = INTL.references.length;
		INTL.references.push(value);
	}
	return ref;
}

export function deleteReference(value) {
	let ref = INTL.references.indexOf(value);
	if (ref >= 0) {
		INTL.references[ref] = void 0;
	}
	return ref;
}

export function setPendingException(exception) {
	INTL.caughtException(exception);
	return INTL.STATUS.Ok();
}

export function throwException(Ctor, code, msg) {
	let err = new Ctor(UTF8ToString(msg));
	if (code !== 0) {
		err.code = UTF8ToString(code);
	}
	throw err;
	// return INTL.setPendingException(err);
}

export function createException(Ctor, code, msg, result) {
	let err = new Ctor(INTL.getValue(msg));
	if (code !== 0) {
		err.code = INTL.getValue(code);
	}
	return INTL.setValue(result, err);
}

export function hasPendingException() {
	// INTL._ensureHandlesInit();
	return INTL._pending_exception !== INTL.SENTINEL;
}

export function caughtException(exception) {
	// console.log(exception); // debug
	INTL._pending_exception = exception;
	return INTL.STATUS.PendingException();
}

export function extractPendingException() {
	// INTL._ensureHandlesInit();
	var exception = INTL._pending_exception;
  // todo: if exception === INTL.SENTINEL
	INTL._pending_exception = INTL.SENTINEL;
	return exception;
}

export let _native_depth = 0;

export function createScope() {
	INTL._native_depth++;
	return INTL.handles.length;
}

export function leaveScope(scope) {
	INTL.handles.length = scope;
  INTL._native_depth = INTL._native_depth - 1;
	if (INTL._native_depth === 0 && INTL.hasPendingException()) {
		// exited topmost native method
		throw INTL.extractPendingException();
	}
}

export function withNewScope(callback) {
	var scope = INTL.createScope();
	var result = callback();
	INTL.leaveScope(scope);
	return result;
}

export function wrapCallback(ptr, data, name = "") {
	var func = INTL.getFunctionPointer(ptr);

	if (!name) {
		return function () {
			var cbInfo = {
				this: this,
				args: Array.prototype.slice.call(arguments),
				data: data,
			};
			return INTL.withNewScope(function () {
				var result = func(0, INTL.createValue(cbInfo));
				return INTL.getValue(result);
			});
		};
	}
	return new Function('ptr', 'data', 'func', 'INTL', `
		return function ${name}(/*...args*/) {
			var cbInfo = {
				this: this,
				args: Array.prototype.slice.call(arguments),
				data: data,
			};
			return INTL.withNewScope(function() {
				var result = func(0, INTL.createValue(cbInfo));
				return INTL.getValue(result);
			});
		};
	`)(ptr, data, func, INTL);
}

export function readString(ptr, length) {
	// TODO ???;
	return length === -1 ? UTF8ToString(ptr) : Pointer_stringify(ptr, length);
}

export function writeString(ptr, string, length) {
	return stringToUTF8(ptr, string, length);
}

export function safeJS(result, toValue, callback, ...args) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	let resultValue;
	try {
		resultValue = callback.apply(null, args);
	} catch (exception) {
		return INTL.caughtException(exception);
	}
	if (toValue) {
		resultValue = INTL.createValue(resultValue);
	}
	return INTL.setResult(result, resultValue);
}

export function safeCheckTag(result, value, tag) {
	const objToString = Object.prototype.toString;
	return INTL.safeJS(
		result,
		false,
		function(value) {
			// can fail on a revoked Proxy
			// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
			return objToString.call(value) === '[object ' + tag + ']';
		},
		value
	);
}

export function readProps(propCount, props) {
	const { property_attributes, handles } = INTL;
	let props_ = props >> 2;
	let result = [];
	
	if (propCount === 0) return result;

  for (var i = 0; i < propCount; i++) {
		// typedef struct {
		//   // One of utf8name or name should be NULL.
		//   const char* utf8name;
		//   napi_value name;

		//   napi_callback method;
		//   napi_callback getter;
		//   napi_callback setter;
		//   napi_value value;

		//   napi_property_attributes attributes;
		//   void* data;
		// } napi_property_descriptor;

		var name_ptr = HEAPU32[props_++];
		var name_handle = HEAPU32[props_++];
		var name = name_ptr ? UTF8ToString(name_ptr) : handles[name_handle];
		var method_ptr = HEAPU32[props_++];
		var getter_ptr = HEAPU32[props_++];
		var setter_ptr = HEAPU32[props_++];
		var value_handle = HEAPU32[props_++];
		var attributes = HEAPU32[props_++];
		var data = HEAPU32[props_++];

		var descriptor = {
			name,
			enumerable: !!(attributes & property_attributes.enumerable),
			configurable: !!(attributes & property_attributes.configurable),
			static: !!(attributes & property_attributes.static)
		};

    if (value_handle || method_ptr) {
      descriptor.writable = !!(attributes & property_attributes.writable);
      descriptor.value = value_handle ? handles[value_handle] : INTL.wrapCallback(method_ptr, data)
    } else {
			if (getter_ptr !== 0) {
				var get_func = INTL.getFunctionPointer(getter_ptr);
				descriptor.get = INTL.wrapCallback(getter_ptr, data)
			}
			if (setter_ptr !== 0) {
				descriptor.set = INTL.wrapCallback(setter_ptr, data)
			}
		}
		result.push(descriptor);
	}
	return result;
}

export function isNativeReflectConstruct() {
	if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	if (Reflect.construct.sham) return false;
	if (typeof Proxy === "function") return true;
	try {
		Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
		return true;
	} catch (e) {
		return false;
	}
}

export function callConstructor(Parent, args, Class) {
	var _construct;
	if (INTL.isNativeReflectConstruct()) {
		_construct = Reflect.construct;
	} else {
		_construct = function _construct(Parent, args, Class) {
			var a = [null];
			a.push.apply(a, args);
			var Constructor = Function.bind.apply(Parent, a);
			var instance = new Constructor();
			if (Class) INTL._setPrototypeOf(instance, Class.prototype);
			return instance;
		};
	}
	
	return _construct.apply(null, arguments);
}

export function _setPrototypeOf(o, p) {
	INTL._setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return INTL._setPrototypeOf(o, p);
}

export function getFunctionPointer(ptr) {
	if (typeof invoke_iii === "function") {
		return function() {
			var args = Array.prototype.slice.call(arguments);
			var argsLength = args.length;
			return invoke_iii.apply(null, [ptr].concat(args)); 
		}
	}
	throw "function table not found";
}
