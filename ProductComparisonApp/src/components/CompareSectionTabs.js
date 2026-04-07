import React from 'react';
import {View, Text, ScrollView, Pressable, StyleSheet} from 'react-native';
import {colors} from '../constants/colors';

/** 参考稿：下划线高亮，无胶囊边框抖动 */
export function CompareSectionTabs({sections, activeIndex, onSelect}) {
  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {sections.map((s, i) => {
          const active = i === activeIndex;
          return (
            <Pressable
              key={s.key}
              onPress={() => onSelect(i)}
              style={styles.tabHit}>
              <Text
                style={[styles.label, active && styles.labelActive]}
                numberOfLines={1}>
                {s.label}
              </Text>
              <View
                style={[styles.underline, active && styles.underlineActive]}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: 8,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tabHit: {
    paddingHorizontal: 10,
    paddingBottom: 8,
    marginRight: 4,
  },
  label: {
    fontSize: 13,
    color: colors.tabInactive,
    fontWeight: '500',
    paddingBottom: 6,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  underline: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: colors.primary,
  },
});
