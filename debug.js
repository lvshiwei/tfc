var { jsonMock2YupSchema, yupSchema2AntDesignForm } = require('./dist/index');

jsonMock2YupSchema('../jsonMock.js').then(() => {
  yupSchema2AntDesignForm('../schema.js');
});
