const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function loadErrorHandling() {
  const tsPath = path.join(__dirname, '..', 'src', 'utils', 'errorHandling.ts');
  const tsCode = fs.readFileSync(tsPath, 'utf8');
  const { outputText } = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const module = { exports: {} };
  const fn = new Function('module', 'exports', outputText);
  fn(module, module.exports);
  return module.exports;
}

const { withRetry } = loadErrorHandling();

test('withRetry resolves after retries', async () => {
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'ok';
  };
  const result = await withRetry(fn, 3, 10);
  assert.strictEqual(result, 'ok');
  assert.strictEqual(attempts, 3);
});

test('withRetry rejects after max retries', async () => {
  let attempts = 0;
  const fn = async () => {
    attempts++;
    throw new Error('fail');
  };
  await assert.rejects(() => withRetry(fn, 2, 10));
  assert.strictEqual(attempts, 2);
});
