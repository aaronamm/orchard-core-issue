// This webpack is only for build Sass to CSS

const outputFileName = 'orchard-example-module';

const files = [
  {
    name: 'OrchardExampleModule',
    entry: './src/index',
    output: `wwwroot/scripts/${outputFileName}`,
  },
];

const entry = files.reduce((obj, f) => {
  if (f.name in obj) {
    throw new Error('The name property for each file entry must be unique.');
  }

  obj[f.name] = f.entry;
  return obj;
}, {});

const getOutputFile = (extension) => (pathData, assetInfo) => {
  const name = pathData.chunk.name;
  return `${files.find(f => f.name === name).output}.${extension}`;
};

module.exports = (env, argv) => {
  return {
    entry,
    output: {
      globalObject: "this",
      path: __dirname,
      filename: getOutputFile('js'),

      library: {
        name: '[name]',
        type: 'var',
        export: 'default',
      },
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css']
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                rootMode: 'upward'
              },
            },
          ],
        },
      ]
    },
    plugins: [],
    externals: {},
    devtool: argv.mode === 'production' ? false : 'inline-source-map',
  };
};
