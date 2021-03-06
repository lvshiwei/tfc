export const YUP_TYPE_STRING = 'string';
export const YUP_TYPE_NUMBER = 'number';
export const YUP_TYPE_BOOL = 'bool';
export const YUP_TYPE_DATE = 'date';
export const YUP_TYPE_ARRAY = 'array';
export const YUP_TYPE_MIXED = 'mixed';
export const YUP_KEYWORD_REQUIRED = 'required';
export const YUP_KEYWORD_LABEL = 'label';
export const YUP_KEYWORD_TYPE_ERROR = 'typeError';
/**
 * YUP合法的指令集
 */
export const YUP_TYPE_LIST = [
  YUP_TYPE_MIXED,
  YUP_TYPE_STRING,
  YUP_TYPE_NUMBER,
  YUP_TYPE_DATE,
  YUP_TYPE_ARRAY,
  YUP_TYPE_BOOL,
];

export const YUP_TYPE_CASTORS = {
  [YUP_TYPE_MIXED]: (value) => value,
  [YUP_TYPE_STRING]: (value) => String(value),
  [YUP_TYPE_NUMBER]: (value) => Number(value),
  [YUP_TYPE_DATE]: (value) => new Date(value),
  [YUP_TYPE_BOOL]: (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  },
};
