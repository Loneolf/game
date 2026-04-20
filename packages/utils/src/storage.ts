/**
 * 本地存储封装
 */
export const storage = {
	/**
	 * 设置本地存储
	 */
	set(key: string, value: any): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error('Storage set error:', e);
		}
	},

	/**
	 * 获取本地存储
	 */
	get<T = any>(key: string, defaultValue?: T): T {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue as T;
		} catch (e) {
			console.error('Storage get error:', e);
			return defaultValue as T;
		}
	},

	/**
	 * 移除本地存储
	 */
	remove(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.error('Storage remove error:', e);
		}
	},

	/**
	 * 清空本地存储
	 */
	clear(): void {
		try {
			localStorage.clear();
		} catch (e) {
			console.error('Storage clear error:', e);
		}
	},
};