var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: [ 'css-loader' ]
      },
      {
        exclude: [/\.(js|jsx|mjs|css)$/, /\.html$/, /\.json$/],
        loader: require.resolve("url-loader"),
        // options: {
        //   name: "static/media/[name].[hash:8].[ext]"
        // }
      }
    ]
  },
  externals: {
    'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  }
};