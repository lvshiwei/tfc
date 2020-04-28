Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var traverse = _interopDefault(require('@babel/traverse'));
var parser = require('@babel/parser');
var t = require('@babel/types');
var generate = _interopDefault(require('@babel/generator'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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
var isNullOrUndefined$1 = function isNullOrUndefined(v) {
  return isNull(v) || isUndefined(v);
};
var isNotEmptyArray = function isNotEmptyArray(v) {
  return Array.isArray(v) && v.length > 0;
};
var isNotEmptyString = function isNotEmptyString(v) {
  return typeof v === "string" && v.length > 0;
};

/**
 * Json Mock 描述文档
 */

var JsonMockDescription = function JsonMockDescription() {
  _classCallCheck(this, JsonMockDescription);

  this.properties = [];
};
/**
 * Json Mock 字段属性描述
 */

var JsonMockPropertyDescriptor = function JsonMockPropertyDescriptor(key, value) {
  var annotations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  _classCallCheck(this, JsonMockPropertyDescriptor);

  this.key = key;
  this.value = value;
  this.annotations = annotations;
};
/**
 * Json Mock 申明指令
 */

var JsonMockPropertyAnnotation = /*#__PURE__*/function () {
  function JsonMockPropertyAnnotation(header, body) {
    _classCallCheck(this, JsonMockPropertyAnnotation);

    this.header = header;
    this.body = body; // this.parameters = [];
  }

  _createClass(JsonMockPropertyAnnotation, [{
    key: "method",
    get: function get() {
      return this.header.substring(1);
    }
  }]);

  return JsonMockPropertyAnnotation;
}();

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
    return !isNullOrUndefined$1(i);
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

var YUP_TYPE_STRING = 'string';
var YUP_TYPE_Number = 'number';
var YUP_TYPE_BOOL = 'bool';
var YUP_TYPE_DATE = 'date';
var YUP_TYPE_ARRAY = 'array';
var YUP_TYPE_MIXED = 'mixed';
var YUP_KEYWORD_REQUIRED = 'required';
var YUP_KEYWORD_LABEL = 'label';
/**
 * YUP合法的指令集
 */

var YUP_TYPE_LIST = [YUP_TYPE_MIXED, YUP_TYPE_STRING, YUP_TYPE_Number, YUP_TYPE_DATE, YUP_TYPE_ARRAY, YUP_TYPE_BOOL];

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
    key: "isRequired",
    value: function isRequired() {
      if (!isNullOrUndefined$1(this._isRequired)) {
        return this._isRequired;
      }

      return this.hasAttribute(YUP_KEYWORD_REQUIRED);
    }
  }, {
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
      if (!isNullOrUndefined$1(this._label)) {
        return this._label;
      }

      var found = this.attributes.find(function (attr) {
        return attr.key === YUP_KEYWORD_LABEL;
      });

      if (!isNullOrUndefined$1(found)) {
        this._label = found.values[0];
        return this._label;
      }
    }
  }, {
    key: "dataType",
    get: function get() {
      if (!isNullOrUndefined$1(this._dataType)) {
        return this._dataType;
      }

      var found = this.attributes.find(function (attr) {
        return attr.isDataTypeAttribute === true;
      });

      if (!isNullOrUndefined$1(found)) {
        this._dataType = found.key;
        return found.key;
      }
    }
  }]);

  return YupSchemaRuleDescriptor;
}();
var YupSchemaRuleAttributeDescriptor = function YupSchemaRuleAttributeDescriptor(key) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _classCallCheck(this, YupSchemaRuleAttributeDescriptor);

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
    attributes.push(new YupSchemaRuleAttributeDescriptor(t.isMemberExpression(callee) ? callee.property.name : callee.name, makeValues(value.arguments)));

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

/**
 * 检查指令是否支持
 */

var isSupported = function isSupported(d) {
  return YUP_TYPE_LIST.includes(d);
};
/**
 * prepare for generating YupSchema
 * @param {JsonMockDescription} jsonMockDescription description object
 */


