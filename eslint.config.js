import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

// 자바스크립트 추천 규칙 + Vue 필수 규칙.
// 포매팅은 도구에 맡기지 않으므로 스타일 규칙은 넣지 않는다.
export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
  },
  {
    // 빌드 설정 파일은 Node 환경에서 실행된다
    files: ['vite.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]
