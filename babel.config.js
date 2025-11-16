module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          // Disable automatic reanimated plugin since we're using react-native-worklets/plugin
          reanimated: false,
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      // react-native-worklets/plugin must be last
      "react-native-worklets/plugin",
    ],
  };
};
