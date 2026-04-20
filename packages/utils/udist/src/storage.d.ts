/**
 * 本地存储封装
 */
export declare const storage: {
    /**
     * 设置本地存储
     */
    set(key: string, value: any): void;
    /**
     * 获取本地存储
     */
    get<T = any>(key: string, defaultValue?: T): T;
    /**
     * 移除本地存储
     */
    remove(key: string): void;
    /**
     * 清空本地存储
     */
    clear(): void;
};
