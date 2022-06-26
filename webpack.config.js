const webpack = require('webpack');

module.exports = (env = "dev") => {
  return {
    mode: "production",
    entry: "./src/assets/js/script.js",
    output: {
      path: `${__dirname}/dist/assets/js/`,
      filename: "script.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_module/,
          loader: "babel-loader",
        },
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_module/,
          options: {
            fix: true,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify({ env })
      })
    ]
  };
};
