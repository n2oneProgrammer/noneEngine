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
}