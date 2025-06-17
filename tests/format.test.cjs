const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function loadFormatModule() {
  const tsPath = path.join(__dirname, '..', 'src', 'utils', 'format.ts');
  const tsCode = fs.readFileSync(tsPath, 'utf8');
  const { outputText } = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const module = { exports: {} };
  const fn = new Function('module', 'exports', outputText);
  fn(module, module.exports);
  return module.exports;
}

const { formatWhatsAppUrl, formatPrice, formatPhoneNumber } = loadFormatModule();

test('formatWhatsAppUrl builds correct URL', () => {
  const url = formatWhatsAppUrl('(123) 456-7890', 'hola mundo');
  assert.strictEqual(url, 'https://wa.me/1234567890?text=hola%20mundo');
});

test('formatPrice outputs currency string', () => {
  const price = formatPrice(1500);
  assert.match(price, /1\.500/);
});

test('formatPhoneNumber formats digits', () => {
  const phone = formatPhoneNumber('1234567890');
  assert.strictEqual(phone, '(123) 456-7890');
});
