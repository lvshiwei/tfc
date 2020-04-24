import fs from "fs";
import { isNullOrUndefined } from "./lib/asserts";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { TypeDescriptor } from "./TypeDescriptor";

export default function (file, encoding = "utf8") {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, function (err, contents) {
      if (err) {
        console.error("Yup schema parse error", err);
        reject(err);
        return;
      }

      const doc = parse(contents, { sourceType: "module" });
      const schema = {};

      const isCalleeNode = (node, name) =>
        t.isIdentifier(node.callee, { name }) ||
        (t.isMemberExpression(node.callee) &&
          t.isIdentifier(node.callee.property, { name }));

      const isRootNode = (node) => isCalleeNode(node, "object");

      const typeVisitor = {
        CallExpression(path) {
          const { parentKey } = path;
          if (parentKey === "arguments") {
            path.skip();
            return;
          }

          const td = TypeDescriptor.parse(path);
          if (!isNullOrUndefined(td)) {
            schema[this.key].push(td);
          } else {
            console.error("parse error:", this.key);
          }
        },
        ObjectProperty(path) {
          path.skip();
        },
      };
      const propertyVisitor = {
        ObjectProperty(path) {
          const { key } = path.node;
          if (
            key.name === "is" ||
            key.name === "then" ||
            key.name === "otherwise"
          ) {
            path.skip();
            return;
          }

          schema[key.name] = [];

          path.traverse(typeVisitor, { key: key.name });
        },
      };

      const rootVisitor = {
        ObjectExpression(path) {
          const { parentKey, parent } = path;
          if (parentKey === "arguments" && isRootNode(parent)) {
            path.traverse(propertyVisitor);
            return;
          }
        },
      };

      traverse(doc, {
        CallExpression(p) {
          const { node } = p;
          if (isRootNode(node)) {
            p.traverse(rootVisitor);
          }
        },
      });

      resolve(schema);
    });
  });
}
