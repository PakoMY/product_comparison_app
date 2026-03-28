export const formatPercent = (v, digits = 1) => `${(v * 100).toFixed(digits)}%`;

export const formatSignedPercent = (v, digits = 1) => {
  const s = v > 0 ? '+' : '';
  return `${s}${(v * 100).toFixed(digits)}%`;
};

export const formatYi = (v, digits = 1) => `${v.toFixed(digits)} 亿`;

export const formatInt = v => v.toLocaleString('zh-CN');
