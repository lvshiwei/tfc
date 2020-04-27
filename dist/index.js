Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
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
    this.body = body;
    this.parameters = [];
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
 * 解析JSON mock脚本文档, 生成描述文档
 * @param {}} file
 * @param {*} encoding
 */

function parseJsonMock (file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";
  return new Promise(function (resolve, reject) {
    fs.readFile(file, encoding, function (err, contents) {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      var doc = parser.parse(contents, {
        sourceType: "module"
      });
      var description = parseJsonMockAST(doc);
      resolve(description);
    });
  });
}
/**
 * 解析Json Mock脚本语法术, 生成描述文档
 * @param {ast} jsonASTDocument
 */

function parseJsonMockAST(jsonASTDocument) {
  var description = new JsonMockDescription();
  var propertyVisitor = {
    ObjectProperty: function ObjectProperty(path) {
      var property = parseJsonMockProperty(path.node);
      description.properties.push(property);
    }
  };
  traverse(jsonASTDocument, {
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

function parseJsonMockProperty(astNode) {
  var key = astNode.key,
      value = astNode.value,
      leadingComments = astNode.leadingComments;
  var anotations = leadingComments.map(function (comment) {
    return parseAnnotation(key.name, comment);
  }).filter(function (i) {
    return !isNullOrUndefined(i);
  });
  return new JsonMockPropertyDescriptor(key.name, value.value, anotations);
}
/**
 * 解析申明
 * @param {*} text
 */

function parseAnnotation(key, leadingComment) {
  if (leadingComment.value.trim() === "") {
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
    } else if (b === "" && c.includes("@")) {
      header = c.trim();
      body = null;
    } else {
      header = "@label";
      body = c.trim();
    }

    return new JsonMockPropertyAnnotation(header, body);
  } else {
    return new JsonMockPropertyAnnotation("@label", key);
  }
}

var TypeDescriptor = /*#__PURE__*/function () {
  function TypeDescriptor(name) {
    _classCallCheck(this, TypeDescriptor);

    this.name = name;
  }

  _createClass(TypeDescriptor, [{
    key: "toString",
    value: function toString() {
      return this.name;
    }
  }], [{
    key: "parse",
    value: function parse(ast) {
      var node = ast.node;
      var name = node.callee.name || node.callee.property.name;

      if (name === "label") {
        return new LabelDescriptor(name, ast);
      } else {
        return new TypeDescriptor(name);
      }
    }
  }]);

  return TypeDescriptor;
}();
var LabelDescriptor = /*#__PURE__*/function (_TypeDescriptor) {
  _inherits(LabelDescriptor, _TypeDescriptor);

  var _super = _createSuper(LabelDescriptor);

  function LabelDescriptor(name, ast) {
    var _this;

    _classCallCheck(this, LabelDescriptor);

    _this = _super.call(this, name);
    _this.value = isNotEmptyArray(ast.node.arguments) ? ast.node.arguments[0].value : null;
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(LabelDescriptor, [{
    key: "toString",
    value: function toString() {
      return this.name + ": " + this.value;
    }
  }]);

  return LabelDescriptor;
}(TypeDescriptor);

function parseYupSchema (file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "utf8";
  return new Promise(function (resolve, reject) {
    fs.readFile(file, encoding, function (err, contents) {
      if (err) {
        console.error("Yup schema parse error", err);
        reject(err);
        return;
      }

      var doc = parser.parse(contents, {
        sourceType: "module"
      });
      var schema = {};

      var isCalleeNode = function isCalleeNode(node, name) {
        return t.isIdentifier(node.callee, {
          name: name
        }) || t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property, {
          name: name
        });
      };

      var isRootNode = function isRootNode(node) {
        return isCalleeNode(node, "object");
      };

      var typeVisitor = {
        CallExpression: function CallExpression(path) {
          var parentKey = path.parentKey;

          if (parentKey === "arguments") {
            path.skip();
            return;
          }

          var td = TypeDescriptor.parse(path);

          if (!isNullOrUndefined(td)) {
            schema[this.key].push(td);
          } else {
            console.error("parse error:", this.key);
          }
        },
        ObjectProperty: function ObjectProperty(path) {
          path.skip();
        }
      };
      var propertyVisitor = {
        ObjectProperty: function ObjectProperty(path) {
          var key = path.node.key;

          if (key.name === "is" || key.name === "then" || key.name === "otherwise") {
            path.skip();
            return;
          }

          schema[key.name] = [];
          path.traverse(typeVisitor, {
            key: key.name
          });
        }
      };
      var rootVisitor = {
        ObjectExpression: function ObjectExpression(path) {
          var parentKey = path.parentKey,
              parent = path.parent;

          if (parentKey === "arguments" && isRootNode(parent)) {
            path.traverse(propertyVisitor);
            return;
          }
        }
      };
      traverse(doc, {
        CallExpression: function CallExpression(p) {
          var node = p.node;

          if (isRootNode(node)) {
            p.traverse(rootVisitor);
          }
        }
      });
      resolve(schema);
    });
  });
}

var YUP_TYPE_STRING = 'string';
var YUP_TYPE_Number = 'number';
var YUP_TYPE_BOOL = 'bool';
var YUP_TYPE_DATE = 'date';
var YUP_TYPE_ARRAY = 'array';
var YUP_TYPE_MIXED = 'mixed';
var YUP_KEYWORD_REQUIRED = 'required';
/**
 * YUP合法的指令集
 */

var YUP_TYPE_LIST = [YUP_TYPE_MIXED, YUP_TYPE_STRING, YUP_TYPE_Number, YUP_TYPE_DATE, YUP_TYPE_ARRAY, YUP_TYPE_BOOL];

/**
 * 检查指令是否支持
 */

var isSupported = function isSupported(d) {
  return YUP_TYPE_LIST.includes(d);
};
/**
 * 生成Yup Schema前的准备和预处理工作
 * @param {JsonMockDescription} jsonMockDescription 描述对象
 */


function prepareGenerateYupSchema (jsonMockDescription) {
  console.log("preparing >>>>>>>>");

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

  if (!isNullOrUndefined(found)) {
    return found.method;
  }

  var type = detect(property.value);
  var annotation = new JsonMockPropertyAnnotation(type);
  property.annotations.push(annotation);

  function detect(value) {
    var b = /^(true|false)$/i;
    var d = /^[0-9]?$/;
    var f = /^[1-9]d*.d*|0.d*[1-9]d*$/;
    if (b.test(value)) return "@bool";
    if (d.test(value)) return "@number";
    if (f.test(value)) return "@number";
    return "@string";
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
        annotation.parameters = params.split(",").map(function (s) {
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

/**
 * 生成 Yup 验证架构脚本
 * @param {JsonMockDescription} description 描述文档
 */

function generateYupSchema (description) {
  return new Promise(function (resolve, reject) {
    if (!(description instanceof JsonMockDescription)) {
      console.error('不能生成yup验证规则, 收到的参数不符合预期!');
      reject();
      return;
    }

    var code = "\n  /**\n   * @overview A Yup schema generated by tfc.\n   */\n  import { object, mixed, date, string, number, array } from \"yup\";\n\n  export default object();\n  ";
    var ast = parser.parse(code, {
      sourceType: 'module'
    });
    var objectDeclare = ast.program.body[1].declaration;
    var objectProperties = [];
    prepareGenerateYupSchema(description);

    var _iterator = _createForOfIteratorHelper(description.properties),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var property = _step.value;
        var rules = buildRulesChain(property);
        objectProperties.push(t.objectProperty(t.identifier(property.key), rules));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    objectDeclare.arguments.push(t.objectExpression(objectProperties));
    var output = generate(ast, {}, code);
    var text = ensureReadableText(output.code);
    resolve(text);
  });
}
/**
 * 构建规则链
 */

function buildRulesChain(property) {
  if (isNotEmptyArray(property.annotations)) {
    return makeRuleExpression(property.annotations, 0);
  }

  console.warn('无法构建规则, property 参数是空的!');
}

function makeRuleExpression(annotations, index) {
  if (annotations.length === 1 || index === annotations.length - 1) {
    var _ann = annotations[index];
    return t.callExpression(t.identifier(_ann.method), makeRuleArguments(_ann));
  }

  var ann = annotations[index];
  return t.callExpression(t.memberExpression(makeRuleExpression(annotations, index + 1), t.identifier(ann.method)), makeRuleArguments(annotations[index]));
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

  return annotation.parameters.map(cast);
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

function generateFormUI (schema) {
  var code = "\n  /**\n   * @overview A form component generated by tfc.\n   * @author your.name@corp.com\n   */\n  import React from \"react\";\n  import classnames from \"classnames\";\n  import schema from \"./schema\";\n  import { useModel, useValidation } from \"./hooks\";\n  import { Card, List, InputItem, Picker, DatePicker } from \"antd-mobile\";\n\n  /**\n   * Say something to avoid warnning from eslint\n   */\n  export default function () {\n    const [model, setModel] = useModel({ preOpeningTime: new Date() });\n    const [validate, errors] = useValidation(schema);\n  \n    const handleSubmit = () =>\n      validate(model)\n        .then(() => alert(\"Amazing!!\"))\n        .catch(console.error);\n  \n    const handleChangeInput = (name) => (value) => setModel(name, value);\n    const handleLeaveInput = (name) => () => validate(name, model[name]);\n    const handleChangeSelect = (name) => (value) => {\n      setModel(name, value);\n      validate(name, value);\n    };\n    const renderClassName = (name, properties) =>\n      classnames(...(properties || []), {\n        error: Array.isArray(errors) && errors.some((e) => e.path === name),\n        hasValue: !(model[name] === null || typeof model[name] === \"undefined\"),\n      });\n\n    const Required = () => <i className=\"required\">*</i>;\n  }";
  var ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  var exportDefault = ast.program.body.find(t.isExportDefaultDeclaration);
  var newline = t.jsxText('\n');
  var div = t.jsxIdentifier('div');
  var divOpen = t.jsxOpeningElement(div, []);
  var divClose = t.jsxClosingElement(div);
  var list = t.jsxIdentifier('List');
  var listComp = t.jsxElement(t.jsxOpeningElement(list, []), t.jsxClosingElement(list), [newline]);

  for (var key in schema) {
    var item = t.jsxIdentifier('InputItem');
    var itemComp = t.jsxElement(t.jsxOpeningElement(item, [t.jsxAttribute(t.jsxIdentifier('name'), t.stringLiteral(key)), t.jsxAttribute(t.jsxIdentifier('className'), t.jsxExpressionContainer(t.callExpression(t.identifier('renderClassName'), [t.stringLiteral(key)]))), t.jsxAttribute(t.jsxIdentifier('onChange'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleChangeInput'), [t.stringLiteral(key)])))]), t.jsxClosingElement(item), []);
    var rules = schema[key];
    var labelDesc = schema[key].find(function (i) {
      return i instanceof LabelDescriptor;
    });

    if (labelDesc) {
      itemComp.children.push(t.jsxText(labelDesc.value));
    }

    var typeDesc = rules.slice(-1)[0];

    if (['string', 'number'].includes(typeDesc.name)) {
      itemComp.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('onBlur'), t.jsxExpressionContainer(t.callExpression(t.identifier('handleLeaveInput'), [t.stringLiteral(key)]))));
    }

    var isRequired = rules.some(function (r) {
      return r.name === 'required';
    });

    if (isRequired) {
      itemComp.children.push(t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier('Required'), [], true), null, [], true));
    }

    listComp.children.push(itemComp);
    listComp.children.push(newline);
  }

  var jsxroot = t.jsxElement(divOpen, divClose, [newline, listComp, newline]);
  var returnStatement = t.returnStatement(jsxroot);
  exportDefault.declaration.body.body.push(returnStatement);
  var output = generate(ast, {}, code);
  return output.code;
}

var AbstractSchemaDescription = function AbstractSchemaDescription() {
  _classCallCheck(this, AbstractSchemaDescription);

  this.rules = [];
};
var YupSchemaDescription = /*#__PURE__*/function (_AbstractSchemaDescri) {
  _inherits(YupSchemaDescription, _AbstractSchemaDescri);

  var _super = _createSuper(YupSchemaDescription);

  function YupSchemaDescription() {
    _classCallCheck(this, YupSchemaDescription);

    return _super.call(this);
  }

  return YupSchemaDescription;
}(AbstractSchemaDescription);
var YupSchemaRuleDescriptor = /*#__PURE__*/function () {
  function YupSchemaRuleDescriptor(name) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, YupSchemaRuleDescriptor);

    this.name = name;
    this.attributes = attributes;
    this._type = null;
  }

  _createClass(YupSchemaRuleDescriptor, [{
    key: "isRequired",
    value: function isRequired() {
      return this.attributes.some(function (_ref) {
        var key = _ref.key;
        return key === YUP_KEYWORD_REQUIRED;
      });
    }
  }, {
    key: "type",
    get: function get() {
      if (isNullOrUndefined(this._type)) {
        return this._type;
      }

      var found = this.attributes.find(function (_ref2) {
        var key = _ref2.key;
        return YUP_TYPE_LIST.includes(key);
      });

      if (!isNullOrUndefined(found)) {
        this._type = found.key;
      }
    }
  }]);

  return YupSchemaRuleDescriptor;
}();
var YupSchemaRuleAttributeDescription = function YupSchemaRuleAttributeDescription(key) {
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  _classCallCheck(this, YupSchemaRuleAttributeDescription);

  this.key = key;
  this.values = values;
};

/**
 * Yup schema
 * @param {*} ast abstract syntax object
 */

function traverseYupSchemaAst (ast) {
  try {
    var meetExportDefaultObjectNode = false;
    var desc = new YupSchemaDescription();
    traverse(ast, {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        var objectNode = path.node.declaration;

        if (t.isCallExpression(objectNode) && t.isIdentifier(objectNode.callee) && objectNode.callee.name === 'object') {
          console.info('> got object node in ast document');
          meetExportDefaultObjectNode = true;

          var _iterator = _createForOfIteratorHelper(objectNode.arguments[0].properties),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var property = _step.value;
              var key = property.key,
                  value = property.value;
              var attributes = [];
              traverseRules(value, attributes);
              var rule = new YupSchemaRuleDescriptor(key.name);
              rule.attributes = attributes;
              desc.rules.push(rule);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          debugger;
        }
      }
    });

    if (meetExportDefaultObjectNode) {
      console.log('done.');
      return desc;
    } else {
      console.error('did not meet export default object call expression. failed!');
    }
  } catch (e) {
    console.error('can not visit AST document');
    console.error(e);
  }
}

function traverseRules(value, attributes) {
  if (t.isCallExpression(value)) {
    var callee = value.callee;

    if (t.isIdentifier(callee)) {
      var name = callee.name;
      attributes.push(new YupSchemaRuleAttributeDescription(name));
      return;
    } else if (t.isMemberExpression(callee)) {
      var object = callee.object,
          property = callee.property;
      attributes.push(new YupSchemaRuleAttributeDescription(property.name));
      traverseRules(object, attributes);
    }
  }
}

function jsonMock2YupSchema(file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
  console.info('==== parse JSON mock data and generate Yup schema ====');
  parseJsonMock(file, encoding).then(function (description) {
    generateYupSchema(description).then(function (schema) {
      console.log(schema);
      fs.writeFile(__dirname + '/schema.js', schema, encoding, function (err) {
        if (err) {
          return console.error(err);
        }

        console.log('schema.js was updated');
      });
    });
  });
}
function yupSchema2FormUI(file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
  console.info('==== parse Yup schema and generate form UI ====');
  parseYupSchema(file, encoding).then(function (schema) {
    console.log(schema);
    var code = generateFormUI(schema);
    console.log(code);
  });
}
function traverseYupSchema(file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
  fs.readFile(file, encoding, function (err, contents) {
    if (err) {
      console.error(err);
      reject(err);
      return;
    }

    var ast = parser.parse(contents, {
      sourceType: 'module'
    });

    if (!isNullOrUndefined(ast)) {
      traverseYupSchemaAst(ast);
    }
  });
}
function go(file) {
  var encoding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';
  parseJsonMock(file, encoding).then(function (description) {
    generateYupSchema(description).then(function (schema) {
      fs.writeFile(__dirname + '/schema.js', schema, encoding, function (err) {
        if (err) {
          return console.error(err);
        }

        console.log('schema.js was updated');
      });
      parseYupSchema(__dirname + '/schema.js').then(function (schema) {
        var code = generateFormUI(schema);
        fs.writeFile(__dirname + '/form.jsx', code, encoding, function (err) {
          if (err) {
            return console.error(err);
          }

          console.log('form.jsx was updated');
          console.log('done.');
        });
      });
    });
  });
}

exports.go = go;
exports.jsonMock2YupSchema = jsonMock2YupSchema;
exports.traverseYupSchema = traverseYupSchema;
exports.yupSchema2FormUI = yupSchema2FormUI;
//# sourceMappingURL=index.js.map
