import {Dimensions} from 'react-native';

/**
 * RNOH tester 未链接 RNCSafeAreaProvider 时，用 JS 提供 insets/frame，
 * 供 @react-navigation 的 Header（useSafeAreaInsets + useSafeAreaFrame）消费。
 */
export const FALLBACK_SAFE_INSETS = {
  top: 44,
  bottom: 28,
  left: 0,
  right: 0,
};

const {width, height} = Dimensions.get('window');
export const FALLBACK_SAFE_AREA_FRAME = {
  x: 0,
  y: 0,
  width,
  height,
};
