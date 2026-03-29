const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootPath = path.resolve(__dirname, '..');

const args = process.argv.slice(2);

const separatorIndex = args.indexOf('--');
let commandType, projectName;

if (separatorIndex !== -1) {
	commandType = args[0];
	projectName = args[separatorIndex + 1];
} else {
	commandType = args[0];
	projectName = args[1];
}

if (!commandType || !['dev', 'build', 'com'].includes(commandType)) {
	console.error('错误: 命令类型必须是 dev, build 或 com');
	console.error('用法: node scripts/run-script.js <命令类型> [--] <项目名>');
	process.exit(1);
}

function scanProjects() {
	const appsPath = path.join(rootPath, 'packages', 'apps');
	const projectPaths = [];

	function recursiveScan(dir, relativePath = '') {
		if (!fs.existsSync(dir)) {
			return;
		}

		const items = fs.readdirSync(dir);
		for (const item of items) {
			const itemPath = path.join(dir, item);
			const stats = fs.statSync(itemPath);

			if (stats.isDirectory() && item !== 'node_modules') {
				const packageJsonPath = path.join(itemPath, 'package.json');
				if (fs.existsSync(packageJsonPath)) {
					const rDir = path.relative(appsPath, itemPath).replace(/\\/g, '/');
					projectPaths.push(rDir);
				} else {
					const newRelativePath = relativePath ? `${relativePath}/${item}` : item;
					recursiveScan(itemPath, newRelativePath);
				}
				
			}
		}
	}

	recursiveScan(appsPath);
	return projectPaths;
}

const projectPaths = scanProjects();

if (!projectName) {
	if (projectPaths.length === 0) {
		console.error('错误: 没有找到任何项目');
		process.exit(1);
	}

	console.log('请选择要运行的项目:');
	projectPaths.forEach((project, index) => {
		console.log(`${index + 1}. ${project}`);
	});

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('请输入项目编号: ', (answer) => {
		rl.close();
		const selectedIndex = parseInt(answer) - 1;

		if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= projectPaths.length) {
			console.error('错误: 无效的项目编号');
			process.exit(1);
		}

		projectName = projectPaths[selectedIndex];
		runCommand();
	});
} else {
	if (!projectPaths.includes(projectName)) {
		console.error(`错误: 项目 '${projectName}' 不存在`);
		process.exit(1);
	}

	runCommand();
}

function runCommand() {
	const fullCommand = `pnpm --filter ./packages/apps/${projectName} ${commandType}`;

	console.log(`执行命令: ${fullCommand}`);
	console.log('============================================================');

	const child = spawn(fullCommand, {
		stdio: 'inherit',
		shell: true,
	});

	child.on('exit', (code) => {
		process.exit(code);
	});

	child.on('error', (error) => {
		console.error(`\n执行命令时出错: ${error.message}`);
		process.exit(1);
	});
}
