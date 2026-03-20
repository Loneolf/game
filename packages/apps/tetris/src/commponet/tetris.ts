/**
 * 俄罗斯方块游戏核心类
 * 负责游戏棋盘管理、方块生成、碰撞检测、绘制等核心功能
 */

import { ActivePiece, PieceShape, PieceType, BoardArchiveData } from '../types/tetris.types';
import { GAME_CONFIG, RENDER_CONFIG } from '../config/game.config';

export default class Tetris {
    /** 游戏棋盘，二维数组，0表示空，其他数字表示方块类型 */
    board: number[][] = []
    
    /** 棋盘宽度（格子数） */
    boardWidth: number = GAME_CONFIG.boardWidth
    
    /** 棋盘高度（格子数） */
    boardHeight: number = GAME_CONFIG.boardHeight
    
    /** 每个格子的像素大小 */
    cellSize: number = GAME_CONFIG.cellSize
    
    /** 当前正在下落的方块 */
    currentPiece: ActivePiece | null = null
    
    /** 下一个将要出现的方块 */
    nextPiece: PieceShape | null = null
    
    /** 暂存的方块 */
    holdPiece: PieceShape | null = null
    
    /** 是否可以使用暂存功能 */
    canHold: boolean = true
    
    /** 主游戏画布 */
    canvas: HTMLCanvasElement | null = null
    
    /** 主游戏画布的2D渲染上下文 */
    ctx: CanvasRenderingContext2D | null = null
    
    /** 下一个方块预览画布 */
    nextCanvas: HTMLCanvasElement | null = null
    
    /** 下一个方块预览画布的2D渲染上下文 */
    nextCtx: CanvasRenderingContext2D | null = null
    
    /** 暂存方块预览画布 */
    holdCanvas: HTMLCanvasElement | null = null
    
    /** 暂存方块预览画布的2D渲染上下文 */
    holdCtx: CanvasRenderingContext2D | null = null
    
    /** 7-Bag 随机系统的方块袋子 */
    private pieceBag: number[] = []
    
    /** 上一次的棋盘状态（用于脏矩形渲染） */
    private lastBoardState: number[][] = []
    
    /** 是否需要重绘 */
    private needsRedraw: boolean = true

    /**
     * 七种经典俄罗斯方块的定义
     * 每种方块由二维数组表示，1表示有方块，0表示空
     */
    pieceTypes: PieceType[] = [
        { shape: [[1,1,1,1]], name: 'I' },           // I型：长条
        { shape: [[1,1],[1,1]], name: 'O' },         // O型：方块
        { shape: [[0,1,0],[1,1,1]], name: 'T' },     // T型：T字形
        { shape: [[0,1,1],[1,1,0]], name: 'S' },     // S型：S形
        { shape: [[1,1,0],[0,1,1]], name: 'Z' },     // Z型：Z形
        { shape: [[1,0,0],[1,1,1]], name: 'J' },     // J型：J形
        { shape: [[0,0,1],[1,1,1]], name: 'L' },     // L型：L形
    ]

    /**
     * 方块颜色数组
     * 索引对应方块类型，0为空（黑色），1-7对应七种方块的颜色
     */
    colors: string[] = [
        '#000',      // 空
        '#00F0F0',   // I型：青色
        '#F0F000',   // O型：黄色
        '#A000F0',   // T型：紫色
        '#00F000',   // S型：绿色
        '#F00000',   // Z型：红色
        '#0000F0',   // J型：蓝色
        '#F0A000',   // L型：橙色
    ]

