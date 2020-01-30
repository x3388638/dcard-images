module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: __dirname,
    filename: 'index.user.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                'minify',
                {
                  builtIns: false,
                  evaluate: false,
                  mangle: false
                }
              ]
            ],
            comments: false
          }
        }
      }
    ]
  }
}
