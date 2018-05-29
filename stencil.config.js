const sass = require('@stencil/sass');

exports.config = {
  namespace: 'cookie-pocket',
  outputTargets:[
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: false,
    }
  ],
  plugins: [sass()],
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**',
};
