Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var traverse = _interopDefault(require('@babel/traverse'));
var parser = require('@babel/parser');
var t = require('@babel/types');
var generate = _interopDefault(require('@babel/generator'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o) {
  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) {
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var it,
      normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var isNull = function isNull(v) {
  return v === null;
};
var isUndefined = function isUndefined(v) {
  return typeof v === "undefined";
};
var isNullOrUndefined = function isNullOrUndefined(v) {
  return isNull(v) || isUndefined(v);
};
var isNotEmptyArray = function isNotEmptyArray(v) {
  return Array.isArray(v) && v.length > 0;
};
var isNotEmptyString = function isNotEmptyString(v) {
  return typeof v === "string" && v.length > 0;
};
var isFunction = function isFunction(v) {
  return typeof v === "function";
};

var _YUP_TYPE_CASTORS;

var YUP_TYPE_STRING = 'string';
var YUP_TYPE_NUMBER = 'number';
var YUP_TYPE_BOOL = 'bool';
var YUP_TYPE_DATE = 'date';
var YUP_TYPE_ARRAY = 'array';
var YUP_TYPE_MIXED = 'mixed';
var YUP_KEYWORD_REQUIRED = 'required';
var YUP_KEYWORD_LABEL = 'label';
/**
 * YUP合法的指令集
 */

var YUP_TYPE_LIST = [YUP_TYPE_MIXED, YUP_TYPE_STRING, YUP_TYPE_NUMBER, YUP_TYPE_DATE, YUP_TYPE_ARRAY, YUP_TYPE_BOOL];
var YUP_TYPE_CASTORS = (_YUP_TYPE_CASTORS = {}, _defineProperty(_YUP_TYPE_CASTORS, YUP_TYPE_MIXED, function (value) {
  return value;
}), _defineProperty(_YUP_TYPE_CASTORS, YUP_TYPE_STRING, function (value) {
  return String(value);
}), _defineProperty(_YUP_TYPE_CASTORS, YUP_TYPE_NUMBER, function (value) {
  return Number(value);
}), _defineProperty(_YUP_TYPE_CASTORS, YUP_TYPE_DATE, function (value) {
  return new Date(value);
}), _defineProperty(_YUP_TYPE_CASTORS, YUP_TYPE_BOOL, function (value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
}), _YUP_TYPE_CASTORS);

/**
 * Json Mock Description object
 */

var JsonMockDescription = function JsonMockDescription() {
  _classCallCheck(this, JsonMockDescription);

  this.properties = [];
};
/**
 * Json Mock description object property
 */

var JsonMockPropertyDescriptor = function JsonMockPropertyDescriptor(key, value) {
  var annotations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  _classCallCheck(this, JsonMockPropertyDescriptor);

  this.key = key;
  this.value = value;
  this.type = YUP_TYPE_MIXED;
  this.annotations = annotations;
};
/**
 * Json Mock Object property annotation.
 * e.g.
 * {
 *  @string // this word means the field data type is a string.
 *  @max 20, dont make a so long text to Œname
 *  name: "Jim Green"
 * }
 */

var JsonMockPropertyAnnotation = /*#__PURE__*/function () {
  function JsonMockPropertyAnnotation(header, body) {
    _classCallCheck(this, JsonMockPropertyAnnotation);

    this.header = header;
    this.body = body;
    this.isDateTypeAnnotation = YUP_TYPE_LIST.includes(this.method);
  }

  _createClass(JsonMockPropertyAnnotation, [{
    key: "getParameters",
    value: function getParameters() {
      var _this = this;

      if (isNotEmptyString(this.body)) {
        var array = this.body.split(',').map(function (s) {
          return s.trim();
        }).filter(isNotEmptyString);
        return array.map(function (item) {
          var type = detectDateType(item);
          var raw = item;
          var cast = YUP_TYPE_CASTORS[type];
          var value = isFunction(cast) ? cast(item) : item;
          !isFunction(cast) && console.log('no caster', _this.method, type, raw);
          return new JsonMockPropertyAnnotationParameter(type, raw, value);
        });
      }

      return [];
    }
  }, {
    key: "prefix",
    get: function get() {
      return this.header[0];
    }
  }, {
    key: "method",
    get: function get() {
      return this.header.substring(1);
    }
  }]);

  return JsonMockPropertyAnnotation;
}();
var JsonMockPropertyAnnotationParameter = /*#__PURE__*/function () {
  function JsonMockPropertyAnnotationParameter(type, raw, value) {
    _classCallCheck(this, JsonMockPropertyAnnotationParameter);

    this.type = type;
    this.raw = raw;
    this.value = value;
  }

  _createClass(JsonMockPropertyAnnotationParameter, [{
    key: "valueOf",
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.raw;
    }
  }]);

  return JsonMockPropertyAnnotationParameter;
}();

function detectDateType(value) {
  var b = /^(true|false)$/i;
  var d = /^[0-9]?$/;
  var f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
  var t = /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;

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

/**
 * @overview prepare for generating YupSchema
 * @author shiwei.lv
 */
/**
 * 检查指令是否支持
 */

/**
 * prepare for generating YupSchema
 * @param {JsonMockDescription} jsonMockDescription description object
 */

function tidyProperty (property) {
  ensureDataType(property);
  sortAnnotations(property); // debugger;
}
/**
 * ensure data type annotation of property
 * @param {*} property
 */

function ensureDataType(property) {
  var dataTypeAnnotation = property.annotations.find(function (a) {
    return a.isDateTypeAnnotation;
  });

  if (!isNullOrUndefined(dataTypeAnnotation)) {
    property.type = dataTypeAnnotation.method;
    return;
  }

  var type = detectDataType(property.value);

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
  var index = property.annotations.findIndex(function (a) {
    return a.isDateTypeAnnotation;
  });

  if (index > -1) {
    var annotation = property.annotations[index];
    property.annotations.splice(index, 1);
    property.annotations.push(annotation);
  }
}

function detectDataType(value) {
  var b = /^(true|false)$/i;
  var d = /^[0-9]?$/;
  var f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
  var t = /^(?:(?!0000)[0-9]{4}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))$/;

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

/**
 * parse JSON Mock script content, generate JSON Mock Description
 * @see ./JsonMockDescription.js
 * @param {String} text
 */

function parseJsonMock (text) {
  var ast = parser.parse(text, {
    sourceType: 'module'
  });
  var description = traverseJsonMockAST(ast);
  return description;
}
function traverseJsonMockAST(ast) {
  var description = new JsonMockDescription();
  var propertyVisitor = {
    ObjectProperty: function ObjectProperty(path) {
      var property = makeJsonMockProperty(path.node);
      tidyProperty(property);
      description.properties.push(property);
    }
  };
  traverse(ast, {
    ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
      path.traverse({
        ObjectExpression: function ObjectExpression(path) {
          path.traverse(propertyVisitor);
        }
      });
    }
  });
  return description;
}
/**
 * 解析抽象语法节点
 * @param {Node} astNode ast 节点
 */

function makeJsonMockProperty(astNode) {
  var key = astNode.key,
      value = astNode.value,
      leadingComments = astNode.leadingComments;
  var anotations = leadingComments.map(function (comment) {
    return makeAnnotation(key.name, comment);
  }).filter(function (i) {
    return !isNullOrUndefined(i);
  });
  return new JsonMockPropertyDescriptor(key.name, value.value, anotations);
}
/**
 * 解析申明
 * @param {*} text
 */

function makeAnnotation(key, leadingComment) {
  if (leadingComment.value.trim() === '') {
    return null;
  }

  var r = /\s*(\S*)\s(.*)/;
  var matches = leadingComment.value.match(r);

  if (isNotEmptyArray(matches)) {
    var _matches = _slicedToArray(matches, 3),
        b = _matches[1],
        c = _matches[2];

    var header, body;

    if (isNotEmptyString(b)) {
      header = b.trim();
      body = c.trim();
    } else if (b === '' && c.includes('@')) {
      header = c.trim();
      body = null;
    } else {
      header = '@label';
      body = c.trim();
    }

    return new JsonMockPropertyAnnotation(header, body);
  } else {
    return new JsonMockPropertyAnnotation('@label', key);
  }
}

var YupSchemaDescription = function YupSchemaDescription() {
  _classCallCheck(this, YupSchemaDescription);

  this.rules = [];
};
var YupSchemaRuleDescriptor = /*#__PURE__*/function () {
  function YupSchemaRuleDescriptor(name) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, YupSchemaRuleDescriptor);

    this.name = name;
    this.attributes = attributes;
    this._label = null;
    this._dataType = null;
    this._isRequired = null;
  }

  _createClass(YupSchemaRuleDescriptor, [{
    key: "hasAttribute",
    value: function hasAttribute(name) {
      return this.attributes.some(function (_ref) {
        var key = _ref.key;
        return key === name;
      });
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(key) {
      return this.attributes.find(function (attr) {
        return attr.key === key;
      });
    }
  }, {
    key: "label",
    get: function get() {
      if (!isNullOrUndefined(this._label)) {
        return this._label;
      }

      var found = this.attributes.find(function (attr) {
        return attr.key === YUP_KEYWORD_LABEL;
      });

      if (!isNullOrUndefined(found)) {
        this._label = found.values[0];
        return this._label;
      }
    }
  }, {
    key: "dataType",
    get: function get() {
      if (!isNullOrUndefined(this._dataType)) {
        return this._dataType;
      }

      var found = this.attributes.find(function (attr) {
        return attr.isDataTypeAttribute === true;
      });

      if (!isNullOrUndefined(found)) {
        this._dataType = found.key;
        return found.key;
      }
    }
  }, {
    key: "isRequired",
    get: function get() {
      return this.hasAttribute(YUP_KEYWORD_REQUIRED);
    }
  }]);

  return YupSchemaRuleDescriptor;
}();
var YupSchemaRuleDescriptorAttribute = function YupSchemaRuleDescriptorAttribute(key) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _classCallCheck(this, YupSchemaRuleDescriptorAttribute);

  this.key = key;
  this.values = values;
  this.isDataTypeAttribute = YUP_TYPE_LIST.includes(key);
};

