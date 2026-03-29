# 基金对比（HarmonyOS / RNOH）

本目录为 **React Native** 业务工程，通过 **React Native OpenHarmony（RNOH）** 在鸿蒙设备或模拟器上运行。应用逻辑、界面与数据均在 JS 侧实现；**鸿蒙原生工程、RN 鸿蒙适配层与构建链路不在本仓库中**，需要单独获取官方模板与依赖。

## 为什么需要自行下载并配置 RNOH？

- **RNOH 是一套完整的 RN 鸿蒙适配仓库**（含 `react-native-harmony`、`harmony-cli`、示例与 tester 工程等），体积大、迭代快，通常不作为业务仓库的子模块提交。
- **版本必须对齐**：鸿蒙侧 ArkTS、C++、JS 引擎与 Metro 打出的 bundle 需与固定版本的 `@react-native-oh/react-native-harmony` 一致；官方仓库是这一组合的**唯一可信来源**。
- **本项目的 `package.json` 已通过本地路径引用 RNOH 包**（例如 `file:../../RNOH/ohos_react_native/packages/react-native-harmony`）。未克隆 RNOH 时 `npm install` 会失败，也无法执行鸿蒙打包脚本。

因此：**请从官方仓库自行克隆、按文档完成环境配置**，再在本目录安装依赖与打包。

## 获取与配置 RNOH

1. 克隆 OpenHarmony RN 官方仓库（含文档与示例）：

   [https://gitcode.com/OpenHarmony-RN/ohos_react_native](https://gitcode.com/OpenHarmony-RN/ohos_react_native)

2. 按仓库内说明安装 **Node、DevEco Studio、Harmony SDK** 等，并在 RNOH 工程根目录执行依赖安装（如 `pnpm install` / `npm install`，以官方文档为准）。

3. **目录建议**（与当前 `package.json` 中的相对路径一致）：

   ```text
   <你的工作区>/
     RNOH/ohos_react_native/          ← 克隆的官方仓库根目录
     product_comparison_app/
       ProductComparisonAppHarmony/   ← 本工程
   ```

   若你把 `ohos_react_native` 放在其他位置，需同步修改本目录下 `package.json`（及 `metro.config.js` 里如有）中的 `file:` 路径。

## 在本工程中常用命令

- 安装依赖：`npm install`（需已满足上述 RNOH 路径）。
- 将 JS 打进 **RNOH tester** 工程自带的 `rawfile`（便于真机/模拟器离线加载）：

  ```bash
  npm run bundle:harmony:rnohtester
  ```

  输出目录一般为：`../../RNOH/ohos_react_native/packages/tester/harmony/entry/src/main/resources/rawfile/`。

- 使用 **DevEco Studio** 打开 **`ohos_react_native/packages/tester/harmony`**，编译并安装生成的 **`.hap`**（具体以官方文档与当前工程名为准）。

更完整的初始化、调试与排错步骤，请以 **RNOH 官方仓库文档**为准。
