const path = require('node:path');

module.exports = {
  reactNativePath:
    process.env.RNOH_TESTER_ONLY__TARGET_PLATFORM === 'harmony'
      ? path.resolve(__dirname, '../../RNOH/ohos_react_native/packages/react-native-harmony')
      : undefined,
  project: {
    ios: {},
    android: {},
  },
};
