import {
  YUP_TYPE_LIST,
  YUP_TYPE_MIXED,
  YUP_TYPE_CASTORS,
  YUP_TYPE_STRING,
  YUP_TYPE_BOOL,
  YUP_TYPE_DATE,
  YUP_TYPE_NUMBER,
} from './constants';
import { isNotEmptyString, isFunction } from './lib/asserts';

/**
 * Json Mock Description object
 */
export class JsonMockDescription {
  constructor() {
    this.properties = [];
  }
}

/**
 * Json Mock description object property
 */
export class JsonMockPropertyDescriptor {
  constructor(key, value, annotations = []) {
    this.key = key;
    this.value = value;
    this.type = YUP_TYPE_MIXED;
    this.annotations = annotations;
  }
}

/**
 * Json Mock Object property annotation.
 * e.g.
 * {
 *  @string // this word means the field data type is a string.
 *  @max 20, dont make a so long text to Œname
 *  name: "Jim Green"
 * }
 */
export class JsonMockPropertyAnnotation {
  constructor(header, body) {
    this.header = header;
    this.body = body;
    this.isDateTypeAnnotation = YUP_TYPE_LIST.includes(this.method);
  }

  get prefix() {
    return this.header[0];
  }
  get method() {
    return this.header.substring(1);
  }

  getParameters() {
    if (isNotEmptyString(this.body)) {
      const array = this.body
        .split(',')
        .map((s) => s.trim())
        .filter(isNotEmptyString);

      return array.map((item) => {
        const type = detectDateType(item);
        const raw = item;
        const cast = YUP_TYPE_CASTORS[type];
        const value = isFunction(cast) ? cast(item) : item;

        !isFunction(cast) && console.log('no caster', this.method, type, raw);

        return new JsonMockPropertyAnnotationParameter(type, raw, value);
      });
    }

    return [];
  }
}

export class JsonMockPropertyAnnotationParameter {
  constructor(type, raw, value) {
    this.type = type;
    this.raw = raw;
    this.value = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return this.raw;
  }
}

function detectDateType(value) {
  const b = /^(true|false)$/i;
  const d = /^[0-9]?$/;
  const f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
  const t = /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;

  if (b.test(value)) {
    return YUP_TYPE_BOOL;
  }
  if (t.test(value)) {
    return YUP_TYPE_DATE;
  }
  if (d.test(value)) {
    return YUP_TYPE_NUMBER;
  }
  if (f.test(value)) {
    return YUP_TYPE_NUMBER;
  }

  return YUP_TYPE_STRING;
}
