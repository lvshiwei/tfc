/**
 * @overview Yup Schema 解析描述文档, 用于创建表单
 * @author shiwei.lv
 */

import { isNotEmptyArray, isNullOrUndefined } from './lib/asserts';
import { YUP_TYPE_LIST } from './constants';

export class YupSchemaDescription {
  constructor() {
    this.properties = [];
  }
}

export class YupSchemaPropertyDescriptor {
  constructor(key, rules = []) {
    this.key = key;
    this.rules = rules;
  }

  getTypeRule() {
    if (isNotEmptyArray(this.rules)) {
      const last = this.rules.slice(-1)[0];
      if (!isNullOrUndefined(last) && YUP_TYPE_LIST.includes(last)) {
        return last;
      }
    }
  }
}

export class YupSchemaRuleDescriptor {
  constructor(name, parameters) {
    this.name = name;
    this.parameters = parameters;
  }
}
