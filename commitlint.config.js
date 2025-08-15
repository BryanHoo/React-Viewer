/**
 * Commitlint configuration aligned with `.cursor/rules/git-message.mdc`.
 * - 允许类型：feat, fix, docs, style, refactor, perf, test, chore
 * - 主题（subject）不超过 50 字符
 * - 主题禁止以句号（包含中文句号）结尾
 * - 主题需包含至少一个中文字符（满足“使用中文”）
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'],
    ],
    'subject-max-length': [2, 'always', 50],
    'subject-has-chinese': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'subject-has-chinese': ({ subject = '' }) => {
          const hasChinese = /[\u4e00-\u9fa5]/.test(subject);
          return [hasChinese, 'subject 必须包含至少一个中文字符'];
        },
      },
    },
  ],
};
