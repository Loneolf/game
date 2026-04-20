// 引入必要的 Node.js 模块
import { spawn } from "child_process"; // 用于创建子进程执行命令
import fs from "fs"; // 文件系统操作
import path from "path"; // 路径处理
import readline from "readline"; // 命令行交互（用于用户输入）
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取项目根目录路径（当前文件的上一级目录）
const rootPath = path.resolve(__dirname, "..");

// 获取命令行参数（去掉前两个默认参数：node 和脚本路径）
const args = process.argv.slice(2);

// 查找 '--' 分隔符的位置
// 格式：node script.js <命令类型> [--] <项目名>
// '--' 用于明确分隔命令类型和项目名，避免项目名被误解析
const separatorIndex = args.indexOf("--");
let commandType, projectName;

if (separatorIndex !== -1) {
	// 如果存在 '--'，命令类型是第一个参数，项目名是 '--' 后面的参数
	commandType = args[0];
	projectName = args[separatorIndex + 1];
} else {
	// 如果没有 '--'，则第一个参数是命令类型，第二个参数是项目名
	commandType = args[0];
	projectName = args[1];
}

// 验证命令类型是否合法
if (!commandType || !["dev", "build", "com"].includes(commandType)) {
	console.error("错误: 命令类型必须是 dev, build 或 com");
	console.error("用法: node scripts/run-script.js <命令类型> [--] <项目名>");
	process.exit(1);
}

/**
 * 扫描 packages/apps 目录下的所有项目
 * 递归查找包含 package.json 文件的目录，这些目录被视为项目
 * @returns {string[]} 项目路径数组（相对于 packages/apps 的路径）
 */
function scanProjects() {
	const appsPath = path.join(rootPath, "packages", "apps");
	const projectPaths = [];

	/**
	 * 递归扫描目录
	 * @param {string} dir - 当前要扫描的目录
	 * @param {string} relativePath - 相对于 appsPath 的路径
	 */
	function recursiveScan(dir, relativePath = "") {
		// 如果目录不存在，直接返回
		if (!fs.existsSync(dir)) {
			return;
		}

		// 读取目录中的所有文件和子目录
		const items = fs.readdirSync(dir);
		for (const item of items) {
			const itemPath = path.join(dir, item);
			const stats = fs.statSync(itemPath);

			// 只处理目录，忽略 node_modules
			if (stats.isDirectory() && item !== "node_modules") {
				const packageJsonPath = path.join(itemPath, "package.json");

				// 如果存在 package.json，则这是一个项目
				if (fs.existsSync(packageJsonPath)) {
					// 将 Windows 路径反斜杠转换为正斜杠，保持跨平台一致性
					const rDir = path
						.relative(appsPath, itemPath)
						.replace(/\\/g, "/");
					projectPaths.push(rDir);
				} else {
					// 如果没有 package.json，继续递归扫描子目录
					const newRelativePath = relativePath
						? `${relativePath}/${item}`
						: item;
					recursiveScan(itemPath, newRelativePath);
				}
			}
		}
	}

	// 开始扫描
	recursiveScan(appsPath);
	return projectPaths;
}

// 获取所有项目的路径列表
const projectPaths = scanProjects();

// 调试输出：显示扫描到的所有项目
console.log(projectPaths);

// 如果没有提供项目名，需要交互式选择
if (!projectName) {
	// 检查是否找到了任何项目
	if (projectPaths.length === 0) {
		console.error("错误: 没有找到任何项目");
		process.exit(1);
	}

	// 显示项目列表供用户选择
	console.log("请选择要运行的项目:");
	projectPaths.forEach((project, index) => {
		console.log(`${index + 1}. ${project}`);
	});

	// 创建命令行交互接口，等待用户输入
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	// 询问用户输入项目编号
	rl.question("请输入项目编号: ", (answer) => {
		rl.close();
		const selectedIndex = parseInt(answer) - 1;

		// 验证输入的项目编号是否有效
		if (
			isNaN(selectedIndex) ||
			selectedIndex < 0 ||
			selectedIndex >= projectPaths.length
		) {
			console.error("错误: 无效的项目编号");
			process.exit(1);
		}

		// 获取选中的项目名
		projectName = projectPaths[selectedIndex];
		// 执行命令
		runCommand();
	});
} else {
	// 如果提供了项目名，验证项目是否存在
	if (!projectPaths.includes(projectName)) {
		console.error(`错误: 项目 '${projectName}' 不存在`);
		process.exit(1);
	}

	// 执行命令
	runCommand();
}

/**
 * 执行 pnpm 命令来运行指定的项目
 * 使用 pnpm 的 filter 功能来指定工作空间中的具体项目
 */
function runCommand() {
	// 构建完整的 pnpm 命令
	// 格式：pnpm --filter ./packages/apps/<项目路径> <命令类型>
	const fullCommand = `pnpm --filter ./packages/apps/${projectName} ${commandType}`;

	// 输出即将执行的命令，便于用户确认
	console.log(`执行命令: ${fullCommand}`);
	console.log("============================================================");

	// 创建子进程执行命令
	// spawn 用于执行外部命令
	// shell: true 表示在 shell 中执行，这样可以处理复杂命令
	// stdio: 'inherit' 表示将子进程的标准输入/输出/错误流继承父进程
	const child = spawn(fullCommand, {
		stdio: "inherit",
		shell: true,
	});

	// 监听子进程退出事件
	child.on("exit", (code) => {
		// 使用子进程的退出码退出父进程，保持一致的退出状态
		process.exit(code);
	});

	// 监听子进程错误事件
	child.on("error", (error) => {
		console.error(`\n执行命令时出错: ${error.message}`);
		process.exit(1);
	});
}