/**
 * parse Yup Schema script content to make Yup Schema description
 * @see ./YupSchemaDescription.js
 * @param {string} text
 */

function parseYupSchema (text) {
  var ast = parser.parse(text, {
    sourceType: 'module'
  });
  var description = traverseYupSchemaAST(ast);
  return description;
}
function traverseYupSchemaAST(ast) {
  var meetExportDefaultObjectNode = false;
  var desc = new YupSchemaDescription();
  traverse(ast, {
    ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
      var objectNode = path.node.declaration;

      if (t.isCallExpression(objectNode) && t.isIdentifier(objectNode.callee) && objectNode.callee.name === 'object') {
        meetExportDefaultObjectNode = true;

        var _iterator = _createForOfIteratorHelper(objectNode.arguments[0].properties),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var property = _step.value;
            var key = property.key,
                value = property.value;
            var attributes = [];
            makeRuleDescriptor(value, attributes);
            var rule = new YupSchemaRuleDescriptor(key.name);
            rule.attributes = attributes;
            desc.rules.push(rule);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  });

  if (meetExportDefaultObjectNode) {
    console.log('done.');
    return desc;
  } else {
    console.error('did not meet export default object call expression. failed!');
  }
}

function makeRuleDescriptor(value, attributes) {
  if (t.isCallExpression(value)) {
    var callee = value.callee;
    attributes.push(new YupSchemaRuleDescriptorAttribute(t.isMemberExpression(callee) ? callee.property.name : callee.name, makeValues(value.arguments)));

    if (t.isMemberExpression(callee)) {
      makeRuleDescriptor(callee.object, attributes);
    }
  }
}

function makeValues(parameters) {
  return parameters.map(function (arg) {
    if (t.isArrayExpression(arg)) {
      return arg.elements.map(function (e) {
        return e.value;
      });
    } else {
      return arg.value;
    }
  });
}

var CODE_TEMPLATE = "\n/**\n* @overview A Yup schema generated by tfc.\n*/\nimport { object, mixed, date, string, number, array } from \"yup\";\n\nexport default object();\n";
/**
 * generate yup schema code
 * @see ./JsonMockDescription.js
 * @param {JsonMockDescription} description json mock descripton object
 */

function generateYupSchema (description) {
  var ast = parser.parse(CODE_TEMPLATE, {
    sourceType: 'module'
  });
  var objectDeclaration = ast.program.body[1].declaration;
  var properties = [];

  var _iterator = _createForOfIteratorHelper(description.properties),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var property = _step.value;
      var rules = makeRule(property);
      properties.push(t.objectProperty(t.identifier(property.key), rules));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  objectDeclaration.arguments.push(t.objectExpression(properties));
  var output = generate(ast, {}, CODE_TEMPLATE);
  var text = ensureReadableText(output.code);
  return text;
}

function makeRule(property) {
  if (isNotEmptyArray(property.annotations)) {
    return buildChainExpression(property.annotations, 0);
  }
}

function buildChainExpression(annotations, index) {
  if (annotations.length === 1 || index === annotations.length - 1) {
    var _ann = annotations[index];
    return t.callExpression(t.identifier(_ann.method), makeRuleArguments(_ann));
  }

  var ann = annotations[index];
  return t.callExpression(t.memberExpression(buildChainExpression(annotations, index + 1), t.identifier(ann.method)), makeRuleArguments(annotations[index]));
}
/**
 * 构建规则参数
 */


function makeRuleArguments(annotation) {
  var params = annotation.getParameters();
  return params.map(function (p) {
    var type = p.type,
        value = p.value,
        raw = p.raw;

    switch (type) {
      case YUP_TYPE_STRING:
        return t.stringLiteral(value);

      case YUP_TYPE_NUMBER:
        return t.numericLiteral(value);

      case YUP_TYPE_BOOL:
        return t.booleanLiteral(value);

      case YUP_TYPE_DATE:
        return t.newExpression(t.identifier('Date'), [t.stringLiteral(raw)]);

      default:
        return t.stringLiteral(raw);
    }
  });
}
/**
 * 将unicode字符转化成可读的汉字
 * @param {*} unicodeText
 */


function ensureReadableText(unicodeText) {
  var r = /\\u([\d\w]{4})/gi;
  var dest = unicodeText.replace(r, function (match, grp) {
    return String.fromCharCode(parseInt(grp, 16));
  });
  return decodeURIComponent(dest);
}

var CODE_TEMPLATE$1 = "\n/**\n * @overview A form component generated by tfc.\n * @author your.name@corp.com\n */\nimport React from \"react\";\nimport classnames from \"classnames\";\nimport schema from \"./schema\";\nimport { useModel, useValidation } from \"./hooks\";\nimport { List, InputItem, Picker, DatePicker } from \"antd-mobile\";\n\n/**\n * Say something to avoid warnning from eslint\n */\nexport default function () {\n  const [model, setModel] = useModel({});\n  const [validate, errors] = useValidation(schema);\n\n  const handleSubmit = () =>\n    validate(model)\n      .then(() => alert(\"Amazing!!\"))\n      .catch(console.error);\n\n  const handleChangeInput = (name) => (value) => setModel(name, value);\n  const handleLeaveInput = (name) => () => validate(name, model[name]);\n  const handleChangeSelect = (name) => (value) => {\n    setModel(name, value);\n    validate(name, value);\n  };\n  const renderClassName = (name, properties) =>\n    classnames(...(properties || []), {\n      error: Array.isArray(errors) && errors.some((e) => e.path === name),\n      hasValue: !(model[name] === null || typeof model[name] === \"undefined\"),\n    });\n\n  const Required = () => <i className=\"required\">*</i>;\n\n  return <div className=\"form-wrapper\"></div>;\n}";
var NEWLINE = t.jsxText('\n');
function generateAntDesignForm (description) {
  var ast = parser.parse(CODE_TEMPLATE$1, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  var exportDefault = ast.program.body.find(t.isExportDefaultDeclaration);
  var returnStatement = exportDefault.declaration.body.body.find(t.isReturnStatement);
  var divElement = returnStatement.argument;
  divElement.children.push(NEWLINE);
  var fields = t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('List'), []), t.jsxClosingElement(t.jsxIdentifier('List')), [NEWLINE]);

  var _iterator = _createForOfIteratorHelper(description.rules),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var rule = _step.value;
      fields.children.push(makeField(rule));
      fields.children.push(NEWLINE);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  divElement.children.push(fields);
  divElement.children.push(NEWLINE);
  var output = generate(ast, {}, CODE_TEMPLATE$1);
  return output.code;
}

