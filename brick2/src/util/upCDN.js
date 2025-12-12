const fs = require("fs");
const path = require("path");
const COS = require("cos-nodejs-sdk-v5");
const { COSSECRET } = require("./myCofnig");

const cos = new COS({
	SecretId: COSSECRET.id,
	SecretKey: COSSECRET.key,
});
// 存储同名称
const bucket = "qing-1258827329";
const region = "ap-beijing";
let cosDir = "brick/";
upDir = "dist";

if (process.env?.NODE_ENV === 'test') {
	cosDir = 'testBrick/'
}

let arr = [];
traverseFiles(upDir, (filePath) => {
	arr.push(filePath);
});
setTimeout(async () => {
	await deleteOldFile();
	arr.forEach((item) => {
		uploadFile(item);
	});
}, 300);

// 批量删除文件，先查后删
function deleteOldFile() {
	return new Promise((resolve) => {
		cos.getBucket(
			{
				Bucket: bucket,
				Region: region,
				Prefix: cosDir, //要清理的目录
				Marker: cosDir, //要清理的目录
				MaxKeys: 1000,
			},
			function (listError, listResult) {
				if (listError) return console.log("list error:", listError);
				var objects = listResult.Contents.map(function (item) {
					return { Key: item.Key };
				});
				if (objects.length) {
					cos.deleteMultipleObject(
						{
							Bucket: bucket,
							Region: region,
							Objects: objects,
						},
						function (delError, deleteResult) {
							if (delError) {
								console.log(delError);
							}
							if (deleteResult?.statusCode === 200) {
								console.log("清理原目录成功！");
								resolve();
							}
						}
					);
				} else {
					console.log("目录下无资源，无需删除！");
					resolve();
				}
			}
		);
	});
}

//单个上传文件
async function uploadFile(pathItem) {
	const tem = pathItem.replace(/\\/g, "/")
	cos.putObject(
		{
			Bucket: bucket,
			Region: region,
			Key: `${cosDir}${tem.replace(`${upDir}/`, "")}`, //上传到 存储桶 的路径 *
			StorageClass: "STANDARD",
			Body: fs.createReadStream(pathItem), // 被上传的 文件对象
		},
		function (err, data) {
			if (data?.statusCode === 200) {
				console.log(`上传${pathItem.split("/").pop()}到cdn成功！`);
			}
		}
	);
}

// 递归读取打包后的文件夹，返回文件夹目录
function traverseFiles(folderPath, callback) {
	fs.readdir(folderPath, (err, files) => {
		if (err) throw err;
		// 遍历文件列表
		files.forEach((file) => {
			const filePath = path.join(folderPath, file);
			fs.stat(filePath, (err, stats) => {
				if (err) throw err;
				if (stats.isFile()) {
					callback(filePath);
				} else if (stats.isDirectory()) {
					traverseFiles(filePath, callback);
				}
			});
		});
	});
}
