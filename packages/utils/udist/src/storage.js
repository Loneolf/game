/**
 * 本地存储封装
 */
export const storage = {
    /**
     * 设置本地存储
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (e) {
            console.error('Storage set error:', e);
        }
    },
    /**
     * 获取本地存储
     */
    get(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    },
    /**
     * 移除本地存储
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (e) {
            console.error('Storage remove error:', e);
        }
    },
    /**
     * 清空本地存储
     */
    clear() {
        try {
            localStorage.clear();
        }
        catch (e) {
            console.error('Storage clear error:', e);
        }
    },
};
