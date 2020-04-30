import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import {
  isNotEmptyArray,
  isNullOrUndefined,
  isNotEmptyString,
} from './lib/asserts';
import {
  JsonMockDescription,
  JsonMockPropertyDescriptor,
  JsonMockPropertyAnnotation,
} from './JsonMockDescription';

import tidyProperty from './tidyJsonMockDescriptor';

/**
 * parse JSON Mock script content, generate JSON Mock Description
 * @see ./JsonMockDescription.js
 * @param {String} text
 */
export default function (text) {
  const ast = parse(text, { sourceType: 'module' });
  const description = traverseJsonMockAST(ast);

  return description;
}

export function traverseJsonMockAST(ast) {
  const description = new JsonMockDescription();

  const propertyVisitor = {
    ObjectProperty(path) {
      const property = makeJsonMockProperty(path.node);
      tidyProperty(property);
      description.properties.push(property);
    },
  };

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      path.traverse({
        ObjectExpression(path) {
          path.traverse(propertyVisitor);
        },
      });
    },
  });

  return description;
}

/**
 * 解析抽象语法节点
 * @param {Node} astNode ast 节点
 */
export function makeJsonMockProperty(astNode) {
  const { key, value, leadingComments } = astNode;
  const anotations = leadingComments
    .map((comment) => makeAnnotation(key.name, comment))
    .filter((i) => !isNullOrUndefined(i));

  return new JsonMockPropertyDescriptor(key.name, value.value, anotations);
}
/**
 * 解析申明
 * @param {*} text
 */
export function makeAnnotation(key, leadingComment) {
  if (leadingComment.value.trim() === '') {
    return null;
  }

  const r = /\s*(\S*)\s(.*)/;
  const matches = leadingComment.value.match(r);

  if (isNotEmptyArray(matches)) {
    const [, b, c] = matches;
    let header, body;
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
