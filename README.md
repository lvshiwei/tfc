# What is tfc

tfc is an awesome tool for building a form with model binding and validation, it generates codes for continuous development, and just start a few lines of code like JSON object.

- Project building progress 80%, we are going to provide a complete version and examples very soon, thank you.

## example

This is the JSON data mocker script.

```javascript
export default {
  // 地址
  // @max 30
  location: '厦门市湖里区',
  // 经度
  longitude: 109.203993,
  // 纬度
  // @number 请填写正确的纬度
  // @min 0, foo, bar, true, 3
  // @max 19999,不能太大
  latitude: 25.03949,
  // 日期
  // @date
  // @required 请填写日期
  // @max 2099/12/31,不能太晚
  // @nullable false, 说点啥
  start: 1586854463211,
  // @number
  // @typeError 请填写正确的数字
  amount: 21,
  // 立刻生效
  // @bool
  // @required 请选择是否立刻生效
  active: true,
};
```

## Annotations

That is not a real JSON because JSON dose not support leading comment, and leading comments are powerfull and easy to use, Please take a look at annotations what leading comments start with prefix <code>@</code>, if you know about [Yup](https://github.com/jquense/yup), it may be good to understand. annotations will transform to rules on field. leading comments without prefix <code>@</code> will transform to a label text of form fileds.

## Get start

```shell
$ npm install -g

$ tfc -j jsonMock.js
```

## What will you get

### First, a validation schema, depends on [Yup](https://github.com/jquense/yup)

```javascript
export default object({
  location: string().label('地址').max(30),
  longitude: number().label('经度'),
  latitude: number('请填写正确的纬度')
    .label('纬度')
    .min(0, 'foo', 'bar', true, 3)
    .max(19999, '不能太大'),
  start: date()
    .label('日期')
    .required('请填写日期')
    .max(new Date('2099/12/31'), '不能太晚')
    .nullable(false, '说点啥'),
  amount: number().typeError('请填写正确的数字'),
  active: bool().label('立刻生效').required('请选择是否立刻生效'),
});
```

### Second, a real H5 form code file, depends on [Ant-Design Mobile](https://mobile.ant.design/docs/react/introduce-cn) components library.

```jsx
<div className="form-wrapper">
  <List>
    <InputItem
      className={renderClassName('location')}
      onChange={handleInputChange('location')}
      onBlur={handleLeaveInput('location')}
    >
      地址
    </InputItem>
    <InputItem
      className={renderClassName('longitude')}
      onChange={handleInputChange('longitude')}
      onBlur={handleLeaveInput('longitude')}
    >
      经度
    </InputItem>
    <InputItem
      className={renderClassName('latitude')}
      onChange={handleInputChange('latitude')}
      onBlur={handleLeaveInput('latitude')}
    >
      纬度
    </InputItem>
    <DatePicker mode="date" onChange={handleSelectChange('start')}>
      <List.Item arrow="horizontal" className={renderClassName('start')}>
        日期
        <Required />
      </List.Item>
    </DatePicker>
    <InputItem
      className={renderClassName('amount')}
      onChange={handleInputChange('amount')}
      onBlur={handleLeaveInput('amount')}
    ></InputItem>
    <InputItem
      className={renderClassName('active')}
      onChange={handleInputChange('active')}
      onBlur={handleLeaveInput('active')}
    >
      立刻生效
      <Required />
    </InputItem>
  </List>
  <Button onClick={handleSubmit}>submit</Button>
</div>
```

Now you get a <code>form.jsx</code> and <code>schema.js</code> and React Hooks named <code>useModel</code> and <code>useValidation</code> just try to submit and enjoy it.

## Hooks

### useModel

This hook is for model binding.

```javascript
const [model, setModel] = useModel({ age: 8 });

// set a field
setModel('age', 15);
// model => {age:  15}

setModel({ gender: 'femal' });
// model => {age: 15, gender: 'femal'}
```

### useValidation

This hook is for validation.

```javascript
const schema = yup.object({
  name: string().max(5, '名字不要写太长'),
  age: number().min(18, '年纪不合法'),
});
const model = { name: '亲爱的特里斯坦帕帕森', age: 9 };
const [validate, errors] = useValidation(schema);

validate(model).catch(console.error);
// console
// ValidationErrors{
//  errors: ['名字不要写太长', '年纪不合法']
//  ...
// }

validate('age', 13).catch(console.error);
// console
// ValidationErrors{
//   errors: ['年纪不合法']
// }
```
