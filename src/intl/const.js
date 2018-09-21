
export const sentinel_handle = 0;
export const undefined_handle = 1;
export const null_handle = 2;
export const bool_handle = 3;
export const global_handle = 5;

export const SENTINEL = void 0;

export let handles = [
	"___", // sentinel
	undefined,
	null,
	false,
	true,
  "___", // INTL.getGlobal()
];

export let _pending_exception = void 0;

export function _ensureHandlesInit() {
	if (!INTL.SENTINEL) {
		INTL.handles[0] = INTL._pending_exception 
			= INTL.references[0] 
			= INTL.SENTINEL
			= Symbol();
  	INTL.handles[INTL.global_handle] = INTL.getGlobal();
	}
}

export let references = [
	"___", // sentinel
];

export const _status_msgs = {
	Ok: '',
	InvalidArgument: 'Invalid pointer passed as argument',
	ObjectExpected: 'An object was expected',
	StringExpected: 'A string was expected',
	NameExpected: 'A string or symbol was expected',
	FunctionExpected: 'A function was expected',
	NumberExpected: 'A number was expected',
	BooleanExpected: 'A boolean was expected',
	ArrayExpected: 'An array was expected',
	GenericFailure: 'Unknown failure',
	PendingException: 'An exception is pending',
	Cancelled: 'The async work item was cancelled',
};

export var _last_error = 0;

export var STATUS = Object.keys(_status_msgs).reduce(function(result, key, i) {
	result[key] = new Function(`INTL._last_error = ${i}`);
	return result;
}, {});

export let _exports_ref = void 0;
export let _module_ref = void 0;

export function readModule(ptr) {
	ptr >>= 2;
	return {
		version: HEAPU32[ptr++],
		flags: HEAPU32[ptr++],
		filename: UTF8ToString(HEAPU32[ptr++]),
		registerFunc: INTL.getFunctionPointers()[HEAPU32[ptr++]],
		modname: UTF8ToString(HEAPU32[ptr++]),
	};
}

export function getGlobal() {
  return typeof global !== "undefined" ? global : typeof self !== "undefined" ? 
    self : typeof window !== "undefined" ? window : {};
}

export function getModule() {
  if (typeof INTL.exports_ref === 'undefined') {
    INTL._module_ref = typeof module !== 'undefined' ? module : { exports: {} };
  }
  return INTL._module_ref;
}

export function getExports() {
  if (!INTL._exports_ref) {
    const module = INTL.getModule();
    if (module.exports === Module) {
      module.exports = {};
    }
    INTL._exports_ref = module.exports;
  }
  return INTL._exports_ref;
}

export function setExports(new_exports) {
  const module = INTL.getModule();
  module.exports = new_exports;
}

export const property_attributes = Object.freeze({
	default: 0,
	writable: 1 << 0,
	enumerable: 1 << 1,
	configurable: 1 << 2,
	static: 1 << 10,
});

export const value_type = {
	undefined: 0,
	null: 1,
	boolean: 2,
	number: 3,
	string: 4,
	symbol: 5,
	object: 6,
	function: 7,
	external: 8,
};

export const _symbol_napi_wrap = void 0;

export function getKeyNapiWrap() {
	if (!INTL._symbol_napi_wrap) {
		INTL._symbol_napi_wrap = Symbol("NAPI_WRAP_KEY");
	}
	return INTL._symbol_napi_wrap;
}
