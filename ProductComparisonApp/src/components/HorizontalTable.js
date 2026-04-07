import React, {forwardRef} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';
import {LABEL_COL_W, DATA_COL_MIN_W} from '../constants/layout';

export const HorizontalTable = forwardRef(function HorizontalTable(
  {
    title,
    rows,
    columnTitles,
    onScroll,
    scrollEventThrottle = 16,
    /** 为 true 时不展示首行「指标」及表头基金名行（与 FundNameBar 对齐时更简洁） */
    hideMetricHeader = false,
  },
  ref,
) {
  const cols = rows[0]?.values?.length ?? 0;
  const heads =
    columnTitles && columnTitles.length === cols
      ? columnTitles
      : Array.from({length: cols}, (_, j) => `基金 ${j + 1}`);

  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.table}>
        <View style={[styles.labelCol, {width: LABEL_COL_W}]}>
          {!hideMetricHeader ? (
            <View
              style={[
                styles.labelCell,
                styles.borderBottom,
                styles.borderRight,
              ]}>
              <Text style={styles.headerText}>指标</Text>
            </View>
          ) : null}
          {rows.map((row, i) => (
            <View
              key={i}
              style={[
                styles.labelCell,
                styles.borderBottom,
                i === rows.length - 1 && styles.noBottom,
                hideMetricHeader && i === 0 && styles.borderTop,
              ]}>
              <Text style={styles.labelText}>{row.label}</Text>
            </View>
          ))}
        </View>
        <ScrollView
          ref={ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}>
          <View>
            {!hideMetricHeader ? (
              <View style={[styles.dataRow, styles.borderBottom]}>
                {heads.map((h, j) => (
                  <View
                    key={j}
                    style={[styles.headCell, {minWidth: DATA_COL_MIN_W}]}>
                    <Text style={styles.headerText} numberOfLines={2}>
                      {h}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {rows.map((row, i) => (
              <View
                key={i}
                style={[
                  styles.dataRow,
                  styles.borderBottom,
                  i === rows.length - 1 && styles.noBottom,
                  hideMetricHeader && i === 0 && styles.headTopBorder,
                ]}>
                {row.values.map((cell, j) => (
                  <View
                    key={j}
                    style={[styles.cell, {minWidth: DATA_COL_MIN_W}]}>
                    <Text style={styles.cellText}>{cell}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  table: {flexDirection: 'row'},
  labelCol: {backgroundColor: '#FAFAFA'},
  hScroll: {flex: 1},
  dataRow: {flexDirection: 'row'},
  labelCell: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    minHeight: 44,
  },
  borderBottom: {borderBottomWidth: 1, borderBottomColor: colors.border},
  borderRight: {borderRightWidth: 1, borderRightColor: colors.border},
  noBottom: {borderBottomWidth: 0},
  borderTop: {borderTopWidth: 1, borderTopColor: colors.border},
  headTopBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  labelText: {fontSize: 12, color: colors.subtext},
  headerText: {fontSize: 12, fontWeight: '600', color: colors.text},
  headCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
    minHeight: 44,
  },
  cellText: {fontSize: 13, color: colors.text},
});
