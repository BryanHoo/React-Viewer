# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## 工具函数：字符串函数编译器

提供 `compileFunctionFromString` 将字符串形式的函数转换为真实的可调用函数，支持函数表达式/函数体、上下文注入、this 绑定与缓存。

使用示例：

```ts
import { compileFunctionFromString } from './src/utils';

// 表达式模式（自动检测）
const add = compileFunctionFromString<(a: number, b: number) => number>('(a,b)=>a+b');
add(1, 2); // 3

// 函数体模式（需提供参数名）
const bodyAdd = compileFunctionFromString<(a: number, b: number) => number>('return a + b;', {
  mode: 'body',
  argNames: ['a', 'b'],
});

// 上下文注入
const withCtx = compileFunctionFromString<(x: number) => number>('(x) => x + y', {
  context: { y: 10 },
});
withCtx(5); // 15

// this 绑定
const sumWithBase = compileFunctionFromString<(...args: number[]) => number>(
  'function(...ns){ return ns.reduce((s,n)=>s+n, this.base) }',
  { bindThis: { base: 100 } },
);
sumWithBase(1, 2, 3); // 106
```

安全说明：内部使用 `Function` 构造器，默认拦截 `import`、`require` 关键字，仍仅建议用于可信来源配置字符串。
