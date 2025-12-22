const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 项目根目录
const rootPath = path.resolve(__dirname, '..');

// 解析命令行参数
const args = process.argv.slice(2);

// 检查是否有 -- 参数，用于分离命令类型和项目名
const separatorIndex = args.indexOf('--');
let commandType, projectName;

if (separatorIndex !== -1) {
	// 如果有 -- 参数，则使用 -- 前面的作为命令类型，后面的作为项目名
	commandType = args[0];
	projectName = args[separatorIndex + 1];
} else {
	// 否则，第一个参数是命令类型，第二个参数是项目名
	commandType = args[0];
	projectName = args[1];
}

// 验证命令类型
if (!commandType || !['dev', 'build', 'com'].includes(commandType)) {
	console.error('错误: 命令类型必须是 dev, build 或 com');
	console.error('用法: node scripts/run-script.js <命令类型> [--] <项目名>');
	process.exit(1);
}

// 扫描 packages/apps 目录下的所有项目
function scanProjects() {
	const appsPath = path.join(rootPath, 'packages', 'apps');

	if (!fs.existsSync(appsPath)) {
		return [];
	}

	const dirs = fs.readdirSync(appsPath);
	return dirs.filter((dir) => {
		const dirPath = path.join(appsPath, dir);
		return fs.statSync(dirPath).isDirectory();
	});
}

// 获取所有项目
const projects = scanProjects();

// 如果没有提供项目名，则提示用户选择
if (!projectName) {
	if (projects.length === 0) {
		console.error('错误: 没有找到任何项目');
		process.exit(1);
	}

	console.log('请选择要运行的项目:');
	projects.forEach((project, index) => {
		console.log(`${index + 1}. ${project}`);
	});

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('请输入项目编号: ', (answer) => {
		rl.close();
		const selectedIndex = parseInt(answer) - 1;

		if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= projects.length) {
			console.error('错误: 无效的项目编号');
			process.exit(1);
		}

		projectName = projects[selectedIndex];
		runCommand();
	});
} else {
	// 检查项目是否存在
	if (!projects.includes(projectName)) {
		console.error(`错误: 项目 '${projectName}' 不存在`);
		process.exit(1);
	}

	runCommand();
}

// 执行命令
function runCommand() {
	// 构建完整的pnpm命令
	const fullCommand = `pnpm --filter @zxmn/${projectName} ${commandType}`;

	console.log(`执行命令: ${fullCommand}`);
	console.log('============================================================');

	// 使用spawn执行命令，让系统默认处理信号
	const child = spawn(fullCommand, {
		stdio: 'inherit',
		shell: true,
	});

	// 子进程退出时，父进程也退出
	child.on('exit', (code) => {
		process.exit(code);
	});

	// 子进程出错时，父进程也退出
	child.on('error', (error) => {
		console.error(`\n执行命令时出错: ${error.message}`);
		process.exit(1);
	});
}
