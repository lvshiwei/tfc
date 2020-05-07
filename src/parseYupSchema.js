import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import {
  YupSchemaDescription,
  YupSchemaRuleDescriptor,
  YupSchemaRuleDescriptorAttribute,
} from './YupSchemaDescription';

/**
 * parse Yup Schema script content to make Yup Schema description
 * @see ./YupSchemaDescription.js
 * @param {string} text
 */
export default function (text) {
  const ast = parse(text, { sourceType: 'module' });
  const description = traverseYupSchemaAST(ast);

  return description;
}

export function traverseYupSchemaAST(ast) {
  let meetExportDefaultObjectNode = false;
  const desc = new YupSchemaDescription();

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const { declaration: objectNode } = path.node;
      if (
        t.isCallExpression(objectNode) &&
        t.isIdentifier(objectNode.callee) &&
        objectNode.callee.name === 'object'
      ) {
        meetExportDefaultObjectNode = true;

        for (const property of objectNode.arguments[0].properties) {
          const { key, value } = property;
          const attributes = [];
          makeRuleDescriptor(value, attributes);
          const rule = new YupSchemaRuleDescriptor(key.name);
          rule.attributes = attributes;

          desc.rules.push(rule);
        }
      }
    },
  });

  if (meetExportDefaultObjectNode) {
    console.log('done.');

    return desc;
  } else {
    console.error(
      'did not meet export default object call expression. failed!',
    );
  }
}

function makeRuleDescriptor(value, attributes) {
  if (t.isCallExpression(value)) {
    const { callee } = value;

    attributes.push(
      new YupSchemaRuleDescriptorAttribute(
        t.isMemberExpression(callee) ? callee.property.name : callee.name,
        makeValues(value.arguments),
      ),
    );

    if (t.isMemberExpression(callee)) {
      makeRuleDescriptor(callee.object, attributes);
    }
  }
}

function makeValues(parameters) {
  return parameters.map((arg) => {
    if (t.isArrayExpression(arg)) {
      return arg.elements.map((e) => e.value);
    } else {
      return arg.value;
    }
  });
}
