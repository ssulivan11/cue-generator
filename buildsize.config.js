module.exports = {
  files: [
    {
      path: 'public/build/bundle.js',
      maxSize: '52kB',
      compression: 'gzip'
    },
    {
      path: 'public/build/bundle.css',
      maxSize: '2kB',
      compression: 'gzip'
    }
  ]
};
