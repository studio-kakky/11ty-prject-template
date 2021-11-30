module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  extends: ['eslint:recommended', 'prettier'],
};
