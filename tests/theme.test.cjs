const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const Module = require('module');

function loadThemeModule() {
  const tsPath = path.join(__dirname, '..', 'src', 'config', 'theme.ts');
  const tsCode = fs.readFileSync(tsPath, 'utf8');
  const { outputText } = ts.transpileModule(tsCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const module = { exports: {} };
  const baseRequire = Module.createRequire(tsPath);
  const customRequire = (id) => {
    if (id === '../utils/logger' || id === './logger' || id.endsWith('/utils/logger')) {
      return { logger: { debug() {}, info() {}, warn() {}, error() {} } };
    }
    return baseRequire(id);
  };
  const fn = new Function('require', 'module', 'exports', outputText);
  fn(customRequire, module, module.exports);
  return module.exports;
}

function createMockDocument() {
  const elements = new Map();
  const head = {
    children: [],
    appendChild(el) {
      this.children.push(el);
      if (el.id) elements.set(el.id, el);
      el.parentNode = this;
    }
  };
  return {
    documentElement: {
      style: {
        props: {},
        setProperty(key, value) {
          this.props[key] = value;
        }
      }
    },
    head,
    getElementById(id) {
      return elements.get(id) || null;
    },
    createElement(tag) {
      return {
        id: '',
        tagName: tag.toUpperCase(),
        textContent: '',
        remove() {
          if (this.parentNode) {
            const idx = this.parentNode.children.indexOf(this);
            if (idx >= 0) this.parentNode.children.splice(idx, 1);
          }
          if (this.id) elements.delete(this.id);
        }
      };
    }
  };
}

const { applyThemeFromJson } = loadThemeModule();

test('clears dark theme styles when dark rules are absent', () => {
  const doc = createMockDocument();
  global.document = doc;

  const style = doc.createElement('style');
  style.id = 'theme-dark-vars';
  style.textContent = 'old';
  doc.head.appendChild(style);

  applyThemeFromJson({});

  const found = doc.getElementById('theme-dark-vars');
  assert.strictEqual(found, null);
});
