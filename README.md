# what is tfc

tfc is an awsome tool for building a form, it products codes just need a few lines of code like JSON object.

## example

This is the JSON data mocker script.

```javascript
export default {
  //编号
  expandProjectNo: 'TM20391929',
  // 门店地址
  // @max 30
  shopLocation: '厦门市湖里区',
  // 经度
  preLongitude: 109.203993,
  // 纬度
  // @number 请填写正确的纬度
  // @min 0, XXX, yyy, true, 3
  // @max 19999,不能太大
  preLatitude: 25.03949,
  // 开业时间
  // @date
  // @required 请填写开业日期
  // @max 2099/12/31,不能太晚
  // @nullable false
  preOpeningTime: 1586854463211,
  // 支持堂食
  // @required 请选择是否支持堂食
  isSupportCanteen: 1,
  // 座位数
  // @number
  // @required 请填写座位数
  // @min 1, 请填写正确的座位数
  //
  seatsNumber: 20,
  // 立刻生效
  // @bool
  // @required 请输入是否立刻生效
  active: true,
};
```

Why not start with real JSON? Because of JSON dose not support leading comment, and leading comments are usefull.

## here we go

```shell
$ tfc -s jsonmock.js
```

## what did you get

### First, a validation schema depended on Yup

```javascript
/**
 * @overview A Yup schema generated by tfc.
 */
import { object, mixed, date, string, number, array } from 'yup';

export default object({
  shopLocation: string().label('地址').max(30),
  preLongitude: number().label('经度'),
  preLatitude: number('请填写正确的纬度')
    .label('纬度')
    .min(0, 'foo', 'bar', true, 3)
    .max(19999, '不能太大'),
  preOpeningTime: date()
    .label('开始时间')
    .required('请填写预开始时间')
    .max(new Date('2099/12/31'), '不能太晚')
    .nullable(false, '说点啥'),
  active: bool().label('立刻生效').required('请选择是否立刻生效'),
});
```

### Second, a real H5 form code depended on Ant-Design Mobile.

```jsx
/**
 * @overview A form component generated by tfc.
 * @author your.name@corp.com
 */
import React from 'react';
import classnames from 'classnames';
import schema from './schema';
import { useModel, useValidation } from './hooks';
import { List, InputItem, Picker, DatePicker } from 'antd-mobile';

/**
 * Say something to avoid warnning from eslint
 */
export default function () {
  const [model, setModel] = useModel({
    preOpeningTime: new Date(),
  });
  const [validate, errors] = useValidation(schema);

  const handleSubmit = () =>
    validate(model)
      .then(() => alert('Amazing!!'))
      .catch(console.error);

  const handleChangeInput = (name) => (value) => setModel(name, value);

  const handleLeaveInput = (name) => () => validate(name, model[name]);

  const handleChangeSelect = (name) => (value) => {
    setModel(name, value);
    validate(name, value);
  };

  const renderClassName = (name, properties) =>
    classnames(...(properties || []), {
      error: Array.isArray(errors) && errors.some((e) => e.path === name),
      hasValue: !(model[name] === null || typeof model[name] === 'undefined'),
    });

  const Required = () => <i className="required">*</i>;

  return (
    <div className="form-wrapper">
      <List>
        <InputItem
          className={renderClassName('expandProjectNo')}
          onChange={handleInputChange('expandProjectNo')}
          onBlur={handleLeaveInput('expandProjectNo')}
        >
          expandProjectNo
        </InputItem>
        <InputItem
          className={renderClassName('shopLocation')}
          onChange={handleInputChange('shopLocation')}
          onBlur={handleLeaveInput('shopLocation')}
        >
          门店地址
        </InputItem>
        <InputItem
          className={renderClassName('preLongitude')}
          onChange={handleInputChange('preLongitude')}
          onBlur={handleLeaveInput('preLongitude')}
        >
          经度
        </InputItem>
        <InputItem
          className={renderClassName('preLatitude')}
          onChange={handleInputChange('preLatitude')}
          onBlur={handleLeaveInput('preLatitude')}
        >
          纬度
        </InputItem>
        <DatePicker mode="date" onChange={handleSelectChange('preOpeningTime')}>
          <List.Item
            arrow="horizontal"
            className={renderClassName('preOpeningTime')}
          >
            预开业时间
          </List.Item>
        </DatePicker>
        <InputItem
          className={renderClassName('isSupportCanteen')}
          onChange={handleInputChange('isSupportCanteen')}
          onBlur={handleLeaveInput('isSupportCanteen')}
        >
          支持堂食
        </InputItem>
        <InputItem
          className={renderClassName('seatsNumber')}
          onChange={handleInputChange('seatsNumber')}
          onBlur={handleLeaveInput('seatsNumber')}
        >
          座位数
        </InputItem>
        <InputItem
          className={renderClassName('active')}
          onChange={handleInputChange('active')}
          onBlur={handleLeaveInput('active')}
        >
          生效的
        </InputItem>
      </List>
    </div>
  );
}
```
