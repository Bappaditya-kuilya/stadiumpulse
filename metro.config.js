const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  "react-native-bare-kit": require.resolve("./__mocks__/react-native-bare-kit.js"),
};

module.exports = config;
