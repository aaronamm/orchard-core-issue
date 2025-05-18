// READ MORE
// https://dev.to/mbarzeev/how-to-configure-babel-for-your-monorepo-j3c
// https://github.com/babel/babel/issues/8309#issuecomment-523325222

module.exports = (api) => {
  api.cache(false); // set cache as true/false

  return {
    presets: [
      '@babel/env',
      '@babel/typescript',
    ],
    plugins: [
    ]
  };
};
