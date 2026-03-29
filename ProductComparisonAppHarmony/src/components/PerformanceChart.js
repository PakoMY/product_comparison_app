import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';
import {navToCumulativeReturnPercent, getXTickIndices, dateLabelAtIndex} from '../utils/chartHelper';

const PAD = {l: 44, r: 12, t: 12, b: 28};
const INNER_H = 120;

/**
 * 鸿蒙壳无 react-native-svg 时使用 View 散点近似折线（与 RN 0.82 RNOH tester 对齐）
 */
export function PerformanceChart({series, period}) {
  const [w, setW] = useState(320);
  const onLayout = e => setW(Math.max(200, e.nativeEvent.layout.width));

  const layout = useMemo(() => {
    if (!series?.length) {
      return null;
    }
    const returnSeries = series.map((s, idx) => ({
      key: s.key ?? String(idx),
      color: s.color,
      data: navToCumulativeReturnPercent(s.data || []),
    }));
    const all = returnSeries.flatMap(s => s.data);
    if (!all.length) {
      return null;
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
    const dots = returnSeries.map(s => ({
      key: s.key,
      color: s.color,
      pts: s.data.map((v, i) => ({
        x: PAD.l + (nPts <= 1 ? innerW / 2 : (i / n) * innerW),
        y: PAD.t + INNER_H * (1 - (v - min) / (max - min || 1)),
      })),
    }));
    const tickCount = 4;
    const yTicks = [];
    for (let i = 0; i <= tickCount; i++) {
      const ratio = i / tickCount;
      const val = min + (max - min) * (1 - ratio);
      const y = PAD.t + INNER_H * ratio;
      yTicks.push({y, label: `${val.toFixed(2)}%`});
    }
    const idxs = getXTickIndices(nPts);
    const xTicks = idxs.map(i => ({
      x: PAD.l + (nPts <= 1 ? innerW / 2 : (i / n) * innerW),
      label: dateLabelAtIndex(i, nPts, period),
    }));
    const h = PAD.t + INNER_H + PAD.b;
    return {dots, yTicks, xTicks, h};
  }, [series, w, period]);

  if (!layout) {
    return <View style={styles.wrap} onLayout={onLayout} />;
  }

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      <View style={[styles.canvas, {height: layout.h, width: w}]}>
        {layout.yTicks.map((t, i) => (
          <View
            key={`g-${i}`}
            style={[styles.gridH, {top: t.y, left: PAD.l, width: w - PAD.l - PAD.r}]}
          />
        ))}
        {layout.yTicks.map((t, i) => (
          <Text key={`y-${i}`} style={[styles.yLab, {top: t.y - 6}]}>
            {t.label}
          </Text>
        ))}
        {layout.xTicks.map((t, i) => (
          <Text
            key={`x-${i}`}
            style={[
              styles.xLab,
              {
                left: Math.min(w - 52, Math.max(4, t.x - 26)),
                top: layout.h - 20,
              },
            ]}>
            {t.label}
          </Text>
        ))}
        {layout.dots.map(s => (
          <React.Fragment key={s.key}>
            {s.pts.map((p, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {left: p.x - 2, top: p.y - 2, backgroundColor: s.color},
                ]}
              />
            ))}
          </React.Fragment>
        ))}
      </View>
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
  canvas: {
    position: 'relative',
  },
  gridH: {
    position: 'absolute',
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  yLab: {
    position: 'absolute',
    left: 2,
    fontSize: 9,
    color: colors.subtext,
    width: 40,
  },
  xLab: {
    position: 'absolute',
    fontSize: 9,
    color: colors.subtext,
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
