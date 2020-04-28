/**
 * @overview prepare for generating YupSchema
 * @author shiwei.lv
 */

import { isNullOrUndefined, isNotEmptyString } from './lib/asserts';
import { JsonMockPropertyAnnotation } from './JsonMockDescription';
import { YUP_TYPE_LIST } from './constants';
/**
 * 检查指令是否支持
 */
const isSupported = (d) => YUP_TYPE_LIST.includes(d);
/**
 * prepare for generating YupSchema
 * @param {JsonMockDescription} jsonMockDescription description object
 */
export default function (jsonMockDescription) {
  console.log('preparing ....');
  for (const property of jsonMockDescription.properties) {
    ensureKeyAnnotation(property);
    sortAnnotations(property);
    preciselyAnnotationParameters(property);
  }
  // debugger;
}

function ensureKeyAnnotation(property) {
  const found = property.annotations.find((a) => isSupported(a.method));
  if (!isNullOrUndefined(found)) {
    return found.method;
  }

  const type = detect(property.value);
  const annotation = new JsonMockPropertyAnnotation(type);

  property.annotations.push(annotation);

  function detect(value) {
    const b = /^(true|false)$/i;
    const d = /^[0-9]?$/;
    const f = /^[1-9]d*.d*|0.d*[1-9]d*$/;

    if (b.test(value)) return '@bool';
    if (d.test(value)) return '@number';
    if (f.test(value)) return '@number';

    return '@string';
  }

  return annotation.method;
}
/**
 * 排序
 */
function sortAnnotations(property) {
  const index = property.annotations.findIndex((a) => isSupported(a.method));
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
  function cast(value) {
    const b = /^(true|false)$/i;
    const d = /^[0-9]?$/;
    const f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
    const t = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

    if (b.test(value)) {
      return Boolean(value);
    }
    if (t.test(value)) {
      return new Date(value);
    }
    if (d.test(value)) {
      return Number(value);
    }
    if (f.test(value)) {
      return Number(value);
    }

    return String(value);
  }

  for (const annotation of property.annotations) {
    const params = annotation.body;
    if (isNotEmptyString(params)) {
      annotation.parameters = params.split(',').map((s) => cast(s.trim()));
    }
  }
}
