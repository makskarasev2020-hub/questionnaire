var fs = require('fs');
var pkgPath = 'node_modules/react-native-gesture-handler/package.json';
var pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
delete pkg['react-native'];
delete pkg['codegenConfig'];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('Removed react-native and codegenConfig fields');
console.log('main:', pkg.main);
