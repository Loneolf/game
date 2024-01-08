// 存档抽象类，存档，清除存档，存档还原
// 蛇类，音乐类，分数类，控制类，都需要进行存档的的实现
export default abstract class ArchiveClass {
	abstract archive(): void;
	abstract clearArchive(): void;
	abstract archiveRestore(): void;
}