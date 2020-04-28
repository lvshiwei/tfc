export default object({
  id: string(),

  expandProjectNo: string().label('编号').required('无意向项目编号'),

  shopLocation: string()
    .label('门店地址')
    .required('请输入展示给顾客的门店地址')
    .max(100, '门店地址最多100个字')
    .dd([1, 2, 3], 'abc'),

  floorLocation: string()
    .label('楼层位置')
    .notRequired('楼层位置')
    .max(5, '楼层位置最多5个字'),

  preLongitude: number()
    .label('经度')
    .required('请选择门店定位')
    .typeError('请选择门店定位'),

  preLatitude: number()
    .label('纬度')
    .required('请选择门店定位')
    .typeError('请选择门店定位'),

  preOpeningTime: date().label('开业日期').required('请选择预计开业日期'),

  isSupportCanteen: array()
    .label('支持堂食')
    .required('请选择是否支持堂食')
    .of(number().oneOf(getEnumValues(YESNO_ENUM), '请选择是否支持堂食')),

  seatsNumber: number()
    .label('门店座位数')
    .transform(forceNumber)
    .required('请输入门店座位数')
    .typeError('请输入正确的门店座位数')
    .min(0.1, '请输入正确的门店座位数')
    .max(99, '请输入正确的门店座位数'),

  killerCompany: array()
    .label('消杀公司')
    .required('请选择消杀公司')
    .of(number().oneOf(getEnumValues(DISINFECTION_ENUM), '请选择消杀公司')),

  isOpenDelivery: array()
    .label('开放外送')
    .required('请选择是否开通外送')
    .of(number().oneOf(getEnumValues(YESNO_ENUM), '请选择是否开通外送')),

  isSelfDelivery: date()
    .label('自行配送')
    .when('isOpenDelivery', {
      is: (value) => firstItem(value) === YES.value,
      then: array()
        .required('请选择是否自行配送')
        .of(number().oneOf(getEnumValues(YESNO_ENUM), '请选择是否开通外送')),
      otherwise: mixed().notRequired().nullable(),
    }),

  selfDeliveryRadius: number()
    .label('自行配送半径')
    .when('isSelfDelivery', {
      is: (value) => firstItem(value) === YES.value,
      then: array()
        .required('请选择自行配送半径')
        .of(number().oneOf(DELIVERY_RADIUS, '请选择自行配送半径')),
      otherwise: mixed().notRequired().nullable(),
    }),

  otherDeliveryType: string()
    .label('其他配送方式')
    .when('isOpenDelivery', {
      is: (value) => firstItem(value) === YES.value,
      then: array().required('请选择其他配送方式').of(number().default(0)),
      otherwise: mixed().notRequired().nullable(),
    }),

  otherDeliveryTypeRadius: mixed()
    .label('其他配送方式半径')
    .when('otherDeliveryType', {
      is: (value) => firstItem(value) > 0,
      then: array()
        .required('请选择其他配送方式半径')
        .of(number().oneOf(DELIVERY_RADIUS, '请选择其他配送方式半径')),
      otherwise: mixed().notRequired().nullable(),
    }),
});
