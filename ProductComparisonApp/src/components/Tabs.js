import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';

/** 收益走势周期切换（参考稿：选中为实心主色底、白字） */
export function Tabs({options, value, onChange}) {
  return (
    <View style={styles.wrap}>
      {options.map(opt => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.tab, active && styles.tabActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#FFE0D4',
    marginRight: 8,
    marginBottom: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {fontSize: 13, color: colors.primary, fontWeight: '500'},
  labelActive: {color: '#FFFFFF', fontWeight: '600'},
});
