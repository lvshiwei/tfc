import fs from 'fs';

import parseJsonMock from './parseJsonMock';
import parseYupSchema from './parseYupSchema';
import generateYupSchema from './generateYupSchema';
import generateFormUI from './generateFormUI';
import { parse } from '@babel/parser';
import traverseYupSchemaAst from './traverseYupSchemaAst';
import { isNullOrUndefined } from './lib/asserts';

export function jsonMock2YupSchema(file, encoding = 'utf8') {
  console.info('==== parse JSON mock data and generate Yup schema ====');

  parseJsonMock(file, encoding).then((description) => {
    generateYupSchema(description).then((schema) => {
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

export function yupSchema2FormUI(file, encoding = 'utf8') {
  console.info('==== parse Yup schema and generate form UI ====');

  parseYupSchema(file, encoding).then((schema) => {
    console.log(schema);
    const code = generateFormUI(schema);
    console.log(code);
  });
}

export function traverseYupSchema(file, encoding = 'utf8') {
  fs.readFile(file, encoding, function (err, contents) {
    if (err) {
      console.error(err);
      reject(err);
      return;
    }

    const ast = parse(contents, { sourceType: 'module' });
    if (!isNullOrUndefined(ast)) {
      traverseYupSchemaAst(ast);
    }
  });
}

export function go(file, encoding = 'utf8') {
  parseJsonMock(file, encoding).then((description) => {
    generateYupSchema(description).then((schema) => {
      fs.writeFile(__dirname + '/schema.js', schema, encoding, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('schema.js was updated');
      });

      parseYupSchema(__dirname + '/schema.js').then((schema) => {
        const code = generateFormUI(schema);

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
