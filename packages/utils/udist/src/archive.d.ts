/**
 * 存档抽象类
 * 蛇类、音乐类、分数类、控制类都需要实现存档功能
 */
export declare abstract class ArchiveClass {
    /**
     * 存档当前状态
     */
    archive(): void;
    /**
     * 清除存档
     */
    clearArchive(): void;
    /**
     * 从存档恢复状态
     */
    archiveRestore(): void;
}
