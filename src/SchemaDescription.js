/**
 * @overview 规则描述文档, 用于生成表单
 * @author shiwei.lv
 */

import { YUP_TYPE_LIST, YUP_KEYWORD_REQUIRED } from './constants';
import { isNullOrUndefined } from './lib/asserts';

export default class AbstractSchemaDescription {
  constructor() {
    this.rules = [];
  }
}

export class YupSchemaDescription extends AbstractSchemaDescription {
  constructor() {
    super();
  }
}

export class YupSchemaRuleDescriptor {
  constructor(name, attributes = []) {
    this.name = name;
    this.attributes = attributes;
    this._type = null;
  }

  get type() {
    if (isNullOrUndefined(this._type)) {
      return this._type;
    }

    const found = this.attributes.find(({ key }) =>
      YUP_TYPE_LIST.includes(key),
    );

    if (!isNullOrUndefined(found)) {
      this._type = found.key;
    }
  }

  isRequired() {
    return this.attributes.some(({ key }) => key === YUP_KEYWORD_REQUIRED);
  }
}

export class YupSchemaRuleAttributeDescription {
  constructor(key, values = []) {
    this.key = key;
    this.values = values;
  }
}
