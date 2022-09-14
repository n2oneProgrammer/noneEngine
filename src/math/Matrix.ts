export default class Matrix {
    private values: number[][];
    private rows: number;
    private cols: number;

    constructor(tab: number[][] | number[]) {
        if (tab.length == 0) {
            this.values = [[0]];
            this.cols = 1;
            this.rows = 1;
        } else {
            if (tab[0] instanceof Object) {
                this.values = tab as number[][];
                this.rows = tab.length;
                this.cols = tab[0].length;
            } else {
                this.values = [tab] as number[][];
                this.rows = 1;
                this.cols = tab.length;
            }
        }
    }

    get(col: number, row: number) {
        if (col < 0 || col > this.cols || row < 0 || row > this.rows) throw new Error(`Out of Matrix[${this.cols},${this.rows}]. You cannot get ${col},${row}`);
        return this.values[row][col];
    }

    transpose(): Matrix {
        let result: number[][] = [];
        this.values.forEach((row, y) => row.forEach((element, x) => {
            if (result[x] == null) result[x] = [];
            result[x][y] = element;
        }));
        return new Matrix(result);
    }

    mul(d: number | Matrix): Matrix {
        let result: number[][] = [];
        if (d instanceof Matrix) {
            if (this.cols != d.rows) {
                throw new Error("You can multiple matrix which first matrix columns is equal second matrix rows")
            }
            for (let y = 0; y < this.rows; y++) {
                for (let x = 0; x < d.cols; x++) {
                    if (result[y] == null) result[y] = [];
                    result[y][x] = 0;
                    for (let k = 0; k < d.rows; k++) {
                        result[y][x] += this.values[y][k] * d.values[k][x];
                    }
                }
            }
        } else {
            result = this.values.map(row => row.map(element => element * d));
        }
        return new Matrix(result);
    }

    cut(row: number, col: number): Matrix {
        let result: number[][] = [];
        let index = 0;
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (x == col || y == row) continue;
                let targetY = Math.floor(index / (this.cols - 1));
                let targetX = index % (this.cols - 1);
                if (result[targetY] == null) result[targetY] = [];
                result[targetY][targetX] = this.values[y][x];
                index++;
            }
        }
        return new Matrix(result);
    }

    minor(): Matrix {
        if (this.rows == 0 && this.cols == 0) {
            return new Matrix([[this.values[1][1], this.values[1][0]],
                [this.values[0][1], this.values[0][0]]])
        }
        let result: number[][] = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (result[y] == null) result[y] = [];
                let det = this.cut(y, x).determinant();
                if (det == null) throw new Error("I cannot calculate minor");
                result[y][x] = det;
            }
        }
        return new Matrix(result);
    }

    cofactor(): Matrix {
        let result = this.minor();
        for (let y = 0; y < result.rows; y++) {
            for (let x = 0; x < result.cols; x++) {
                result.values[y][x] *= (x + y) % 2 == 0 ? 1 : -1;
            }
        }
        return result;
    }

    adjugate(): Matrix {
        return this.cofactor().transpose();
    }

    determinant(): number | null {
        if (this.rows == 2 && this.cols == 2) {
            return this.determinant2x2();
        }
        if (this.rows == this.cols) {
            let cof = this.cofactor();
            let result = 0;
            for (let j = 0; j < this.cols; j++) {
                result += this.values[0][j] * cof.get(j, 0);
            }
            return result;
        }
        return null;
    }

    private determinant2x2(): number {
        return this.values[0][0] * this.values[1][1] - this.values[0][1] * this.values[1][0];
    }

    inverse(): Matrix | null {
        if (this.rows != this.cols) throw new Error("Inverse Matrix can be only from square matrix");
        let det = this.determinant();
        if (det == 0 || det == null) return null;
        return this.adjugate().mul(1 / det);
    }

    static makeIdentity(size: number): Matrix {
        let result: number[][] = [];
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (result[y] == null) result[y] = [];
                result[y][x] = x == y ? 1 : 0;
            }
        }
        return new Matrix(result);
    }
}