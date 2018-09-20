"use strict";
import * as INTL from "../intl"

export function napi_module_register(info) {
  INTL._ensureHandlesInit();
  
  const info_ = INTL.readModule(info);
  const exports_handle = INTL.createValue(INTL.getExports());
  const new_exports_handle = (0, info_.registerFunc)(0, exports_handle);
  INTL.releaseValue(INTL.getExports());

  if (new_exports_handle !== 0 && new_exports_handle !== exports_handle) {
    const exports_ = INTL.handles[new_exports_handle];
    INTL.setExports(exports_);
  }
}
