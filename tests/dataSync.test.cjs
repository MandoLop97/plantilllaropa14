const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const Module = require('module');

function loadDataSync() {
  const tsPath = path.join(__dirname, '..', 'src', 'utils', 'dataSync.ts');
  const tsCode = fs.readFileSync(tsPath, 'utf8');
  const { outputText } = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const module = { exports: {} };
  const baseRequire = Module.createRequire(tsPath);
  const customRequire = (id) => {
    if (id === './logger' || id.endsWith('/utils/logger')) {
      return { logger: { info() {}, error() {} } };
    }
    return baseRequire(id);
  };
  const fn = new Function('require', 'module', 'exports', outputText);
  fn(customRequire, module, module.exports);
  return module.exports;
}

const { DataSync } = loadDataSync();

test('syncData marks progress and resolves', async () => {
  const ds = new DataSync();
  assert.strictEqual(ds.isInProgress(), false);
  const promise = ds.syncData('a','b');
  assert.strictEqual(ds.isInProgress(), true);
  const result = await promise;
  assert.ok(result.success);
  assert.strictEqual(ds.isInProgress(), false);
});

test('syncData prevents concurrent runs', async () => {
  const ds = new DataSync();
  ds.syncData('a','b');
  const result = await ds.syncData('x','y');
  assert.strictEqual(result.success, false);
  assert.match(result.message, /already/);
});
