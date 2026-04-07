import React from 'react';
import {View, Text, FlatList, Pressable, StyleSheet, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FundRow} from '../components/FundRow';
import {useFundStore} from '../store/useFundStore';
import {colors} from '../constants/colors';

export function FundListScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const funds = useFundStore(s => s.funds);
  const selectedIds = useFundStore(s => s.selectedIds);
  const toggleSelect = useFundStore(s => s.toggleSelect);

  const onToggle = id => {
    const r = toggleSelect(id);
    if (!r.ok && r.reason === 'over_limit') {
      Alert.alert('提示', '最多同时对比 5 只基金');
    }
  };

  const onCompare = () => {
    if (selectedIds.length < 2) {
      Alert.alert('提示', '请至少选择 2 只基金进行对比');
      return;
    }
    navigation.navigate('Compare');
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={funds}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View style={styles.headerSpacer} />}
        renderItem={({item}) => (
          <FundRow
            fund={item}
            selected={selectedIds.includes(item.id)}
            onToggle={onToggle}
          />
        )}
      />
      <View style={[styles.bar, {paddingBottom: Math.max(insets.bottom, 12)}]}>
        <Text style={styles.count}>已选 {selectedIds.length} / 5</Text>
        <Pressable
          onPress={onCompare}
          style={({pressed}) => [styles.btn, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>开始对比</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg},
  list: {paddingTop: 4, paddingBottom: 100},
  headerSpacer: {height: 4},
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  count: {fontSize: 15, fontWeight: '600', color: colors.text},
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnPressed: {opacity: 0.9},
  btnText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});
