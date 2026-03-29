import React, {forwardRef} from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';
import {LABEL_COL_W, DATA_COL_MIN_W} from '../constants/layout';

const PALETTE = ['#FF6A3D', '#2563EB', '#16A34A', '#CA8A04', '#9333EA'];

export const FundNameBar = forwardRef(function FundNameBar(
  {funds, onScroll, scrollEventThrottle = 16},
  ref,
) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.labelCol, {width: LABEL_COL_W}]}>
        <Text style={styles.labelText}>基金名称</Text>
      </View>
      <ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}>
        {funds.map((f, i) => (
          <View key={f.id} style={[styles.col, {minWidth: DATA_COL_MIN_W}]}>
            <View style={[styles.dot, {backgroundColor: PALETTE[i % PALETTE.length]}]} />
            <Text style={styles.name} numberOfLines={2}>
              {f.name}
            </Text>
            <Text style={styles.code}>{f.code}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  labelCol: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  labelText: {fontSize: 12, fontWeight: '600', color: colors.subtext},
  content: {flexDirection: 'row', alignItems: 'stretch', paddingRight: 8},
  col: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 6},
  name: {fontSize: 13, fontWeight: '600', color: colors.text},
  code: {fontSize: 12, color: colors.subtext, marginTop: 4},
});
