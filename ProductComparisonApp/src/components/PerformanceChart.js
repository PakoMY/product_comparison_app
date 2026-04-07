import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Polyline, Line, Text as SvgText} from 'react-native-svg';
import {colors} from '../constants/colors';
import {
  navToCumulativeReturnPercent,
  getXTickIndices,
  dateLabelAtIndex,
} from '../utils/chartHelper';

const PALETTE = ['#FF6A3D', '#2563EB', '#16A34A', '#CA8A04', '#9333EA'];
const PAD = {l: 44, r: 12, t: 16, b: 32};
const INNER_H = 148;

/**
 * series[].data 为净值序列；纵轴为相对期初的累计收益率(%)，横轴为时间采样点
 */
export function PerformanceChart({series, period}) {
  const [w, setW] = useState(320);
  const onLayout = e => setW(e.nativeEvent.layout.width);

  const {paths, yTicks, xTicks, svgH} = useMemo(() => {
    if (!series?.length) {
      return {paths: [], yTicks: [], xTicks: [], svgH: 120};
    }
    const returnSeries = series.map((s, idx) => ({
      key: s.key ?? idx,
      color: s.color ?? PALETTE[idx % PALETTE.length],
      data: navToCumulativeReturnPercent(s.data || []),
    }));
    const all = returnSeries.flatMap(s => s.data);
    if (!all.length) {
      return {paths: [], yTicks: [], xTicks: [], svgH: 120};
    }
    let min = Math.min(...all);
    let max = Math.max(...all);
    if (min === max) {
      min -= 0.5;
      max += 0.5;
    }
    const padY = (max - min) * 0.08 || 0.1;
    min -= padY;
    max += padY;
    const innerW = Math.max(1, w - PAD.l - PAD.r);
    const nPts = Math.max(...returnSeries.map(s => s.data.length), 1);
    const n = Math.max(nPts - 1, 1);

    const pts = returnSeries.map(s => {
      const data = s.data;
      const coords = data.map((v, i) => {
        const x = PAD.l + (nPts <= 1 ? innerW / 2 : (i / n) * innerW);
        const t = (v - min) / (max - min || 1);
        const y = PAD.t + INNER_H * (1 - t);
        return `${x},${y}`;
      });
      return {key: s.key, color: s.color, points: coords.join(' ')};
    });

    const tickCount = 4;
    const yTickList = [];
    for (let i = 0; i <= tickCount; i++) {
      const ratio = i / tickCount;
      const val = min + (max - min) * (1 - ratio);
      const y = PAD.t + INNER_H * ratio;
      yTickList.push({y, label: `${val.toFixed(2)}%`});
    }

    const idxs = getXTickIndices(nPts);
    const xTickList = idxs.map(i => ({
      x: PAD.l + (nPts <= 1 ? innerW / 2 : (i / n) * innerW),
      label: dateLabelAtIndex(i, nPts, period),
    }));

    const h = PAD.t + INNER_H + PAD.b;
    return {paths: pts, yTicks: yTickList, xTicks: xTickList, svgH: h};
  }, [series, w, period]);

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <Svg width={w} height={svgH}>
        {yTicks.map((t, i) => (
          <React.Fragment key={`y-${i}`}>
            <Line
              x1={PAD.l}
              y1={t.y}
              x2={w - PAD.r}
              y2={t.y}
              stroke={colors.border}
              strokeWidth={1}
            />
            <SvgText x={2} y={t.y + 4} fontSize={9} fill={colors.subtext}>
              {t.label}
            </SvgText>
          </React.Fragment>
        ))}
        {xTicks.map((t, i) => (
          <SvgText
            key={`x-${i}`}
            x={Math.min(w - PAD.r - 42, Math.max(PAD.l - 4, t.x - 26))}
            y={svgH - 14}
            fontSize={9}
            fill={colors.subtext}>
            {t.label}
          </SvgText>
        ))}
        {paths.map(p => (
          <Polyline
            key={p.key}
            points={p.points}
            fill="none"
            stroke={p.color}
            strokeWidth={2}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    paddingBottom: 8,
  },
});
