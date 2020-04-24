var { jsonMock2YupSchema, yupSchema2FormUI, go } = require('./index');
var path = require('path');
// jsonMock2YupSchema("/Users/lvshiwei/luckin/lab/tfc/jsonMock.js");
// yupSchema2FormUI("/Users/lvshiwei/luckin/lab/tfc/schema.js");
go(path.resolve(__dirname, '../jsonMock.js'));
