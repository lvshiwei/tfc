import fs from 'fs';
import path from 'path';
import parseJsonMock from './parseJsonMock';
import parseYupSchema from './parseYupSchema';
import generateYupSchema from './generateYupSchema';
import generateAntDesignForm from './generateAntDesignForm';

export function jsonMock2YupSchema(
  filename,
  saveFile = false,
  saveFileName = 'schema.js',
) {
  return new Promise((resolve, reject) => {
    console.info(
      '==== parse JSON mock script file and generate Yup Schema ====',
    );

    return readFile(filename).then((content) => {
      const description = parseJsonMock(content);
      const code = generateYupSchema(description);

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

export function yupSchema2AntDesignForm(
  filename,
  saveFile = false,
  saveFileName = 'form.jsx',
) {
  return new Promise((resolve) => {
    console.info(
      '==== parse Yup schema and generate Ant-Design form code ====',
    );

    return readFile(filename).then((content) => {
      const description = parseYupSchema(content);
      const code = generateAntDesignForm(description);

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

function readFile(filename, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filename), encoding, function (
      err,
      content,
    ) {
      if (err) {
        console.error(err);
        reject();
      }
      resolve(content);
    });
  });
}

function saveCode(code, fileName, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, fileName), code, encoding, function (
      err,
    ) {
      if (!isNullOrUndefined(err)) {
        console.error(err);
        reject();
      }

      console.log(filename + ' save done.');
      resolve();
    });
  });
}
