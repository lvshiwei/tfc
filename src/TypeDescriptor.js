import { isNotEmptyArray } from "./lib/asserts";

export class TypeDescriptor {
  constructor(name) {
    this.name = name;
  }

  toString() {
    return this.name;
  }

  static parse(ast) {
    const { node } = ast;
    const name = node.callee.name || node.callee.property.name;
    if (name === "label") {
      return new LabelDescriptor(name, ast);
    } else {
      return new TypeDescriptor(name);
    }
  }
}

export class LabelDescriptor extends TypeDescriptor {
  constructor(name, ast) {
    super(name);
    this.value = isNotEmptyArray(ast.node.arguments)
      ? ast.node.arguments[0].value
      : null;

    return this;
  }

  toString() {
    return this.name + ": " + this.value;
  }
}
