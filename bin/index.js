#!/usr/bin/env node

const program = require('commander');
const {
  jsonMock2YupSchema,
  yupSchema2AntDesignForm,
} = require('../dist/index');
const path = require('path');

program
  .version('0.1.0')
  .option(
    '-j, --jsonmock <jsonMock filename>',
    'parse JSON mock file and generate form code',
  )
  .option(
    '-s, --schema <Yup schema filename>',
    'parse schema file and generate form code',
  )
  .option('-f, --form [form]', 'set form code filename', 'form.jsx');

program.parse(process.argv);

const hasValue = (s) => typeof s === 'string' && s.length > 0;

const { jsonmock, schema, form } = program.opts();

if (!hasValue(jsonmock) && !hasValue(schema)) {
  console.error('what? just told me something to to.');
  return;
}

if (hasValue(jsonmock)) {
  const cwd = process.cwd();
  const jsonmockFilename = path.resolve(process.cwd(), jsonmock);
  const schemaFilename = path.resolve(cwd, schema || 'schema.js');
  const formFilename = path.resolve(cwd, form || 'form.jsx');
  jsonMock2YupSchema(jsonmockFilename, true, schemaFilename)
    .then(() => {
      yupSchema2AntDesignForm(schemaFilename, true, formFilename)
        .then(() => {
          console.log('done.');
        })
        .catch((e) => {
          console.error(e);
        });
    })
    .catch((e) => {
      console.error(e);
    });

  return;
}

if (hasValue(schema)) {
  const schemaFilename = schema;
  const formFilename = path.resolve(cwd, form || 'form.jsx');
  yupSchema2AntDesignForm(schemaFilename, true, formFilename)
    .then(() => {
      console.log('done.');
    })
    .catch((e) => {
      console.error(e);
    });

  return;
}
