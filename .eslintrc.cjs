// 根目录ESLint配置文件 - ESLint 8版本兼容配置
module.exports = {
	// 确保配置在整个monorepo中生效
	root: true,
	env: {
		browser: true, // 启用浏览器全局变量（window, document, console, setTimeout等）
		node: true, // 启用Node.js全局变量（process, __dirname等）
		es6: true, // 启用ES6全局变量（Promise, Set, Map等）
		es2020: true, // 启用ES2020全局变量
	},
	globals: {
		Vue: true,
		vConsole: 'readonly',
		process: 'readonly',
		window: 'writable',
		document: 'readonly',
	},
	// 解析器配置 - ESLint 8兼容版本
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
		requireConfigFile: false,
	},
	// 插件配置
	plugins: ['import', 'vue'],
	// 继承推荐规则 - ESLint 8标准格式
	extends: [
		'eslint:recommended',
		'plugin:vue/essential',
		// 添加 import 插件推荐配置
		'plugin:import/recommended'
	],
	// 规则配置
	rules: {
		// ESLint 8标准规则
		'vue/multi-word-component-names': 'off',
		indent: ['error', 'tab', { SwitchCase: 1 }],
		// 'linebreak-style': ['error', 'unix'],
		quotes: ['warn', 'single'],
		semi: ['error', 'always'],
		'no-unused-vars': 'error',
		'import/no-unresolved': ['error', { ignore: ['^@/', '^@u/', '^@c/', '^@s/', '^@sa/', '^@st/', '^@p/'] }],
		// 导入顺序规则 - ESLint 8兼容格式
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
						pattern: '@/**',        // 匹配 @/xxx 路径
						group: 'internal',      // 归为 internal 分组
						position: 'before'      // 在 internal 分组的最前面
					},
					{
						pattern: '@[a-z]/**',   // 匹配 @c/、@u/ 等短别名
						group: 'internal',
						position: 'before'
					}
				],
				// 确保 pathGroups 优先于默认分组匹配
				pathGroupsExcludedImportTypes: ['builtin'],
				// 'newlines-between': 'always', // 要求在不同组之间插入空行
				alphabetize: { order: 'asc', caseInsensitive: true },
			},
		],
	},
	// 路径别名解析配置 - ESLint 8兼容格式
	settings: {
		'import/resolver': {
			// 配置路径别名
			alias: {
				map: [
					// 简化别名配置，去除重复和冲突
					['@/', './src/'],
					['@u/', './src/util/'],
					['@c/', './src/components/'],
					['@s/', './src/serve/'],
					['@sa/', './src/assets/'],
					['@st/', './src/store/'],
					['@p/', './src/pages/'], // 统一使用 pages
				],
				extensions: ['.js', '.vue', '.json'],
			},
			node: {
				moduleDirectory: ['node_modules', '.', 'src'],
				extensions: ['.js', '.vue', '.json'],
			},
		},
		vue: {
			version: '2.7',
		},
		// 添加 import 配置
		'import/internal-regex': '^@[/]',
	},
	// 针对子项目的配置覆盖 - ESLint 8标准格式
	overrides: [
		{
			// 为子项目设置特定配置
			files: ['packages/apps/**/**/*.{js,vue}'],
			env: {
				// 可以为子项目设置特定环境
			},
		},
	],
	ignorePatterns: [
    	// 全局忽略
		'node_modules/',
		'dist/',
		'build/',
		'public/',
		'.husky/',
		'.git/',
		'*.min.js',
		'*.bundle.js',
		'pnpm-lock.yaml',
		// monorepo 子包忽略
		'packages/*/node_modules/',
		'packages/*/dist/',
		'packages/*/build/',
		// 配置文件忽略
		'.eslintrc.cjs',

	],
};
