const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');

module.exports = function (eleventyConfig) {
  eleventyConfig.on('afterBuild', () => {
    return esbuild.build({
      entryPoints: ['src/scripts/main.js', 'src/style/styles.scss'],
      bundle: true,
      outdir: '_site/',
      platform: 'browser',
      external: ['/assets/images/*'],
      sourcemap: true,
      watch: false,
      plugins: [
        sassPlugin({
          importMapper: (path) =>
            path.replace(/^@img\//, './src/assets/images/'),
        }),
      ],
    });
  });
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addWatchTarget('./src/style');
  eleventyConfig.addWatchTarget('./src/scripts');
  eleventyConfig.setBrowserSyncConfig({
    port: 5000,
  });
  return {
    dir: {
      input: 'src',
    },
    root: ['_includes'],
  };
};
