var {
  go,
  jsonMock2YupSchema,
  yupSchema2FormUI,
  traverseYupSchema,
} = require('./index');
var path = require('path');
// jsonMock2YupSchema("/Users/lvshiwei/luckin/lab/tfc/jsonMock.js");
// go(path.resolve(__dirname, '../jsonMock.js'));
traverseYupSchema(path.resolve(__dirname, '../schema.js'));
