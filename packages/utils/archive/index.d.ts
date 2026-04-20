/**
 * 存档抽象类
 * 蛇类、音乐类、分数类、控制类都需要实现存档功能
 */
export declare abstract class ArchiveClass {
	abstract archive(): void;
	abstract clearArchive(): void;
	abstract archiveRestore(): void;
}