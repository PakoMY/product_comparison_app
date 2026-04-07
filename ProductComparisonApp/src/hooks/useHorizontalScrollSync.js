import React, {useRef, useCallback, useMemo} from 'react';

/**
 * 多个横向 ScrollView 共用同一 contentOffset.x
 * @param {number} count 参与联动的横向滚动区域数量（含名称栏）
 */
export function useHorizontalScrollSync(count) {
  const refs = useMemo(
    () => Array.from({length: count}, () => React.createRef()),
    [count],
  );
  const syncing = useRef(false);

  const onScrollFrom = useCallback(
    index => e => {
      if (syncing.current) {
        return;
      }
      const x = e.nativeEvent.contentOffset.x;
      syncing.current = true;
      refs.forEach((r, i) => {
        if (i !== index && r.current?.scrollTo) {
          r.current.scrollTo({x, animated: false});
        }
      });
      syncing.current = false;
    },
    [refs],
  );

  return {refs, onScrollFrom};
}
