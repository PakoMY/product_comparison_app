const {mergeConfig, getDefaultConfig} = require('@react-native/metro-config');
const {
  createHarmonyMetroConfig,
} = require('@react-native-oh/react-native-harmony/metro.config');
const pathUtils = require('node:path');

const projectRoot = __dirname;
const monorepoRoot = pathUtils.resolve(projectRoot, '../../RNOH/ohos_react_native');
const projectNodeModules = pathUtils.resolve(projectRoot, 'node_modules');

const harmonyMetro = createHarmonyMetroConfig({
  reactNativeHarmonyPackageName: '@react-native-oh/react-native-harmony',
  __reactNativeHarmonyPattern:
    pathUtils.sep + 'react-native-harmony' + pathUtils.sep,
});

/** Default + Harmony (must keep Harmony's resolveRequest — it maps react-native → @react-native-oh/react-native-harmony). */
const base = mergeConfig(
  getDefaultConfig(__dirname),
  harmonyMetro,
  {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    watchFolders: [monorepoRoot],
    resolver: {
      nodeModulesPaths: [
        projectNodeModules,
        pathUtils.resolve(monorepoRoot, 'node_modules'),
      ],
    },
    server: {
      rewriteRequestUrl: url => {
        return url.replace(
          '/react-native-harmony',
          '/assets/../react-native-harmony',
        );
      },
    },
  },
);

const harmonyResolveRequest = base.resolver.resolveRequest;

/**
 * Wrap Harmony resolver: only pin react/scheduler to this app (fixes duplicate React / useContext),
 * never override react-native — that breaks Platform and native init on Harmony.
 */
module.exports = mergeConfig(base, {
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      const fromApp = mod => {
        try {
          return {
            type: 'sourceFile',
            filePath: require.resolve(mod, {paths: [projectRoot]}),
          };
        } catch {
          return undefined;
        }
      };
      if (moduleName === 'react' || moduleName.startsWith('react/')) {
        const r = fromApp(moduleName);
        if (r) {
          return r;
        }
      }
      if (moduleName === 'scheduler' || moduleName.startsWith('scheduler/')) {
        const r = fromApp(moduleName);
        if (r) {
          return r;
        }
      }
      if (
        moduleName === 'react-native-safe-area-context' ||
        moduleName.startsWith('react-native-safe-area-context/')
      ) {
        const r = fromApp(moduleName);
        if (r) {
          return r;
        }
      }
      return harmonyResolveRequest(context, moduleName, platform);
    },
  },
});
