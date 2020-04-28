import { isNotEmptyString } from './lib/asserts';

/**
 * Json Mock 描述文档
 */
export class JsonMockDescription {
  constructor() {
    this.properties = [];
  }
}

/**
 * Json Mock 字段属性描述
 */
export class JsonMockPropertyDescriptor {
  constructor(key, value, annotations = []) {
    this.key = key;
    this.value = value;
    this.annotations = annotations;
  }
}

/**
 * Json Mock 申明指令
 */
export class JsonMockPropertyAnnotation {
  constructor(header, body) {
    this.header = header;
    this.body = body;
    // this.parameters = [];
  }

  get method() {
    return this.header.substring(1);
  }
}

export class JsonMockPropertyNothingAnnotation extends JsonMockPropertyDescriptor {
  constructor() {
    super(null, []);
  }
}
