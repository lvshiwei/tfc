/**
 * @overview prepare for generating YupSchema
 * @author shiwei.lv
 */

import { isNullOrUndefined } from './lib/asserts';
import { JsonMockPropertyAnnotation } from './JsonMockDescription';
import {
  YUP_TYPE_BOOL,
  YUP_TYPE_DATE,
  YUP_TYPE_NUMBER,
  YUP_TYPE_STRING,
} from './constants';

/**
 * 检查指令是否支持
 */
/**
 * prepare for generating YupSchema
 * @param {JsonMockDescription} jsonMockDescription description object
 */
export default function (property) {
  ensureDataType(property);
  sortAnnotations(property);
  // debugger;
}

/**
 * ensure data type annotation of property
 * @param {*} property
 */
function ensureDataType(property) {
  const dataTypeAnnotation = property.annotations.find(
    (a) => a.isDateTypeAnnotation,
  );

  if (!isNullOrUndefined(dataTypeAnnotation)) {
    property.type = dataTypeAnnotation.method;
    return;
  }

  const type = detectDataType(property.value);
  if (!isNullOrUndefined(type)) {
    property.type = type;
    property.annotations.push(new JsonMockPropertyAnnotation(type, null));
    return;
  }
}

/**
 * 排序
 */
function sortAnnotations(property) {
  property.annotations.reverse();

  const index = property.annotations.findIndex((a) => a.isDateTypeAnnotation);
  if (index > -1) {
    const annotation = property.annotations[index];
    property.annotations.splice(index, 1);
    property.annotations.push(annotation);
  }
}

function detectDataType(value) {
  const b = /^(true|false)$/i;
  const d = /^[0-9]?$/;
  const f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
  const t = /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;

  if (b.test(value)) {
    return '@' + YUP_TYPE_BOOL;
  }
  if (t.test(value)) {
    return '@' + YUP_TYPE_DATE;
  }
  if (d.test(value)) {
    return '@' + YUP_TYPE_NUMBER;
  }
  if (f.test(value)) {
    return '@' + YUP_TYPE_NUMBER;
  }
  return '@' + YUP_TYPE_STRING;
}
