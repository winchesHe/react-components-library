import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'no-restricted-syntax': 'off',
    'react-dom/no-missing-button-type': 'off',
    'no-console': 'off',
    'react/no-array-index-key': 'off',
  },
})
