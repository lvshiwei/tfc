export const isNull = (v) => v === null;
export const isUndefined = (v) => typeof v === 'undefined';
export const isNullOrUndefined = (v) => isNull(v) || isUndefined(v);
export const isValuable = (v) => !isNullOrUndefined(v);
export const isNotEmptyArray = (v) => Array.isArray(v) && v.length > 0;
export const isArrayButEmpty = (v) => Array.isArray(v) && v.length === 0;
export const isNotEmptyString = (v) => typeof v === 'string' && v.length > 0;
export const isPositiveNumber = (v) => typeof v === 'number' && v > 0;
export const isNegativeNumber = (v) => typeof v === 'number' && v < 0;
export const isFunction = (v) => typeof v === 'function';

export const isRealNumber = (v) =>
  v === 0 || isPositiveNumber(v) || isNegativeNumber(v);
export const isPureObject = (v) =>
  typeof v === 'object' && v.constructor === 'Object';
