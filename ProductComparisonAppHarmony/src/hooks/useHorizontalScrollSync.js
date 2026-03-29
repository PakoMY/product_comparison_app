import React, {useRef, useCallback, useMemo} from 'react';

/**
 * 多个横向 ScrollView 共用同一 contentOffset.x。
 * 用 ignoreNext[i] 标记「即将由 scrollTo 触发的 onScroll」，避免与同步块不同步的
 * syncing 标志造成来回触发、左右抖动。
 */
export function useHorizontalScrollSync(count) {
  const refs = useMemo(() => Array.from({length: count}, () => React.createRef()), [count]);
  const ignoreNext = useRef(Array.from({length: count}, () => false));
  const ignoreClearTimers = useRef(Array.from({length: count}, () => null));

  const onScrollFrom = useCallback(
    index => e => {
      if (ignoreNext.current[index]) {
        ignoreNext.current[index] = false;
        const t = ignoreClearTimers.current[index];
        if (t != null) {
          clearTimeout(t);
          ignoreClearTimers.current[index] = null;
        }
        return;
      }

      const x = e.nativeEvent.contentOffset.x;
      refs.forEach((r, i) => {
        if (i === index || !r.current?.scrollTo) {
          return;
        }
        ignoreNext.current[i] = true;
        r.current.scrollTo({x, animated: false});
        const prev = ignoreClearTimers.current[i];
        if (prev != null) {
          clearTimeout(prev);
        }
        ignoreClearTimers.current[i] = setTimeout(() => {
          ignoreNext.current[i] = false;
          ignoreClearTimers.current[i] = null;
        }, 120);
      });
    },
    [refs],
  );

  return {refs, onScrollFrom};
}
