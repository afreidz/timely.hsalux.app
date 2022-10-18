module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,icns,ico,png,html}'
  ],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};