/**
 * @overview Yup Schema traverser
 * @author shiwei.lv
 */

import {
  YupSchemaDescription,
  YupSchemaRuleDescriptor,
  YupSchemaRuleAttributeDescriptor,
} from './SchemaDescription';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
/**
 * Yup schema
 * @param {*} ast abstract syntax object
 */
export default function (ast) {
  try {
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
          console.info('> got object node in ast document');
          meetExportDefaultObjectNode = true;

          for (const property of objectNode.arguments[0].properties) {
            const { key, value } = property;
            const attributes = [];
            traverseRules(value, attributes);
            const rule = new YupSchemaRuleDescriptor(key.name);
            rule.attributes = attributes;

            desc.rules.push(rule);
          }

          debugger;
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
  } catch (e) {
    console.error('can not visit AST document');
    console.error(e);
  }
}

function traverseRules(value, attributes) {
  if (t.isCallExpression(value)) {
    const { callee } = value;

    attributes.push(
      new YupSchemaRuleAttributeDescriptor(
        t.isMemberExpression(callee) ? callee.property.name : callee.name,
        parseValues(value.arguments),
      ),
    );

    if (t.isMemberExpression(callee)) {
      traverseRules(callee.object, attributes);
    }
  }
}

function parseValues(parameters) {
  return parameters.map((arg) => {
    if (t.isArrayExpression(arg)) {
      return arg.elements.map((e) => e.value);
    } else {
      return arg.value;
    }
  });
}
