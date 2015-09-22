'use strict';

module.exports = {
  entry: ['./index.js'],

  output: {
    filename: 'funpage.js',
    path: './dist'
  },

  cache: true,
  debug: true,
  devtool: '#eval',

  stats: {
    colors: true,
    reasons: true
  }
};

