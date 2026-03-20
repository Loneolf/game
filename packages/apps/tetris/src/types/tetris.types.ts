/**
 * 俄罗斯方块类型定义
 * 定义游戏中使用的所有接口和类型
 */

/**
 * 方块形状接口
 */
export interface PieceShape {
    /** 方块形状二维数组 */
    shape: number[][];
    /** 方块类型（1-7） */
    type: number;
}

/**
 * 当前活动方块接口
 */
export interface ActivePiece extends PieceShape {
    /** 方块在棋盘上的X坐标 */
    x: number;
    /** 方块在棋盘上的Y坐标 */
    y: number;
}

/**
 * 方块类型定义
 */
export interface PieceType {
    /** 方块形状 */
    shape: number[][];
    /** 方块名称 */
    name: string;
}

/**
 * 游戏状态接口
 */
export interface GameState {
    /** 游戏是否正在进行 */
    isLive: boolean;
    /** 游戏是否暂停 */
    isStop: boolean;
    /** 游戏是否结束 */
    isGameOver: boolean;
}

/**
 * 存档数据接口
 */
export interface ArchiveData {
    /** 是否有存档 */
    isArchive: boolean;
    /** 游戏是否结束 */
    isGameOver: boolean;
}

/**
 * 棋盘存档数据接口
 */
export interface BoardArchiveData {
    /** 棋盘状态 */
    board: number[][];
    /** 当前方块 */
    currentPiece: ActivePiece | null;
    /** 下一个方块 */
    nextPiece: PieceShape | null;
    /** 暂存方块 */
    holdPiece: PieceShape | null;
    /** 是否可以使用暂存 */
    canHold: boolean;
}

/**
 * 触摸事件数据接口
 */
export interface TouchEventData {
    /** 起始X坐标 */
    startX: number;
    /** 起始Y坐标 */
    startY: number;
    /** 起始时间 */
    startTime: number;
}

/**
 * 消除行信息接口
 */
export interface LineClearInfo {
    /** 消除的行索引数组 */
    lines: number[];
    /** 消除的行数 */
    count: number;
}

/**
 * T-Spin 检测结果接口
 */
export interface TSpinResult {
    /** 是否是 T-Spin */
    isTSpin: boolean;
    /** T-Spin 类型（mini, single, double, triple） */
    type?: 'mini' | 'single' | 'double' | 'triple';
}

/**
 * 游戏配置接口
 */
export interface GameConfig {
    /** 棋盘宽度 */
    boardWidth: number;
    /** 棋盘高度 */
    boardHeight: number;
    /** 格子大小 */
    cellSize: number;
    /** 基础下落间隔（毫秒） */
    baseDropInterval: number;
    /** 最小下落间隔（毫秒） */
    minDropInterval: number;
    /** 每级速度减少量（毫秒） */
    speedDecreasePerLevel: number;
}
