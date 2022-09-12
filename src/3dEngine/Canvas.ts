import Color from "./Color.js";
import {RenderedTriangle} from "./Triangle.js";

export default class Canvas {
    private readonly _canvasDOM: HTMLCanvasElement;
    private readonly _canvasCtx: CanvasRenderingContext2D;
    public readonly width: number;
    public readonly height: number;

    constructor(canvasDOM: HTMLCanvasElement | null) {
        if (canvasDOM == null) throw new DOMException("canvas not found");
        this._canvasDOM = canvasDOM;
        let canvasCtx = canvasDOM.getContext("2d");
        if (canvasCtx == null) throw new Error("Canvas context not work");
        this._canvasCtx = canvasCtx;
        this.width = this._canvasDOM.width;
        this.height = this._canvasDOM.height;
    }

    clearCanvas() {
        this._canvasCtx.clearRect(0, 0, this.width, this.height);
    }

    // getters and setters
    get canvasDOM(): HTMLCanvasElement {
        return this._canvasDOM;
    }

    get canvasCtx(): CanvasRenderingContext2D {
        return this._canvasCtx;
    }

    putPixel(x: number, y: number, color: Color) {
        let realX = this.width / 2 + x;
        let realY = this.height / 2 - y;
        this._canvasCtx.fillStyle = color.toString();
        this._canvasCtx.fillRect(realX, realY, 1, 1);
    }

    drawLine(start: [number, number], end: [number, number], color: Color) {
        let realX1 = this.width / 2 + start[0];
        let realY1 = this.height / 2 - start[1];
        let realX2 = this.width / 2 + end[0];
        let realY2 = this.height / 2 - end[1];
        this._canvasCtx.beginPath();
        this._canvasCtx.strokeStyle = color.toString();
        this.canvasCtx.moveTo(realX1, realY1);
        this.canvasCtx.lineTo(realX2, realY2);
        this._canvasCtx.stroke();
    }


    drawTriangles(triangles: RenderedTriangle[]) {
        // triangles.sort((t1, t2) => t1.z - t2.z);

        triangles.forEach(t => {
            this._canvasCtx.beginPath();
            this._canvasCtx.strokeStyle = "blue";
            this._canvasCtx.fillStyle = t.color.toString();
            t.points.forEach((p, i) => {
                let realX = this.width / 2 + p[0];
                let realY = this.height / 2 + p[1];
                if (i == 0) {
                    this.canvasCtx.moveTo(realX, realY);
                } else {
                    this.canvasCtx.lineTo(realX, realY);
                }
            });
            let realX = this.width / 2 + t.points[0][0];
            let realY = this.height / 2 + t.points[0][1];
            this.canvasCtx.lineTo(realX, realY);
            this._canvasCtx.stroke();
            this._canvasCtx.fill();
        });

    }
}