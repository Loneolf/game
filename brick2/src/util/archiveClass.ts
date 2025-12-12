// 存档抽象类，存档，清除存档，存档还原
// 
export default abstract class ArchiveClass {
	abstract archive(): void;
	abstract clearArchive(): void;
	abstract archiveRestore(): void;
}