function makeField(ruleDescriptor) {
  var dataType = ruleDescriptor.dataType;

  if (!YUP_TYPE_LIST.includes(dataType)) {
    return t.jsxEmptyExpression();
  }

  if (dataType === YUP_TYPE_DATE) {
    return makeDatePicker(ruleDescriptor);
  } else {
    return makeInputItem(ruleDescriptor);
  }
}

function makeRequiredElement() {
  return t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('Required'), [], true), null, [], true);
}

function makeRenderClassAttribute(name) {
  return t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(t.callExpression(t.identifier('renderClassName'), [t.stringLiteral(name)])));
}

function makeDatePicker(ruleDescriptor) {
  var name = ruleDescriptor.name;
  var picker = t.jsxIdentifier('DatePicker');
  var item = t.jsxIdentifier('List.Item');
  return t.jsxElement(t.jsxOpeningElement(picker, [t.jsxAttribute(t.jsxIdentifier('mode'), t.stringLiteral('date')), t.jsxAttribute(t.jsxIdentifier('onChange'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleSelectChange'), [t.stringLiteral(name)])))]), t.jsxClosingElement(picker), [NEWLINE, t.jsxElement(t.jsxOpeningElement(item, [t.jsxAttribute(t.jsxIdentifier('arrow'), t.stringLiteral('horizontal')), makeRenderClassAttribute(name)]), t.jsxClosingElement(item), makeLabelAndRequired(ruleDescriptor)), NEWLINE]);
}

function makeInputItem(ruleDescriptor) {
  var name = ruleDescriptor.name;
  var inputItem = t.jsxIdentifier('InputItem');
  return t.jsxElement(t.jsxOpeningElement(inputItem, [makeRenderClassAttribute(name), t.jsxAttribute(t.jsxIdentifier('onChange'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleInputChange'), [t.stringLiteral(name)]))), t.jsxAttribute(t.jsxIdentifier('onBlur'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleLeaveInput'), [t.stringLiteral(name)])))]), t.jsxClosingElement(inputItem), makeLabelAndRequired(ruleDescriptor));
}

function makeLabelAndRequired(ruleDescriptor) {
  var label = ruleDescriptor.label,
      isRequired = ruleDescriptor.isRequired;
  var children = [];

  if (isNotEmptyString(label)) {
    children.push(t.jsxText(label));
  }

  if (isRequired === true) {
    children.push(makeRequiredElement());
  }

  return children;
}

function jsonMock2YupSchema(filename) {
  var saveFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var saveFileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'schema.js';
  return new Promise(function (resolve, reject) {
    console.info('==== parse JSON mock script file and generate Yup Schema ====');
    return readFile(filename).then(function (content) {
      var description = parseJsonMock(content);
      var code = generateYupSchema(description);
      console.log('==  generate Yup schema ==');
      console.log(code);

      if (saveFile) {
        return saveCode(code, saveFileName).then(resolve)["catch"](reject);
      } else {
        resolve();
      }
    })["catch"](reject);
  });
}
function yupSchema2AntDesignForm(filename) {
  var saveFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var saveFileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'form.jsx';
  return new Promise(function (resolve, reject) {
    console.info('==== parse Yup schema and generate Ant-Design form code ====');
    return readFile(filename).then(function (content) {
      var description = parseYupSchema(content);
      var code = generateAntDesignForm(description);
      console.log('==  generate form ==');
      console.log(code);

      if (saveFile) {
        return saveCode(code, saveFileName).then(resolve)["catch"](reject);
      } else {
        resolve();
      }
    })["catch"](reject);
  });
}

function readFile(filename) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
  return new Promise(function (resolve, reject) {
    fs.readFile(path.resolve(__dirname, filename), encoding, function (err, content) {
      if (err) {
        console.error(err);
        reject();
      }

      resolve(content);
    });
  });
}

function saveCode(code, fileName) {
  var encoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'utf8';
  return new Promise(function (resolve, reject) {
    fs.writeFile(path.resolve(__dirname, fileName), code, encoding, function (err) {
      if (!isNullOrUndefined(err)) {
        console.error(err);
        reject();
      }

      console.log(fileName + ' save done.');
      resolve();
    });
  });
}

exports.jsonMock2YupSchema = jsonMock2YupSchema;
exports.yupSchema2AntDesignForm = yupSchema2AntDesignForm;
//# sourceMappingURL=index.js.map
