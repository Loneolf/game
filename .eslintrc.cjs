module.exports = {
	root: true,
	env: {
		browser: true, // 启用浏览器全局变量（window, document, console, setTimeout等）
		node: true, // 启用Node.js全局变量（process, __dirname等）
		es6: true, // 启用ES6全局变量（Promise, Set, Map等）
		es2020: true, // 启用ES2020全局变量
	},
	globals: {
		vConsole: 'readonly',
		process: 'readonly',
		window: 'writable',
		document: 'readonly',
		ENV: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		requireConfigFile: false,
	},
	plugins: ['import', '@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:import/recommended'
	],
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		quotes: ['warn', 'single'],
		semi: ['error', 'always'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-unused-expressions': 'off',
		'no-case-declarations': 'off',
		'import/no-unresolved': ['error', { ignore: ['^@/', '^@u/', '^@c/', '^@s/', '^@sa/', '^@st/', '^@p/'] }],
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
				],
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
						position: 'before'
					},
					{
						pattern: '@[a-z]/**',
						group: 'internal',
						position: 'before'
					}
				],
				pathGroupsExcludedImportTypes: ['builtin'],
				alphabetize: { order: 'asc', caseInsensitive: true },
			},
		],
	},
	settings: {
		'import/resolver': {
			alias: {
				map: [
					['@/', './src/'],
					['@u/', './src/util/'],
					['@c/', './src/commponet'],
					['@sa/', './src/assets/'],
				],
				extensions: ['.js', '.json', '.ts'],
			},
			node: {
				moduleDirectory: ['node_modules', '.', 'src'],
				extensions: ['.js', '.json', '.ts'],
			},
		},
		'import/internal-regex': '^@[/]',
	},
	overrides: [
		{
			files: ['packages/apps/**/**/*.{js,ts}'],
		},
	],
	ignorePatterns: [
		'node_modules/',
		'dist/',
		'build/',
		'public/',
		'.husky/',
		'.git/',
		'*.min.js',
		'*.bundle.js',
		'pnpm-lock.yaml',
		'packages/*/node_modules/',
		'packages/*/dist/',
		'packages/*/build/',
		'.eslintrc.cjs',
	],
};
