const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  webpack: (config) => {
    const wasmExtensionRegExp = /\.wasm$/;
    config.resolve.extensions.push('.wasm');

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      url: require.resolve("url"),
      buffer: require.resolve('buffer/')
    });
    config.resolve.fallback = fallback;

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };

    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ]);

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === "asset/resource") {
              oneOf.exclude.push(wasmExtensionRegExp);
          }
      });
  });

    return config;
  },
};