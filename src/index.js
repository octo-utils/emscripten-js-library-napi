
"use strict";
import * as INTL from "./intl"

import { napi_module_register } from "./napi/registration";
import * as valueProperty from "./napi/value/property";
import * as valueCheck from "./napi/value/check";
import * as valueCreate from "./napi/value/create";
import * as functions from "./napi/value/functions";
import * as valueGet from "./napi/value/get";
import * as valueClass from "./napi/value/class";
import * as exceptions from "./napi/exceptions";
import * as scopes from "./napi/lifetime/scopes";
import * as lifespan from "./napi/lifetime/lifespan";

const $INTL = INTL;

const LibraryNapi = {
  $INTL,
  napi_module_register__postset: `
  INTL._ensureHandlesInit();
  `,
  napi_module_register,
  ...valueProperty,
  ...valueCheck,
  ...valueCreate,
  ...functions,
  ...valueClass,
  ...valueGet,
  ...exceptions,
  ...scopes,
  ...lifespan,
};

autoAddDeps(LibraryNapi, '$INTL');
mergeInto(LibraryManager.library, LibraryNapi);