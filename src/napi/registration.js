"use strict";
import * as INTL from "../intl"

export function napi_module_register(info) {
  const scope = INTL.createScope();

  const info_ = INTL.readModule(info);
  const exports_handle = INTL.createValue(INTL.getExports());
  const new_exports_handle = (0, info_.registerFunc)(0, exports_handle);

  if (new_exports_handle !== 0 && new_exports_handle !== exports_handle) {
    const exports_ = INTL.getValue(new_exports_handle);
    INTL.setExports(exports_);
  } else if (module.exports !== INTL.getExports()) {
    INTL.setExports(INTL.getExports());
  }

  INTL.leaveScope(scope);
}
