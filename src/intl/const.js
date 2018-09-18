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
