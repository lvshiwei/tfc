/**
* @overview 验证工具
* @author shiwei.lv
*/

import React, { useState } from 'react';
import { reach } from 'yup';
import { isNotEmptyArray } from '../../../../utils/asserts';
/**
 * 验证工具
 * @param {Yup} schema 验证规则
 */
export default function useValidate(schema) {
  const [errors, setErrors] = useState([]);

  /**
   * 添加验证错误
   * @param {*} path 验证规则路径
   * @param {*} e 错误实例
   */
  const addErrorItem = (path, e) => {
    if (!errors.some(item => item.path === path)) {
      e.path = path;
      errors.push(e);
      setErrors([...errors]);
    }
  };
  /**
   * 删除验证错误
   * @param {*} path 验证规则路径
   */
  const removeErrorItem = (path) => {
    const index = errors.findIndex(e => e.path === path);
    if (index > -1) {
      errors.splice(index, 1);
      setErrors([...errors]);
    }
  };

  /**
   * 验证整个对象
   */
  const validateModel = (model) => {
    return new Promise((resolve, reject) => {
      schema.validate(model, {abortEarly: false})
        .then(() => {
          setErrors([]);
          resolve();
        })
        .catch(e => {
          if (isNotEmptyArray(e.inner)) {
            setErrors([...e.inner]);
            reject({message: e.errors[0], details: e});
          } else {
            e.path = name;
            setErrors([e]);
            reject({message: e.message, details: e});
          }
        });
    });
  };
  /**
   * 验证指定字段名与值
   * @param {string} name 字段名
   * @param {*} value 指定值
   */
  const validateField = (name, value) => {
    return new Promise((resolve, reject) => {
      const slice = reach(schema, name);
      if (slice) {
        slice.validate(value)
          .then(() => {
            removeErrorItem(name);
            resolve();
          })
          .catch((e) => {
            addErrorItem(name, e);
            reject({message: e.message, details: e});
          });
      } else {
        reject({message: '找不到验证规则'});
      }
    });
  };

  const validateWrapper = function() {
    if (arguments.length === 1) {
      return validateModel(arguments[0]);
    } else if (arguments.length === 2) {
      return validateField(arguments[0], arguments[1]);
    } else {
      return undefined;
    }
  };

  return [validateWrapper, errors];
}
