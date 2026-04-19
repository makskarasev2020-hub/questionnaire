
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  watcher: {
    watchman: {
      enabled: false,
    },
    healthCheck: {
      enabled: false,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
