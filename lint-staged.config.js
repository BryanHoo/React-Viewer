export default {
  // Typecheck staged TS/TSX without appending filenames
  '**/*.{ts,tsx}': [() => 'tsc --noEmit'],
  // Lint and format code files
  '**/*.{ts,tsx,js,jsx}': ['eslint --fix --no-warn-ignored', 'prettier --write'],
  // Format other supported files
  '!(*.{ts,tsx,js,jsx})': 'prettier --ignore-unknown --write',
};
