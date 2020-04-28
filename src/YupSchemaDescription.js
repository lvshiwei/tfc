/**
 * @overview 规则描述文档, 用于生成表单
 * @author shiwei.lv
 */

import {
  YUP_TYPE_LIST,
  YUP_KEYWORD_REQUIRED,
  YUP_KEYWORD_LABEL,
} from './constants';
import { isNullOrUndefined } from './lib/asserts';

export class YupSchemaDescription {
  constructor() {
    this.rules = [];
  }
}

export class YupSchemaRuleDescriptor {
  constructor(name, attributes = []) {
    this.name = name;
    this.attributes = attributes;
    this._label = null;
    this._dataType = null;
    this._isRequired = null;
  }

  get label() {
    if (!isNullOrUndefined(this._label)) {
      return this._label;
    }

    const found = this.attributes.find(
      (attr) => attr.key === YUP_KEYWORD_LABEL,
    );
    if (!isNullOrUndefined(found)) {
      this._label = found.values[0];
      return this._label;
    }
  }

  get dataType() {
    if (!isNullOrUndefined(this._dataType)) {
      return this._dataType;
    }

    const found = this.attributes.find(
      (attr) => attr.isDataTypeAttribute === true,
    );

    if (!isNullOrUndefined(found)) {
      this._dataType = found.key;
      return found.key;
    }
  }

  isRequired() {
    if (!isNullOrUndefined(this._isRequired)) {
      return this._isRequired;
    }

    return this.hasAttribute(YUP_KEYWORD_REQUIRED);
  }

  hasAttribute(name) {
    return this.attributes.some(({ key }) => key === name);
  }
  getAttribute(key) {
    return this.attributes.find((attr) => attr.key === key);
  }
}

export class YupSchemaRuleAttributeDescriptor {
  constructor(key, values = []) {
    this.key = key;
    this.values = values;
    this.isDataTypeAttribute = YUP_TYPE_LIST.includes(key);
  }
}
