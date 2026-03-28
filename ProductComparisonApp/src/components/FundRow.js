import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';
import {formatSignedPercent} from '../utils/format';

export function FundRow({fund, selected, onToggle}) {
  const p = fund.performance;
  return (
    <Pressable
      onPress={() => onToggle(fund.id)}
      style={({pressed}) => [styles.row, pressed && styles.pressed, selected && styles.rowSelected]}>
      <View style={[styles.check, selected && styles.checkOn]}>
        {selected ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {fund.name}
        </Text>
        <Text style={styles.meta}>
          {fund.code} · {fund.type}
        </Text>
        <Text style={styles.year1}>近1年收益 {formatSignedPercent(p.year1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8F5',
  },
  pressed: {opacity: 0.92},
  check: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkMark: {color: '#fff', fontSize: 14, fontWeight: '700'},
  body: {flex: 1, minWidth: 0},
  name: {fontSize: 16, fontWeight: '600', color: colors.text},
  meta: {fontSize: 12, color: colors.subtext, marginTop: 4},
  year1: {fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 8},
});
