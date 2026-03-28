const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
/**
 * Android dev requests bundles with lazy=true (same flag as dev). Lazy graphs
 * can race with native DevSupport calling HMRClient.setup before callable modules
 * are registered — red screen: "HMRClient.setup" / only AppRegistry registered.
 * Force eager bundles in dev to avoid that race.
 */
const config = {
  server: {
    rewriteRequestUrl: url => {
      if (url.includes('lazy=true')) {
        return url.replace(/lazy=true/g, 'lazy=false');
      }
      return url;
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