    /**
     * 构造函数
     * 初始化棋盘和Canvas画布
     */
    constructor() {
        this.initBoard()
        this.canvas = document.querySelector('#board')
        this.ctx = this.canvas?.getContext('2d') || null
        this.nextCanvas = document.querySelector('#next-piece')
        this.nextCtx = this.nextCanvas?.getContext('2d') || null
        this.holdCanvas = document.querySelector('#hold-piece')
        this.holdCtx = this.holdCanvas?.getContext('2d') || null
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize())
        // 初始化时调整大小
        this.resize()
    }

    /**
     * 响应式调整Canvas大小
     * 根据容器大小自动调整格子尺寸
     */
    resize(): void {
        const container = document.querySelector('#game-container')
        if (!container || !this.canvas) return
        
        const maxWidth = container.clientWidth - 130 // 留出侧边栏空间
        const maxHeight = container.clientHeight
        
        // 计算最佳格子大小
        const cellSizeByWidth = Math.floor(maxWidth / this.boardWidth)
        const cellSizeByHeight = Math.floor(maxHeight / this.boardHeight)
        
        this.cellSize = Math.min(cellSizeByWidth, cellSizeByHeight, 30) // 最大30px
        
        // 更新主Canvas尺寸
        this.canvas.width = this.boardWidth * this.cellSize
        this.canvas.height = this.boardHeight * this.cellSize
        
        // 标记需要重绘
        this.markDirty()
        this.draw()
    }

    /**
     * 初始化游戏棋盘
     * 创建一个boardHeight x boardWidth的二维数组，全部填充0
     */
    initBoard() {
        this.board = Array.from({ length: this.boardHeight }, () => 
            Array(this.boardWidth).fill(0)
        )
        this.currentPiece = null
        this.nextPiece = null
        this.holdPiece = null
        this.canHold = true
        this.pieceBag = []
        this.lastBoardState = []
        this.needsRedraw = true
    }

    /**
     * 使用 7-Bag 随机算法生成方块
     * 保证每7个方块中每种类型各出现一次
     * @returns 返回包含形状和类型的方块对象
     */
    private generatePiece(): PieceShape {
        // 如果袋子空了，重新填充并打乱
        if (this.pieceBag.length === 0) {
            this.pieceBag = [1, 2, 3, 4, 5, 6, 7];
            this.shuffleArray(this.pieceBag);
        }
        
        const type = this.pieceBag.pop()!;
        const piece = this.pieceTypes[type - 1];
        
        return {
            // 深拷贝形状数组，避免修改原数组
            shape: piece.shape.map(row => [...row]),
            type: type,
        };
    }

    /**
     * Fisher-Yates 洗牌算法
     * @param array - 需要打乱的数组
     */
    private shuffleArray(array: number[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * 生成新的方块到棋盘顶部
     * @returns 如果生成成功返回true，如果碰撞（游戏结束）返回false
     */
    spawnPiece(): boolean {
        // 如果没有下一个方块，先生成一个
        if (!this.nextPiece) {
            this.nextPiece = this.generatePiece();
        }
        
        // 将下一个方块设为当前方块
        this.currentPiece = {
            ...this.nextPiece,
            // 计算水平居中位置
            x: Math.floor((this.boardWidth - this.nextPiece.shape[0].length) / 2),
            y: 0,  // 从顶部开始
        };
        
        // 生成新的下一个方块
        this.nextPiece = this.generatePiece();
        // 重置暂存功能
        this.canHold = true;
        // 绘制下一个方块预览
        this.drawNextPiece();

        // 检查新方块是否与已有方块碰撞（游戏结束判定）
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            return false;
        }
        
        this.markDirty();
        return true;
    }

    /**
     * 暂存当前方块
     * @returns 暂存成功返回true，否则返回false
     */
    hold(): boolean {
        if (!this.canHold || !this.currentPiece) return false;
        
        this.canHold = false;
        
        if (this.holdPiece) {
            // 交换当前方块和暂存方块
            const temp = this.holdPiece;
            this.holdPiece = {
                shape: this.currentPiece.shape,
                type: this.currentPiece.type
            };
            
            // 重置形状（因为可能被旋转过）
            const originalPiece = this.pieceTypes[temp.type - 1];
            this.currentPiece = {
                shape: originalPiece.shape.map(row => [...row]),
                type: temp.type,
                x: Math.floor((this.boardWidth - originalPiece.shape[0].length) / 2),
                y: 0
            };
        } else {
            // 暂存当前方块，生成新方块
            this.holdPiece = {
                shape: this.currentPiece.shape,
                type: this.currentPiece.type
            };
            
            if (!this.spawnPiece()) {
                return false;
            }
        }
        
        // 绘制暂存方块预览
        this.drawHoldPiece();
        this.markDirty();
        return true;
    }

    /**
     * 检测碰撞
     * @param newX - 方块新的X坐标
     * @param newY - 方块新的Y坐标
     * @param shape - 方块形状
     * @returns 如果发生碰撞返回true，否则返回false
     */
    checkCollision(newX: number, newY: number, shape: number[][]): boolean {
        // 遍历方块的每个格子
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                // 只检查方块中存在的格子（值为1的格子）
                if (shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    // 检查是否超出边界
                    if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
                        return true;
                    }
                    
                    // 检查是否与已锁定的方块重叠
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 锁定当前方块到棋盘
     * 当方块无法继续下落时，将其固定到棋盘上
     */
    lockPiece() {
        if (!this.currentPiece) return;
        
        const { shape, x, y, type } = this.currentPiece;
        // 遍历方块的每个格子
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const boardY = y + py;
                    const boardX = x + px;
                    // 将方块类型写入棋盘对应位置
                    if (boardY >= 0 && boardY < this.boardHeight && boardX >= 0 && boardX < this.boardWidth) {
                        this.board[boardY][boardX] = type;
                    }
                }
            }
        }
        
        this.markDirty();
    }

    /**
     * 清除已填满的行
     * @returns 返回清除的行数
     */
    clearLines(): number {
        let linesCleared = 0;
        
        // 从底部向上检查每一行
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            // 检查该行是否已填满（所有格子都不为0）
            if (this.board[y].every(cell => cell !== 0)) {
                // 删除该行
                this.board.splice(y, 1);
                // 在顶部添加新的空行
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                // 因为删除了一行，需要重新检查当前位置
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.markDirty();
        }
        
        return linesCleared;
    }

    /**
     * 向左移动方块
     * @returns 移动成功返回true，否则返回false
     */
    moveLeft(): boolean {
        if (!this.currentPiece) return false;
        
        const newX = this.currentPiece.x - 1;
        if (!this.checkCollision(newX, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.markDirty();
            return true;
        }
        return false;
    }

    /**
     * 向右移动方块
     * @returns 移动成功返回true，否则返回false
     */
    moveRight(): boolean {
        if (!this.currentPiece) return false;
        
        const newX = this.currentPiece.x + 1;
        if (!this.checkCollision(newX, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.markDirty();
            return true;
        }
        return false;
    }

    /**
     * 向下移动方块
     * @returns 移动成功返回true，否则返回false
     */
    moveDown(): boolean {
        if (!this.currentPiece) return false;
        
        const newY = this.currentPiece.y + 1;
        if (!this.checkCollision(this.currentPiece.x, newY, this.currentPiece.shape)) {
            this.currentPiece.y = newY;
            this.markDirty();
            return true;
        }
        return false;
    }

    /**
     * 旋转方块（顺时针旋转90度）
     * 使用墙踢（Wall Kick）机制，当旋转后碰撞时尝试左右移动
     * @returns 旋转成功返回true，否则返回false
     */
    rotate(): boolean {
        if (!this.currentPiece) return false;
        
        const shape = this.currentPiece.shape;
        const rows = shape.length;
        const cols = shape[0].length;
        
        // 顺时针旋转90度：行列互换，然后每行反转
        const rotated: number[][] = [];
        for (let x = 0; x < cols; x++) {
            rotated[x] = [];
            for (let y = rows - 1; y >= 0; y--) {
                rotated[x][rows - 1 - y] = shape[y][x];
            }
        }
        
        // 尝试在原位置旋转
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
            this.markDirty();
            return true;
        }
        
        // 墙踢机制：尝试左右移动后再旋转
        const kicks = [1, -1, 2, -2];
        for (const kick of kicks) {
            if (!this.checkCollision(this.currentPiece.x + kick, this.currentPiece.y, rotated)) {
                this.currentPiece.shape = rotated;
                this.currentPiece.x += kick;
                this.markDirty();
                return true;
            }
        }
        
        return false;
    }

    /**
     * 硬降（直接落到底部）
     * @returns 返回下落的格子数
     */
    hardDrop(): number {
        let dropDistance = 0;
        while (this.moveDown()) {
            dropDistance++;
        }
        return dropDistance;
    }

    /**
     * 计算当前方块的最终落点位置（Ghost Piece）
     * @returns Ghost Piece 的 Y 坐标
     */
    private getGhostY(): number {
        if (!this.currentPiece) return 0;
        
        let ghostY = this.currentPiece.y;
        while (!this.checkCollision(this.currentPiece.x, ghostY + 1, this.currentPiece.shape)) {
            ghostY++;
        }
        return ghostY;
    }

    /**
     * 标记需要重绘
     */
    private markDirty(): void {
        this.needsRedraw = true;
    }

    /**
     * 检查两个棋盘状态是否相同
     */
    private boardsEqual(board1: number[][], board2: number[][]): boolean {
        if (board1.length !== board2.length) return false;
        for (let i = 0; i < board1.length; i++) {
            if (board1[i].length !== board2[i].length) return false;
            for (let j = 0; j < board1[i].length; j++) {
                if (board1[i][j] !== board2[i][j]) return false;
            }
        }
        return true;
    }

    /**
     * 克隆棋盘状态
     */
    private cloneBoard(board: number[][]): number[][] {
        return board.map(row => [...row]);
    }

    /**
     * 绘制游戏画面
     * 包括棋盘、已锁定的方块、Ghost Piece、当前方块和网格线
     */
    draw() {
        if (!this.ctx) return;
        
        // 脏矩形渲染优化：只在需要时重绘
        if (RENDER_CONFIG.enableDirtyRect && !this.needsRedraw && this.boardsEqual(this.board, this.lastBoardState)) {
            return;
        }
        
        // 清空画布，填充黑色背景
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.boardWidth * this.cellSize, this.boardHeight * this.cellSize);
        
        // 绘制棋盘上已锁定的方块
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.drawCell(x, y, this.colors[this.board[y][x]]);
                }
            }
        }
        
        // 绘制 Ghost Piece（预览落点）
        if (this.currentPiece) {
            const ghostY = this.getGhostY();
            if (ghostY !== this.currentPiece.y) {
                this.drawGhostPiece(ghostY);
            }
            
            // 绘制当前正在下落的方块
            const { shape, x, y, type } = this.currentPiece;
            for (let py = 0; py < shape.length; py++) {
                for (let px = 0; px < shape[py].length; px++) {
                    if (shape[py][px]) {
                        this.drawCell(x + px, y + py, this.colors[type]);
                    }
                }
            }
        }
        
        // 绘制网格线
        this.ctx.strokeStyle = '#333';
        // 绘制垂直线
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.boardHeight * this.cellSize);
            this.ctx.stroke();
        }
        // 绘制水平线
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.boardWidth * this.cellSize, y * this.cellSize);
            this.ctx.stroke();
        }
        
        // 更新状态
        this.lastBoardState = this.cloneBoard(this.board);
        this.needsRedraw = false;
    }

    /**
     * 绘制 Ghost Piece（半透明预览）
     * @param ghostY - Ghost Piece 的 Y 坐标
     */
    private drawGhostPiece(ghostY: number): void {
        if (!this.ctx || !this.currentPiece) return;
        
        const { shape, x, type } = this.currentPiece;
        this.ctx.globalAlpha = RENDER_CONFIG.ghostOpacity;
        
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    this.drawCell(x + px, ghostY + py, this.colors[type]);
                }
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * 绘制单个格子（带3D效果）
     * @param x - 格子的X坐标（格子单位）
     * @param y - 格子的Y坐标（格子单位）
     * @param color - 格子颜色
     */
    drawCell(x: number, y: number, color: string) {
        if (!this.ctx) return;
        
        const padding = 1;
        
        // 绘制主体颜色
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            this.cellSize - padding * 2,
            this.cellSize - padding * 2
        );
        
        // 绘制高光效果（左上角）
        this.ctx.fillStyle = `rgba(255, 255, 255, ${RENDER_CONFIG.highlightOpacity})`;
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            this.cellSize - padding * 2,
            3  // 顶部高光
        );
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            3,  // 左侧高光
            this.cellSize - padding * 2
        );
        
        // 绘制阴影效果（右下角）
        this.ctx.fillStyle = `rgba(0, 0, 0, ${RENDER_CONFIG.shadowOpacity})`;
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + this.cellSize - padding - 3,
            this.cellSize - padding * 2,
            3  // 底部阴影
        );
        this.ctx.fillRect(
            x * this.cellSize + this.cellSize - padding - 3,
            y * this.cellSize + padding,
            3,  // 右侧阴影
            this.cellSize - padding * 2
        );
    }

    /**
     * 绘制下一个方块预览
     * 在侧边栏显示即将出现的方块
     */
    drawNextPiece() {
        if (!this.nextCtx || !this.nextPiece) return;
        
        // 清空预览区域
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, 100, 100);
        
        const { shape, type } = this.nextPiece;
        const cellSize = 20;
        // 计算居中偏移量
        const offsetX = (100 - shape[0].length * cellSize) / 2;
        const offsetY = (100 - shape.length * cellSize) / 2;
        
        // 绘制下一个方块的每个格子
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = offsetX + x * cellSize;
                    const py = offsetY + y * cellSize;
                    
                    // 绘制主体颜色
                    this.nextCtx.fillStyle = this.colors[type];
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    
                    // 绘制高光效果
                    this.nextCtx.fillStyle = `rgba(255, 255, 255, ${RENDER_CONFIG.highlightOpacity})`;
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, 3);
                    this.nextCtx.fillRect(px + 1, py + 1, 3, cellSize - 2);
                    
                    // 绘制阴影效果
                    this.nextCtx.fillStyle = `rgba(0, 0, 0, ${RENDER_CONFIG.shadowOpacity})`;
                    this.nextCtx.fillRect(px + 1, py + cellSize - 4, cellSize - 2, 3);
                    this.nextCtx.fillRect(px + cellSize - 4, py + 1, 3, cellSize - 2);
                }
            }
        }
    }

    /**
     * 绘制暂存方块预览
     */
    drawHoldPiece() {
        if (!this.holdCtx) return;
        
        // 清空预览区域
        this.holdCtx.fillStyle = '#000';
        this.holdCtx.fillRect(0, 0, 100, 100);
        
        if (!this.holdPiece) return;
        
        const { shape, type } = this.holdPiece;
        const cellSize = 20;
        // 计算居中偏移量
        const offsetX = (100 - shape[0].length * cellSize) / 2;
        const offsetY = (100 - shape.length * cellSize) / 2;
        
        // 绘制暂存方块的每个格子
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = offsetX + x * cellSize;
                    const py = offsetY + y * cellSize;
                    
                    // 如果不能使用暂存，显示为灰色
                    const color = this.canHold ? this.colors[type] : '#666';
                    
                    // 绘制主体颜色
                    this.holdCtx.fillStyle = color;
                    this.holdCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    
                    // 绘制高光效果
                    this.holdCtx.fillStyle = `rgba(255, 255, 255, ${RENDER_CONFIG.highlightOpacity})`;
                    this.holdCtx.fillRect(px + 1, py + 1, cellSize - 2, 3);
                    this.holdCtx.fillRect(px + 1, py + 1, 3, cellSize - 2);
                    
                    // 绘制阴影效果
                    this.holdCtx.fillStyle = `rgba(0, 0, 0, ${RENDER_CONFIG.shadowOpacity})`;
                    this.holdCtx.fillRect(px + 1, py + cellSize - 4, cellSize - 2, 3);
                    this.holdCtx.fillRect(px + cellSize - 4, py + 1, 3, cellSize - 2);
                }
            }
        }
    }

    /**
     * 保存游戏状态到本地存储
     */
    archive() {
        const data: BoardArchiveData = {
            board: this.board,
            currentPiece: this.currentPiece,
            nextPiece: this.nextPiece,
            holdPiece: this.holdPiece,
            canHold: this.canHold,
        };
        localStorage.setItem('TETRISBOARD', JSON.stringify(data));
    }

    /**
     * 从本地存储恢复游戏状态
     */
    archiveRestore() {
        try {
            const data: BoardArchiveData = JSON.parse(localStorage.getItem('TETRISBOARD')!);
            if (data) {
                this.board = data.board || [];
                this.currentPiece = data.currentPiece || null;
                this.nextPiece = data.nextPiece || null;
                this.holdPiece = data.holdPiece || null;
                this.canHold = data.canHold !== undefined ? data.canHold : true;
                
                // 恢复后重新绘制预览
                if (this.nextPiece) {
                    this.drawNextPiece();
                }
                if (this.holdPiece) {
                    this.drawHoldPiece();
                }
                
                this.markDirty();
            }
        } catch (error) {
            console.log('存档异常');
        }
    }

    /**
     * 清除本地存储的游戏状态
     */
    clearArchive() {
        localStorage.removeItem('TETRISBOARD');
    }
}
