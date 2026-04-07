/**
 * 由净值序列估算区间收益率 (末/初 - 1)
 */
export function periodReturnFromNav(navArr) {
  if (!navArr?.length) {
    return 0;
  }
  const first = navArr[0];
  const last = navArr[navArr.length - 1];
  if (!first) {
    return 0;
  }
  return (last - first) / first;
}

/**
 * 净值序列 → 相对首点的累计收益率（百分比数值，如 5.2 表示 5.2%）
 */
export function navToCumulativeReturnPercent(navArr) {
  if (!navArr?.length) {
    return [];
  }
  const base = navArr[0];
  if (!base) {
    return [];
  }
  return navArr.map(v => (v / base - 1) * 100);
}

/**
 * 将多条净值序列对齐到同一横轴长度（取最短长度）
 */
export function alignNavSeries(seriesList) {
  if (!seriesList?.length) {
    return [];
  }
  const minLen = Math.min(
    ...seriesList.map(s => (s?.data || []).length).filter(Boolean),
  );
  if (!minLen) {
    return seriesList.map(s => ({...s, data: s.data || []}));
  }
  return seriesList.map(s => ({
    ...s,
    data: (s.data || []).slice(0, minLen),
  }));
}

/**
 * 横轴刻度索引：起点、中点、终点
 */
export function getXTickIndices(n) {
  if (n <= 0) {
    return [];
  }
  if (n === 1) {
    return [0];
  }
  if (n === 2) {
    return [0, 1];
  }
  return [0, Math.floor((n - 1) / 2), n - 1];
}

const SPAN_DAYS = {month1: 30, month3: 90, month6: 180, year1: 365};

/**
 * 按采样点索引线性插值日期标签（展示为时间轴）
 */
export function dateLabelAtIndex(i, totalPoints, periodKey) {
  const span = SPAN_DAYS[periodKey] ?? 90;
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - span);
  if (totalPoints <= 1) {
    return formatDateShort(end);
  }
  const t = i / (totalPoints - 1);
  const d = new Date(start.getTime() + t * (end.getTime() - start.getTime()));
  return formatDateShort(d);
}

function formatDateShort(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 中文星级展示 */
export function fundRatingToStars(text) {
  if (!text) {
    return '—';
  }
  if (text.includes('五')) {
    return '★★★★★';
  }
  if (text.includes('四')) {
    return '★★★★☆';
  }
  if (text.includes('三')) {
    return '★★★☆☆';
  }
  if (text.includes('二')) {
    return '★★☆☆☆';
  }
  if (text.includes('一')) {
    return '★☆☆☆☆';
  }
  return text;
}
