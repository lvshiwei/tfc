/**
 * @overview prepare for generating YupSchema
 * @author shiwei.lv
 */

import { isNullOrUndefined, isNotEmptyString, isFunction } from './lib/asserts';
import { JsonMockPropertyAnnotationParameter } from './JsonMockDescription';
import { YUP_TYPE_CASTORS } from './constants';

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
  preciselyAnnotationParameters(property);
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

/**
 * 参数精准化
 * @param {*} property
 */
function preciselyAnnotationParameters(property) {
  for (const annotation of property.annotations) {
    if (isNotEmptyString(annotation.body)) {
      const params = annotation.body.split(',').map((i) => i.trim());
      const type = property.type;
      annotation.parameters = params.map((p) => {
        const castor = YUP_TYPE_CASTORS[type];
        const tryCastValue = isFunction(castor) ? castor(p) : null;
        return new JsonMockPropertyAnnotationParameter(p, tryCastValue);
      });
    }
  }
}

function detectDataType(value) {
  const b = /^(true|false)$/i;
  const d = /^[0-9]?$/;
  const f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
  const t = /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;

  if (b.test(value)) {
    return 'bool';
  }
  if (t.test(value)) {
    return 'date';
  }
  if (d.test(value)) {
    return 'number';
  }
  if (f.test(value)) {
    return 'number';
  }
  return 'mixed';
}
