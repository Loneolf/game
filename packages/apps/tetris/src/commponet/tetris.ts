export default class Tetris {
    board: number[][] = []
    boardWidth: number = 10
    boardHeight: number = 20
    cellSize: number = 20
    currentPiece: { shape: number[][], x: number, y: number, type: number } | null = null
    nextPiece: { shape: number[][], type: number } | null = null
    pieceX: number = 0
    pieceY: number = 0
    canvas: HTMLCanvasElement | null = null
    ctx: CanvasRenderingContext2D | null = null
    nextCanvas: HTMLCanvasElement | null = null
    nextCtx: CanvasRenderingContext2D | null = null

    pieceTypes = [
        { shape: [[1,1,1,1]], name: 'I' },
        { shape: [[1,1],[1,1]], name: 'O' },
        { shape: [[0,1,0],[1,1,1]], name: 'T' },
        { shape: [[0,1,1],[1,1,0]], name: 'S' },
        { shape: [[1,1,0],[0,1,1]], name: 'Z' },
        { shape: [[1,0,0],[1,1,1]], name: 'J' },
        { shape: [[0,0,1],[1,1,1]], name: 'L' },
    ]

    colors = [
        '#000',
        '#00F0F0',
        '#F0F000',
        '#A000F0',
        '#00F000',
        '#F00000',
        '#0000F0',
        '#F0A000',
    ]

    constructor() {
        this.initBoard()
        this.canvas = document.querySelector('#board')
        this.ctx = this.canvas?.getContext('2d') || null
        this.nextCanvas = document.querySelector('#next-piece')
        this.nextCtx = this.nextCanvas?.getContext('2d') || null
    }

    initBoard() {
        this.board = Array.from({ length: this.boardHeight }, () => 
            Array(this.boardWidth).fill(0)
        )
        this.currentPiece = null
        this.nextPiece = null
    }

    generatePiece() {
        const type = Math.floor(Math.random() * this.pieceTypes.length) + 1
        const piece = this.pieceTypes[type - 1]
        return {
            shape: piece.shape.map(row => [...row]),
            type: type,
        }
    }

    spawnPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.generatePiece()
        }
        
        this.currentPiece = {
            ...this.nextPiece,
            x: Math.floor((this.boardWidth - this.nextPiece.shape[0].length) / 2),
            y: 0,
        }
        
        this.nextPiece = this.generatePiece()
        this.drawNextPiece()

        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            return false
        }
        return true
    }

    checkCollision(newX: number, newY: number, shape: number[][]): boolean {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = newX + x
                    const boardY = newY + y
                    
                    if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
                        return true
                    }
                    
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    lockPiece() {
        if (!this.currentPiece) return
        
        const { shape, x, y, type } = this.currentPiece
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const boardY = y + py
                    const boardX = x + px
                    if (boardY >= 0 && boardY < this.boardHeight && boardX >= 0 && boardX < this.boardWidth) {
                        this.board[boardY][boardX] = type
                    }
                }
            }
        }
    }

    clearLines(): number {
        let linesCleared = 0
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1)
                this.board.unshift(Array(this.boardWidth).fill(0))
                linesCleared++
                y++
            }
        }
        
        return linesCleared
    }

    moveLeft(): boolean {
        if (!this.currentPiece) return false
        
        const newX = this.currentPiece.x - 1
        if (!this.checkCollision(newX, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x = newX
            return true
        }
        return false
    }

    moveRight(): boolean {
        if (!this.currentPiece) return false
        
        const newX = this.currentPiece.x + 1
        if (!this.checkCollision(newX, this.currentPiece.y, this.currentPiece.shape)) {
            this.currentPiece.x = newX
            return true
        }
        return false
    }

    moveDown(): boolean {
        if (!this.currentPiece) return false
        
        const newY = this.currentPiece.y + 1
        if (!this.checkCollision(this.currentPiece.x, newY, this.currentPiece.shape)) {
            this.currentPiece.y = newY
            return true
        }
        return false
    }

    rotate(): boolean {
        if (!this.currentPiece) return false
        
        const shape = this.currentPiece.shape
        const rows = shape.length
        const cols = shape[0].length
        
        const rotated: number[][] = []
        for (let x = 0; x < cols; x++) {
            rotated[x] = []
            for (let y = rows - 1; y >= 0; y--) {
                rotated[x][rows - 1 - y] = shape[y][x]
            }
        }
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated
            return true
        }
        
        const kicks = [1, -1, 2, -2]
        for (const kick of kicks) {
            if (!this.checkCollision(this.currentPiece.x + kick, this.currentPiece.y, rotated)) {
                this.currentPiece.shape = rotated
                this.currentPiece.x += kick
                return true
            }
        }
        
        return false
    }

    hardDrop(): number {
        let dropDistance = 0
        while (this.moveDown()) {
            dropDistance++
        }
        return dropDistance
    }

    draw() {
        if (!this.ctx) return
        
        this.ctx.fillStyle = '#000'
        this.ctx.fillRect(0, 0, this.boardWidth * this.cellSize, this.boardHeight * this.cellSize)
        
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.drawCell(x, y, this.colors[this.board[y][x]])
                }
            }
        }
        
        if (this.currentPiece) {
            const { shape, x, y, type } = this.currentPiece
            for (let py = 0; py < shape.length; py++) {
                for (let px = 0; px < shape[py].length; px++) {
                    if (shape[py][px]) {
                        this.drawCell(x + px, y + py, this.colors[type])
                    }
                }
            }
        }
        
        this.ctx.strokeStyle = '#333'
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath()
            this.ctx.moveTo(x * this.cellSize, 0)
            this.ctx.lineTo(x * this.cellSize, this.boardHeight * this.cellSize)
            this.ctx.stroke()
        }
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y * this.cellSize)
            this.ctx.lineTo(this.boardWidth * this.cellSize, y * this.cellSize)
            this.ctx.stroke()
        }
    }

    drawCell(x: number, y: number, color: string) {
        if (!this.ctx) return
        
        const padding = 1
        this.ctx.fillStyle = color
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            this.cellSize - padding * 2,
            this.cellSize - padding * 2
        )
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            this.cellSize - padding * 2,
            3
        )
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + padding,
            3,
            this.cellSize - padding * 2
        )
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        this.ctx.fillRect(
            x * this.cellSize + padding,
            y * this.cellSize + this.cellSize - padding - 3,
            this.cellSize - padding * 2,
            3
        )
        this.ctx.fillRect(
            x * this.cellSize + this.cellSize - padding - 3,
            y * this.cellSize + padding,
            3,
            this.cellSize - padding * 2
        )
    }

    drawNextPiece() {
        if (!this.nextCtx || !this.nextPiece) return
        
        this.nextCtx.fillStyle = '#000'
        this.nextCtx.fillRect(0, 0, 100, 100)
        
        const { shape, type } = this.nextPiece
        const cellSize = 20
        const offsetX = (100 - shape[0].length * cellSize) / 2
        const offsetY = (100 - shape.length * cellSize) / 2
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const px = offsetX + x * cellSize
                    const py = offsetY + y * cellSize
                    
                    this.nextCtx.fillStyle = this.colors[type]
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2)
                    
                    this.nextCtx.fillStyle = 'rgba(255, 255, 255, 0.3)'
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, 3)
                    this.nextCtx.fillRect(px + 1, py + 1, 3, cellSize - 2)
                    
                    this.nextCtx.fillStyle = 'rgba(0, 0, 0, 0.3)'
                    this.nextCtx.fillRect(px + 1, py + cellSize - 4, cellSize - 2, 3)
                    this.nextCtx.fillRect(px + cellSize - 4, py + 1, 3, cellSize - 2)
                }
            }
        }
    }

    archive() {
        const data = {
            board: this.board,
            currentPiece: this.currentPiece,
            nextPiece: this.nextPiece,
        }
        localStorage.setItem('TETRISBOARD', JSON.stringify(data))
    }

    archiveRestore() {
        try {
            const data = JSON.parse(localStorage.getItem('TETRISBOARD')!)
            if (data) {
                this.board = data.board || []
                this.currentPiece = data.currentPiece || null
                this.nextPiece = data.nextPiece || null
                if (this.nextPiece) {
                    this.drawNextPiece()
                }
            }
        } catch (error) {
            console.log('存档异常')
        }
    }

    clearArchive() {
        localStorage.removeItem('TETRISBOARD')
    }
}
