const { webpack } = require("webpack-stream"); // Webpack 読み込み
const path = require("path");

module.exports = (env = "dev") => {
  return {
    target: ["web", "es5"], // Webpack 5 からの ES5 ( IE11 等 ) 向け設定
    mode: "production",
    devtool: "inline-source-map",
    resolve: {
      extensions: [".js"], // require する際に、拡張子を省略するための設定
    },
    entry: "./src/assets/js/script.js",
    output: {
      path: path.resolve(__dirname, "dist/assets/js/"),
      filename: "script.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              options: {
                presets: ["@babel/preset-env"],
                plugins: [
                  ["@babel/plugin-transform-classes", { loose: true }], // ES6 を ES5 に変換
                ],
                cacheDirectory: true,
              },
            },
          ],
          exclude: /node_module/,
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify({ env }),
      }),
    ],
  };
};
