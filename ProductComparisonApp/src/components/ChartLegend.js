import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';
import {formatSignedPercent} from '../utils/format';
import {periodReturnFromNav} from '../utils/chartHelper';

/**
 * 收益走势图例：色点 + 名称 + 代码 + 区间收益率（按当前净值序列）
 */
export function ChartLegend({funds, navByFund, period, palette}) {
  return (
    <View style={styles.card}>
      {funds.map((f, i) => {
        const nav = navByFund(f);
        const r = periodReturnFromNav(nav);
        const color = palette[i % palette.length];
        return (
          <View key={f.id} style={styles.row}>
            <View style={[styles.dot, {backgroundColor: color}]} />
            <View style={styles.mid}>
              <Text style={styles.name} numberOfLines={1}>
                {f.name}
              </Text>
              <Text style={styles.code}>{f.code}</Text>
            </View>
            <Text style={styles.ret}>{formatSignedPercent(r)}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {width: 10, height: 10, borderRadius: 5, marginRight: 10},
  mid: {flex: 1, minWidth: 0},
  name: {fontSize: 14, fontWeight: '600', color: colors.text},
  code: {fontSize: 12, color: colors.subtext, marginTop: 2},
  ret: {fontSize: 15, fontWeight: '700', color: colors.red, marginLeft: 8},
});
