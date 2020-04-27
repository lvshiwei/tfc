/**
 * @overview Yup Schema traverser
 * @author shiwei.lv
 */

import {
  YupSchemaDescription,
  YupSchemaRuleDescriptor,
  YupSchemaRuleAttributeDescription,
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
    if (t.isIdentifier(callee)) {
      const { name } = callee;
      attributes.push(new YupSchemaRuleAttributeDescription(name));

      return;
    } else if (t.isMemberExpression(callee)) {
      const { object, property } = callee;
      attributes.push(new YupSchemaRuleAttributeDescription(property.name));

      traverseRules(object, attributes);
    }
  }
}
