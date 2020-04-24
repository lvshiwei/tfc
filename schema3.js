const confuse = object({
  nodeal: number(),
});
const schema = object({
  id: string(),

  expandProjectNo: string().required("无意向项目编号"),

  shopLocation: string()
    .required("请输入展示给顾客的门店地址")
    .max(100, "门店地址最多100个字"),

  floorLocation: string().notRequired("楼层位置").max(5, "楼层位置最多5个字"),

  preLongitude: number().required("请选择门店定位").typeError("请选择门店定位"),

  preLatitude: number().required("请选择门店定位").typeError("请选择门店定位"),

  preOpeningTime: date().required("请选择预计开业日期"),

  isSupportCanteen: array()
    .required("请选择是否支持堂食")
    .of(number().oneOf(getEnumValues(YESNO_ENUM), "请选择是否支持堂食")),

  seatsNumber: number()
    .transform(forceNumber)
    .required("请输入门店座位数")
    .typeError("请输入正确的门店座位数")
    .min(0.1, "请输入正确的门店座位数")
    .max(99, "请输入正确的门店座位数"),

  killerCompany: array()
    .required("请选择消杀公司")
    .of(number().oneOf(getEnumValues(DISINFECTION_ENUM), "请选择消杀公司")),

  isOpenDelivery: array()
    .required("请选择是否开通外送")
    .of(number().oneOf(getEnumValues(YESNO_ENUM), "请选择是否开通外送")),

  isSelfDelivery: date().when("isOpenDelivery", {
    is: (value) => firstItem(value) === YES.value,
    then: array()
      .required("请选择是否自行配送")
      .of(number().oneOf(getEnumValues(YESNO_ENUM), "请选择是否开通外送")),
    otherwise: mixed().notRequired().nullable(),
  }),

  selfDeliveryRadius: number().when("isSelfDelivery", {
    is: (value) => firstItem(value) === YES.value,
    then: array()
      .required("请选择自行配送半径")
      .of(number().oneOf(DELIVERY_RADIUS, "请选择自行配送半径")),
    otherwise: mixed().notRequired().nullable(),
  }),

  otherDeliveryType: string().when("isOpenDelivery", {
    is: (value) => firstItem(value) === YES.value,
    then: array().required("请选择其他配送方式").of(number().default(0)),
    otherwise: mixed().notRequired().nullable(),
  }),

  otherDeliveryTypeRadius: mixed().when("otherDeliveryType", {
    is: (value) => firstItem(value) > 0,
    then: array()
      .required("请选择其他配送方式半径")
      .of(number().oneOf(DELIVERY_RADIUS, "请选择其他配送方式半径")),
    otherwise: mixed().notRequired().nullable(),
  }),
});

export default schema;
