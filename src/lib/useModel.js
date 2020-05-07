/**
* @overview 表单数据绑定模型
* @author shiwei.lv
*/

import React, { useState } from 'react';


/**
 * 表单数据绑定模型
 * @param {object} initvalue 初始化赋值
 */
export default function useModel(initvalue = {}) {
  const [model, setModel] = useState(initvalue);

  const setModelWrapper = function() {
    if (typeof arguments[0] === 'string') {
      const name = arguments[0];
      const value = arguments[1];
      const tm = {...model};
      tm[name] = value;
      setModel(tm);
      return;
    }

    if (typeof arguments[0] === 'object') {
      setModel({...model, ...arguments[0]});
      return;
    }
  };

  return [model, setModelWrapper];
}
