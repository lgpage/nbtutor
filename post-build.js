const colors = require('colors/safe');

console.log(colors.cyan('\nRunning post-build tasks'));

const concat = require('concat');
const fs = require('fs-extra');

(async function build() {
  const files = [
    './dist/nbtutor/runtime.js',
    './dist/nbtutor/polyfills.js',
    './dist/nbtutor/main.js',
  ];

  await fs.ensureDir('./nbtutor/static');
  await fs.copyFile('./dist/nbtutor/styles.css', './nbtutor/static/nbtutor.min.css');
  await concat(files, './nbtutor/static/nbtutor.min.js');

  console.log(colors.green(`nbtutor files bundled to ${colors.yellow('./nbtutor/static')}`))
})().catch(err => console.log(colors.red(err)));
