export default object({
  // 合作模式
  cooperation: number()
    .required(t("snackmachine.pleaseChooseCooperationMode"))
    .typeError(t("snackmachine.pleaseChooseCooperationMode"))
    .transform(toFirstValue),
  // 固定租金
  //  当合作模式为固定租金时, 必填, 值域[0-8000]
  //  当合作模式为其他, 非必填, 强制转化为 null
  rent: mixed().when("cooperation", {
    is: DEFAULT_COOPERATION_MODE_VALUE,
    then: number()
      .required(t("snackmachine.pleaseTypeRental"))
      .typeError(t("snackmachine.pleaseCorrectRental"))
      .min(0, t("snackmachine.pleaseCorrectRental"))
      .max(8000, t("snackmachine.pleaseCorrectRental")),
    otherwise: number().notRequired().nullable(true).transform(forceEmpty),
  }),
  // 固定租金支付周期
  //  当固定租金有填写时必填, 值域[0-12]
  rentPaymentCycle: mixed().when(["cooperation", "rentPaymentCycleType"], {
    is: (cooperation, rentPaymentCycleType) =>
      (cooperation === DEFAULT_COOPERATION_MODE_VALUE ||
        cooperation === COOPERATION_MODE_DEDUCATE) &&
      rentPaymentCycleType === WER_PAYMENT_CYCLE_MONTH.value,
    then: mixed()
      .required(t("snackmachine.pleaseTypePaymentCycle"))
      .transform(forceNumber)
      .oneOf(monthList, "请输入正确的租金支付周期"),
    otherwise: number().notRequired().nullable(true).transform(forceEmpty),
  }),
  // 固定租金支付周期单位
  //  当固定租金值有填写时必填, 值域[WERPaymentCycleTypeList]
  rentPaymentCycleType: mixed().when("cooperation", {
    is: (v) =>
      v === DEFAULT_COOPERATION_MODE_VALUE || v === COOPERATION_MODE_DEDUCATE,
    then: number()
      .required("请选择租金支付周期单位")
      .typeError("请选择租金支付周期单位")
      .oneOf(WERPaymentCycleTypeList, "请选择租金支付周期单位"),
    otherwise: number().notRequired().nullable(true).transform(forceEmpty),
  }),
  // 抽成比例
  //  当合作模式为流水抽成时, 必填, 值域[0-50]
  //  当合作模式为其他时, 非必填, 强制转化为 null
  deductRatio: number().when("cooperation", {
    is: COOPERATION_MODE_DEDUCATE,
    then: number()
      .required(t("snackmachine.pleaseTypeDeductRatio"))
      .typeError(t("snackmachine.pleaseCorrectDeductRatio"))
      .min(0, t("snackmachine.pleaseCorrectDeductRatio"))
      .max(100, t("snackmachine.pleaseCorrectDeductRatio")),
    otherwise: number()
      .notRequired()
      .nullable(true)
      .typeError(t("snackmachine.pleaseCorrectDeductRatio"))
      .min(0, t("snackmachine.pleaseCorrectDeductRatio"))
      .max(100, t("snackmachine.pleaseCorrectDeductRatio")),
  }),
  // 企业折扣
  //  当合作模式为流水抽成时, 必填, 值域[50-100]
  //  当合作模式为其他时, 非必填, 强制转化为 null
  discount: number().when("cooperation", {
    is: COOPERATION_MODE_ENTERPRISE_SUPPORTING,
    then: number()
      .required(t("snackmachine.pleaseInputDiscount"))
      .typeError(t("snackmachine.pleaseCorrectDiscount"))
      .min(0, t("snackmachine.pleaseCorrectDiscount"))
      .max(100, t("snackmachine.pleaseCorrectDiscount")),
    otherwise: number()
      .notRequired()
      .nullable(true)
      .typeError(t("snackmachine.pleaseCorrectDiscount"))
      .min(0, t("snackmachine.pleaseCorrectDiscount"))
      .max(100, t("snackmachine.pleaseCorrectDiscount")),
  }),
  // 是否包含水电费, 必填
  includeWaterElectric: number()
    .required(t("snackmachine.pleaseChooseIncludeWaterElectric"))
    .typeError(t("snackmachine.pleaseChooseIncludeWaterElectric"))
    .transform(toFirstValue),
  // 电费
  //  当包含水电费值为YES(1)时, 非必填
  //  当包含水电费为NO(2)时, 必填, 值域[0-1000]
  electricityFee: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .required(t("snackmachine.pleaseTypeElectricityFee"))
      .typeError(t("snackmachine.pleaseCorrectElectricityFee"))
      .min(0, t("snackmachine.pleaseCorrectElectricityFee"))
      .max(1000, t("snackmachine.pleaseCorrectElectricityFee")),
  }),
  // 电费计量单位
  //  当包含水电费值为YES(1)时, 非必填
  //  当包含水电费为NO(2)时, 必填, 值域[ELECTRICITY_MEASURE_ENUM]
  electricMetering: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .required(t("snackmachine.pleaseChooseElectricMetering"))
      .typeError(t("snackmachine.pleaseChooseElectricMetering"))
      .oneOf(
        ELECTRICITY_MEASURE_ENUM.map((i) => i.value),
        t("snackmachine.pleaseChooseElectricMetering")
      ),
  }),
  // 水费
  //  当包含水电费值为YES(1)时, 非必填
  //  当包含水电费为NO(2)时, 必填, 值域[0-1000]
  waterFee: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .required(t("snackmachine.pleaseTypeWaterFee"))
      .typeError(t("snackmachine.pleaseCorrectWaterFee"))
      .min(0, t("snackmachine.pleaseCorrectWaterFee"))
      .max(1000, t("snackmachine.pleaseCorrectWaterFee")),
  }),
  // 水费计量单位
  //  当包含水电费值为YES(1)时, 非必填
  //  当包含水电费为NO(2)时, 必填, 值域[WATER_MEASURE_ENUM]
  waterMetering: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .required(t("snackmachine.pleaseChooseWaterMetering"))
      .typeError(t("snackmachine.pleaseChooseWaterMetering"))
      .oneOf(
        WATER_MEASURE_ENUM.map((i) => i.value),
        t("snackmachine.pleaseChooseWaterMetering")
      ),
  }),
  // 水电费支付周期
  //  当包含水电费为NO(2), 且水电费支付周期单位不等于一次性(WER_PAYMENT_CYCLE_DISPOSABLE) 必填, 值域[1-12]
  //  当包含水电费值为YES(1), 且时, 非必填, 强制转化为 null
  waterAndElectricityPaymentCycle: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .notRequired()
      .nullable()
      .typeError("请输入正确的水电费支付周期"),
  }),
  // 水电费支付周期单位
  //  当包含水电费值为YES(1)时, 非必填
  //  当包含水电费为NO(2)时, 必填, 值域[WERPaymentCycleTypeList]
  waterAndElectricityPaymentCycleType: mixed().when("includeWaterElectric", {
    is: YES,
    then: number().notRequired().nullable(true).transform(forceEmpty),
    otherwise: number()
      .required("请选择水电费支付周期单位")
      .oneOf(WERPaymentCycleTypeList, "请选择水电费支付周期单位"),
  }),
  // 是否还有其他费用, 必填
  hasOtherFees: number()
    .required(t("snackmachine.pleaseChooseHasOtherFees"))
    .typeError(t("snackmachine.pleaseChooseHasOtherFees")),
  // 其他费用项目1
  //  当是否还有其他费用值为YES(1)时, 必填, 值域[aviableOtherFeesList(1-12, not 0)]
  //  当是否还有其他费用值为NO(2)时, 非必填, 强制转化为 null
  otherFees: mixed().when("hasOtherFees", {
    is: YES,
    then: number()
      .required("请选择其他费用项目 1")
      .typeError("请选择其他费用项目 1")
      .oneOf(aviableOtherFeesList, "请选择其他费用 1 项目")
      .transform(toFirstValue),
    otherwise: number().notRequired().nullable().transform(forceEmpty),
  }),
  // 其他费用项目1的具体数值
  //  当是否还有其他费用值为YES(1)时, 必填, 值域[1-8000]
  //  当是否还有其他费用值为NO(2)时, 非必填, 强制转化为 null
  otherFeesDesc: mixed().when("otherFees", {
    is: (value) => aviableOtherFeesList.includes(value),
    then: number()
      .required(t("snackmachine.pleaseTypeOtherFeesDetail"))
      .typeError(t("snackmachine.pleaseCorrectOtherFeesDetail"))
      .min(1, t("snackmachine.pleaseCorrectOtherFeesDetail"))
      .max(8000, t("snackmachine.pleaseCorrectOtherFeesDetail")),
    otherwise: number().notRequired().nullable().transform(forceEmpty),
  }),
  // 其他费用项目1支付周期
  //  当是否还有其他费用值为YES(1), 且其他费用项目1支付周期单位不等于一次性(OTHERFEES_PAYMENT_CYCLE_DISPOSABLE)时, 必填, 值域[1-12]
  //  当是否还有其他费用值为NO(2)时, 非必填, 强制转化为 null
  otherFeesPaymentCycle: mixed().when(
    ["otherFees", "otherFeesPaymentCycleType"],
    {
      is: (otherFees, otherFeesPaymentCycleType) =>
        aviableOtherFeesList.includes(otherFees) &&
        otherFeesPaymentCycleType !== OTHERFEES_PAYMENT_CYCLE_DISPOSABLE.value,
      then: number()
        .required("请输入其他费用 1 支付周期")
        .typeError("请输入正确的其他费用 1 支付周期")
        .oneOf(monthList, "请输入正确的其他费用 1 支付周期"),
      otherwise: number().notRequired().nullable().transform(forceEmpty),
    }
  ),
  // 其他费用项目1支付周期单位
  //  当是否还有其他费用值为YES(1), 必填, 值域[otherFeesPaymentCycleTypeList]
  //  当是否还有其他费用值为NO(2)时, 非必填, 强制转化为 null
  otherFeesPaymentCycleType: mixed().when("hasOtherFees", {
    is: YES,
    then: number()
      .required("请选择其他费用项目 1 支付周期单位")
      .typeError("请选择其他费用项目 1 支付周期单位")
      .oneOf(
        otherFeesPaymentCycleTypeList,
        "请选择正确的其他费用 1 支付周期单位"
      ),
    otherwise: number().notRequired().nullable().transform(forceEmpty),
  }),
  // 其他费用项目2, 非必填, 值域[OTHER_FEES_ENUM]
  otherFees2: number()
    .notRequired()
    .nullable()
    .oneOf(
      OTHER_FEES_ENUM.map((i) => i.value),
      "请选择正确的其他费用2"
    )
    .transform(toFirstValue),
  // 其他费用项目2的具体数值
  otherFees2Desc: number()
    .transform((i) => i >> 0)
    .notRequired()
    .nullable()
    .min(0, "请输入正确的其他费用 2")
    .max(8000, "请输入正确的其他费用 2"),
  //  当其他费用项目2有值且合法时, 必填, 值域[1-8000]
  //  当其他费用项目2无值或不合法时, 非必填, 强制转化为 null
  // otherFees2Desc: mixed().when('otherFees2', {
  //   is: (value) => aviableOtherFeesList.includes(value),
  //   then: number().required().typeError('请输入正确的其他费用 2').min(1, '请输入正确的其他费用 2').max(8000, '请输入正确的其他费用 2'),
  //   otherwise: number().notRequired().nullable(true).transform(forceEmpty),
  // }),
  // 其他费用项目2的支付周期
  otherFees2PaymentCycle: number()
    .notRequired()
    .nullable(true)
    .oneOf(monthList, "请输入正确的其他费用 2 支付周期"),

  //  当其他费用项目2有值且合法, 并且支付周期单位不是一次性(OTHERFEES_PAYMENT_CYCLE_DISPOSABLE)时, 必填, 值域[1-12]
  //  当其他费用项目2无值或不合法, 或者支付周期单位是一次性时, 非必填, 强制转化为 null
  // otherFees2PaymentCycle: number().when(['otherFees2', 'otherFees2PaymentCycleType'], {
  //   is: (otherFees2, otherFees2PaymentCycleType) => aviableOtherFeesList.includes(otherFees2) && otherFees2PaymentCycleType !== OTHERFEES_PAYMENT_CYCLE_DISPOSABLE.value,
  //   then: number().required('请输入其他费用 2 支付周期').typeError('请输入正确的其他费用 2 支付周期').oneOf(monthList, "请输入正确的其他费用 2 支付周期"),
  //   otherwise: number().notRequired().nullable(true).transform(forceEmpty)
  // }),
  // 其他费用项目2的支付周期
  otherFees2PaymentCycleType: number().notRequired().nullable(true),

  //  当其他费用项目2有值且合法时, 必填, 值域[1-12]
  //  当其他费用项目2无值或不合法时, 非必填, 强制转化为 null
  // otherFees2PaymentCycleType: number().when('otherFees2', {
  //   is: (value) => aviableOtherFeesList.includes(value),
  //   then: number().required('请选择其他费用 2 支付周期单位').typeError('请选择其他费用 2 支付周期单位').oneOf(otherFeesPaymentCycleTypeList, "请选择其他费用 2 支付周期单位"),
  //   otherwise: number().notRequired().nullable(true),
  // }),
  // 租期, 必填, 值域[0-200]
  rentPeriod: number()
    .required(t("snackmachine.pleaseTypeRentPeriod"))
    .typeError(t("snackmachine.pleaseTypeRentPeriod"))
    .min(0, t("snackmachine.pleaseCorrectRentPeriod"))
    .max(200, t("snackmachine.pleaseCorrectRentPeriod")),
  // 违约金, 必填, 值域[0-10]
  //  当合作模式为企业配套或者0租金模式时, 非必填, 强制转化为 null
  liquidatedDamages: number().when("cooperation", {
    is: (value) =>
      value === COOPERATION_MODE_ENTERPRISE_SUPPORTING ||
      value === COOPERATION_MODE_ZERO_RENTAL,
    then: number().notRequired().nullable().transform(forceEmpty),
    otherwise: number()
      .required(t("snackmachine.pleaseTypeLiquidatedDamages"))
      .typeError("请填写正确的违约金")
      .oneOf(
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        t("snackmachine.pleaseCorrectLiquidatedDamages")
      ),
  }),
  // 允许补货时间段-起始, 必填,
  supplyPeriodStart: string().required(t("snackmachine.pleaseTypeSupplyStart")),
  // 允许补货时间段-结束, 必填
  supplyPeriodEnd: string().required(t("snackmachine.pleaseTypeSupplyEnd")),
  // 可施工时间段-起始, 必填
  canConstructStart: string().required(
    t("snackmachine.pleaseChooseCanConstructStart")
  ),
  // 可施工时间段-结束, 必填
  canConstructEnd: string().required(
    t("snackmachine.pleaseChooseCanConstructEnd")
  ),
  // 特批附件, 必填
  attachments: array().of(string()).notRequired().ensure(),
  // 联系地址, 必填
  contextAddress: string().required("请输入联系地址"),
  // 保证金/押金, 必填, 值域[1-8000]
  deposit: number()
    .notRequired()
    .typeError("请输入正确的保证金/押金")
    .min(1, "请输入正确的保证金/押金")
    .max(8000, "请输入正确的保证金/押金"),
});
