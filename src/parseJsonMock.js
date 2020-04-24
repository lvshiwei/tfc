import fs from "fs";
import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import {
  isNotEmptyArray,
  isNullOrUndefined,
  isNotEmptyString,
} from "./lib/asserts";
import {
  JsonMockDescription,
  JsonMockPropertyDescriptor,
  JsonMockPropertyAnnotation,
} from "./JsonMockDescription";

/**
 * 解析JSON mock脚本文档, 生成描述文档
 * @param {}} file
 * @param {*} encoding
 */
export default function (file, encoding = "utf8") {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, function (err, contents) {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const doc = parse(contents, { sourceType: "module" });
      const description = parseJsonMockAST(doc);

      resolve(description);
    });
  });
}

/**
 * 解析Json Mock脚本语法术, 生成描述文档
 * @param {ast} jsonASTDocument
 */
export function parseJsonMockAST(jsonASTDocument) {
  const description = new JsonMockDescription();

  const propertyVisitor = {
    ObjectProperty(path) {
      const property = parseJsonMockProperty(path.node);
      description.properties.push(property);
    },
  };

  traverse(jsonASTDocument, {
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
export function parseJsonMockProperty(astNode) {
  const { key, value, leadingComments } = astNode;
  const anotations = leadingComments
    .map((comment) => parseAnnotation(key.name, comment))
    .filter((i) => !isNullOrUndefined(i));

  return new JsonMockPropertyDescriptor(key.name, value.value, anotations);
}
/**
 * 解析申明
 * @param {*} text
 */
export function parseAnnotation(key, leadingComment) {
  if (leadingComment.value.trim() === "") {
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
