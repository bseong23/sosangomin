import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
{ ignores: ['dist'] },
{
extends: [js.configs.recommended, ...tseslint.configs.recommended],
// 타입스크립트 파일만 허용
files: ['/*.{ts,tsx}'],
languageOptions: {
ecmaVersion: 2020,
globals: globals.browser,
},
plugins: {
'react-hooks': reactHooks,
'react-refresh': reactRefresh,
},
rules: {
...reactHooks.configs.recommended.rules,
'react-refresh/only-export-components': [
'warn',
{ allowConstantExport: true },
],
},
},
// 자바스크립트 파일 사용 시 오류 발생시키기
{
files: ['/*.{js,jsx}'],
rules: {
// 자바스크립트 파일 사용 시 오류 발생
'@typescript-eslint/ban-ts-comment': 'error',
// 모든 규칙을 오류로 설정하여 자바스크립트 파일 사용 방지
'no-restricted-syntax': [
'error',
{
selector: 'Program',
message: 'JavaScript files are not allowed in this project. Please use TypeScript (.ts or .tsx) files instead.'
}
]
}
}
)