function prepareGenerateYupSchema (jsonMockDescription) {
  console.log('preparing ....');

  var _iterator = _createForOfIteratorHelper(jsonMockDescription.properties),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var property = _step.value;
      ensureKeyAnnotation(property);
      sortAnnotations(property);
      preciselyAnnotationParameters(property);
    } // debugger;

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function ensureKeyAnnotation(property) {
  var found = property.annotations.find(function (a) {
    return isSupported(a.method);
  });

  if (!isNullOrUndefined$1(found)) {
    return found.method;
  }

  var type = detect(property.value);
  var annotation = new JsonMockPropertyAnnotation(type);
  property.annotations.push(annotation);

  function detect(value) {
    var b = /^(true|false)$/i;
    var d = /^[0-9]?$/;
    var f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
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
  var index = property.annotations.findIndex(function (a) {
    return isSupported(a.method);
  });

  if (index > -1) {
    var annotation = property.annotations[index];
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
    var b = /^(true|false)$/i;
    var d = /^[0-9]?$/;
    var f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
    var t = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

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

  var _iterator2 = _createForOfIteratorHelper(property.annotations),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var annotation = _step2.value;
      var params = annotation.body;

      if (isNotEmptyString(params)) {
        annotation.parameters = params.split(',').map(function (s) {
          return cast(s.trim());
        });
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}

var CODE_TEMPLATE = "\n/**\n* @overview A Yup schema generated by tfc.\n*/\nimport { object, mixed, date, string, number, array } from \"yup\";\n\nexport default object();\n";
/**
 * generate yup schema code
 * @see ./JsonMockDescription.js
 * @param {JsonMockDescription} description json mock descripton object
 */

function generateYupSchema (description) {
  prepareGenerateYupSchema(description);
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
  function cast(value) {
    var type = _typeof(value);

    switch (type) {
      case 'string':
        return t.stringLiteral(value);

      case 'number':
        return t.numericLiteral(value);

      case 'boolean':
        return t.booleanLiteral(value);

      default:
        return t.stringLiteral(value);
    }
  }

  return isNotEmptyArray(annotation.parameters) ? annotation.parameters.map(cast) : [];
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

/**
 * @overview generate form code from schema description object
 * @see ./SchemaDescription.js
 * @author shiwei.lv
 */
var CODE_TEMPLATE$1 = "\n/**\n * @overview A form component generated by tfc.\n * @author your.name@corp.com\n */\nimport React from \"react\";\nimport classnames from \"classnames\";\nimport schema from \"./schema\";\nimport { useModel, useValidation } from \"./hooks\";\nimport { List, InputItem, Picker, DatePicker } from \"antd-mobile\";\n\n/**\n * Say something to avoid warnning from eslint\n */\nexport default function () {\n  const [model, setModel] = useModel({ preOpeningTime: new Date() });\n  const [validate, errors] = useValidation(schema);\n\n  const handleSubmit = () =>\n    validate(model)\n      .then(() => alert(\"Amazing!!\"))\n      .catch(console.error);\n\n  const handleChangeInput = (name) => (value) => setModel(name, value);\n  const handleLeaveInput = (name) => () => validate(name, model[name]);\n  const handleChangeSelect = (name) => (value) => {\n    setModel(name, value);\n    validate(name, value);\n  };\n  const renderClassName = (name, properties) =>\n    classnames(...(properties || []), {\n      error: Array.isArray(errors) && errors.some((e) => e.path === name),\n      hasValue: !(model[name] === null || typeof model[name] === \"undefined\"),\n    });\n\n  const Required = () => <i className=\"required\">*</i>;\n\n  return <div className=\"form-wrapper\"></div>;\n}";
function generateAntDesignForm (description) {
  var ast = parser.parse(CODE_TEMPLATE$1, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  var exportDefault = ast.program.body.find(t.isExportDefaultDeclaration);
  var returnStatement = exportDefault.declaration.body.body.find(t.isReturnStatement);
  var divElement = returnStatement.argument;
  divElement.children.push(newline);
  var newline = t.jsxText('\n');
  var fields = t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('List'), []), t.jsxClosingElement(t.jsxIdentifier('List')), [newline]);

  for (var rule in description.rules) {
    fields.children.push(makeField(rule));
  }

  divElement.children.push(newline);
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
  var name = ruleDescriptor.name,
      label = ruleDescriptor.label,
      isRequired = ruleDescriptor.isRequired;
  var picker = t.jsxIdentifier('DatePicker');
  var item = t.jsxIdentifier('List.Item');
  return t.jsxElement(t.jsxOpeningElement(picker, [t.jsxAttribute(t.identifier('mode'), t.stringLiteral('date')), t.jsxAttribute(t.identifier('onChange'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleSelectChange'), [t.stringLiteral(name)])))]), t.jsxClosingElement(picker), [t.jsxElement(t.jsxOpeningElement(item, [t.jsxAttribute(t.identifier('arrow'), t.stringLiteral('horizontal')), makeRenderClassAttribute(name)]), t.jsxClosingElement(item), [t.jsxText(label), isRequired === true ? makeRequiredElement() : t.jsxEmptyExpression()])]);
}

function makeInputItem(ruleDescriptor) {
  var name = ruleDescriptor.name,
      label = ruleDescriptor.label,
      isRequired = ruleDescriptor.isRequired;
  var inputItem = t.jsxIdentifier('InputItem');
  return t.jsxElement(t.jsxOpeningElement(inputItem, [makeRenderClassAttribute(name), t.jsxAttribute(t.jsxIdentifier('onChange'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleInputChange'), [t.stringLiteral(name)]))), t.jsxAttribute(t.jsxIdentifier('onBlur'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleLeaveInput'), [t.stringLiteral(name)])))]), t.jsxClosingElement(inputItem), [t.jsxText(label), isRequired === true ? makeRequiredElement() : t.jsxEmptyExpression()]);
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
        return saveCode(code, saveFileName);
      } else {
        resolve();
      }
    });
  });
}
function yupSchema2AntDesignForm(filename) {
  var saveFile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var saveFileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'form.jsx';
  return new Promise(function (resolve) {
    console.info('==== parse Yup schema and generate Ant-Design form code ====');
    return readFile(filename).then(function (content) {
      var description = parseYupSchema(content);
      var code = generateAntDesignForm(description);
      console.log('==  generate form ==');
      console.log(code);

      if (saveFile) {
        return saveCode(code, saveFileName);
      } else {
        resolve();
      }
    });
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

      console.log(filename + ' save done.');
      resolve();
    });
  });
}

exports.jsonMock2YupSchema = jsonMock2YupSchema;
exports.yupSchema2AntDesignForm = yupSchema2AntDesignForm;
//# sourceMappingURL=index.js.map
