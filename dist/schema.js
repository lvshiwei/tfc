/**
* @overview A Yup schema generated by tfc.
*/
import { object, mixed, date, string, number, array } from "yup";
export default object({
  location: string().label("地址").max(30),
  longitude: number().label("经度"),
  latitude: number("请填写正确的纬度").label("纬度").min(0, "foo", "bar", true, 3).max(19999, "不能太大"),
  start: date().label("日期").required("请填写日期").max(new Date("2099/12/31"), "不能太晚").nullable(false, "说点啥"),
  amount: number().typeError("请填写正确的数字"),
  active: bool().label("立刻生效").required("请选择是否立刻生效")
});