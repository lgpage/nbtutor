// Adapted from https://github.com/angular/angular-cli/issues/5190#issuecomment-286876167
const colors = require('colors/safe');

console.log(colors.cyan('\nRunning pre-build tasks'));

const fs = require('fs');
const path = require('path');
const appVersion = require('./package.json').version;
const buildNumber = process.env.BUILD_NUMBER;

console.log(colors.green(`Current build number is ${colors.yellow(buildNumber)}`));

function getVersion() {
  version = appVersion.split(".");
  if (!!buildNumber) {
    version.pop();
    version.push(buildNumber);
  }

  return version;
}

function writeFile(versionFilePath, src) {
  fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
    if (!!err) { throw err; }
    console.log(`${colors.green('Writing version to ')}${colors.yellow(versionFilePath)}`);
  });
}

function writeAngularVersionFile(version) {
  const versionFilePath = path.join('./src/environments/version.ts');
  const src = `export const version = '${version.join('.')}';
`;

  writeFile(versionFilePath, src);
}

function writePythonVersionFile(version) {
  const versionFilePath = path.join('./nbtutor/version.py');
  const v = [+version[0], +version[1]];
  const v34 = version[2].split('-');

  if (v34.length > 1) {
    v.push(+v34[0], `'${v34[1]}'`)
  } else {
    v.push(+version[2])
  }

  const src = `__version_info__ = (${v.join(', ')})
__version__ = '.'.join(map(str, __version_info__))
`

  writeFile(versionFilePath, src);
}

(async function writeVersion() {
  console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));

  const version = getVersion();
  writePythonVersionFile(version);
  writeAngularVersionFile(version);
})().catch(err => console.log(colors.red(err)));