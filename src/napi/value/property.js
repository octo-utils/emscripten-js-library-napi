import * as INTL from "../../intl"

export function napi_set_property(env, obj, key, value) {
	return napi_set_element(env, obj, INTL.handles[key], value);
}

export function napi_get_property(env, obj, key, result) {
	return napi_get_element(env, obj, INTL.handles[key], result);
}

export function napi_has_property(env, obj, key, result) {
	return napi_has_element(env, obj, INTL.handles[key], result);
}

export function napi_get_property_names(env, obj, result) {
	return INTL.safeJS(result, true, Object.keys, INTL.handles[obj]);
}

export function napi_set_named_property(env, obj, name, value) {
	return napi_set_element(env, obj, UTF8ToString(name), value);
}

export function napi_get_named_property(env, obj, name, result) {
	return napi_get_element(env, obj, UTF8ToString(name), result);
}

export function napi_has_named_property(env, obj, name, result) {
	return napi_has_element(env, obj, UTF8ToString(name), result);
}

export function napi_set_element(env, obj, index, value) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	// safeJS doesn't help here because we don't have result
	// so it's fine to do some duplication
	var obj_ = INTL.handles[obj];
	var value_ = INTL.handles[value];
	try {
		obj_[index] = value_;
		return INTL.STATUS.Ok();
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}

export function napi_get_element(env, obj, index, result) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	// safeJS doesn't help here because we don't have result
	// so it's fine to do some duplication
	var obj_ = INTL.handles[obj];
	try {
		return INTL.setValue(result, obj_[index]);
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}

export function napi_has_element(env, obj, index, result) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}
	// safeJS doesn't help here because we don't have result
	// so it's fine to do some duplication
	var obj_ = INTL.handles[obj];
	try {
		return INTL.setResult(result, index in obj_);
	} catch (exception) {
		return INTL.caughtException(exception);
	}
}

export function napi_define_properties(env, objPtr, propCount, props) {
	if (INTL.hasPendingException()) {
		return INTL.STATUS.PendingException();
	}

  const {
    property_attributes,
    handles
  } = INTL;

  // let props_ = props >> 2;
	const obj_ = handles[objPtr];
	const descriptors = INTL.readProps(propCount, props);

	// console.log("napi_define_properties", obj_, descriptors);
	
	for (let i = 0; i < descriptors.length; i++) {
		let desc = descriptors[i];
		try {
			Object.defineProperty(obj_, desc.name, desc);
		} catch (exception) {
			return INTL.caughtException(exception);
		}
	}
}
