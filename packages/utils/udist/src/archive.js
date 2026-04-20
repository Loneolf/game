/**
 * 存档抽象类
 * 蛇类、音乐类、分数类、控制类都需要实现存档功能
 */
export class ArchiveClass {
    /**
     * 存档当前状态
     */
    archive() {
        throw new Error("archive method must be implemented");
    }
    /**
     * 清除存档
     */
    clearArchive() {
        throw new Error("clearArchive method must be implemented");
    }
    /**
     * 从存档恢复状态
     */
    archiveRestore() {
        throw new Error("archiveRestore method must be implemented");
    }
}
