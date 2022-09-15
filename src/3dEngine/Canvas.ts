import Triangle from "./Triangle.js";
import Color from "../math/Color.js";
import {interpolate, map} from "../math/Utils.js";

export default class Canvas {
    private readonly _canvasDOM: HTMLCanvasElement;
    private readonly _canvasCtx: CanvasRenderingContext2D;
    public readonly width: number;
    public readonly height: number;
    private img: ImageData;
    private depthBuffer: Float32Array;

    constructor(canvasDOM: HTMLCanvasElement | null) {
        if (canvasDOM == null) throw new DOMException("canvas not found");
        this._canvasDOM = canvasDOM;
        let canvasCtx = canvasDOM.getContext("2d");
        if (canvasCtx == null) throw new Error("Canvas context not work");
        this._canvasCtx = canvasCtx;
        this.width = this._canvasDOM.width;
        this.height = this._canvasDOM.height;
        this.img = this._canvasCtx.createImageData(this.width, this.height);
        this.depthBuffer = new Float32Array(this.width * this.height);
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


    drawTriangles(triangles: Triangle[]) {
        // triangles.sort((t1, t2) => t1.z - t2.z);
        triangles.forEach(t => {
            let [_p1, _p2, _p3] = t.vertices;
            // const c = (1 / _p3.z) * 500;
            // let color = new Color([c, c, c, 1]);
            const a = [_p1, _p2, _p3];
            a.sort((a, b) => a.y - b.y);
            const [p1, p2, p3] = a;

            const x12 = interpolate(p1.y, p1.x, p2.y, p2.x);
            const x23 = interpolate(p2.y, p2.x, p3.y, p3.x);
            const x13 = interpolate(p1.y, p1.x, p3.y, p3.x);

            x12.pop();
            const x123 = [...x12];
            x123.push(...x23);

            const z12 = interpolate(p1.y, p1.z, p2.y, p2.z);
            const z23 = interpolate(p2.y, p2.z, p3.y, p3.z);
            const z13 = interpolate(p1.y, p1.z, p3.y, p3.z);

            z12.pop();
            const z123 = [...z12];
            z123.push(...z23);

            const m = Math.floor(x123.length / 2);
            let x_left, x_right;
            let z_left, z_right;

            if (x13[m] < x123[m]) {
                x_left = x13;
                x_right = x123;

                z_left = z13;
                z_right = z123;
            } else {
                x_left = x123;
                x_right = x13;

                z_left = z123;
                z_right = z13;
            }

            let i = 0;
            for (let y = p1.y; y <= p3.y; y++) {
                const xl = x_left[i];
                const xr = x_right[i];
                const z_segment = interpolate(xl, z_left[i], xr, z_right[i]);
                let j = 0;
                for (let x = xl; x < xr; x++) {
                    const z = 1 / z_segment[j];
                    const _x = Math.ceil(x);
                    const _y = Math.ceil(y);

                    if (z > this.depthBuffer[_y * this.width + _x]) {
                        this.drawPixel(_x, _y, t.color);
                        this.depthBuffer[_y * this.width + _x] = z;
                    }
                    j++;
                }
                i++;
            }
        });

    }

    drawPixel(x: number, y: number, color: Color) {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.img.data[y * (this.width * 4) + x * 4] = color.r;
        this.img.data[y * (this.width * 4) + x * 4 + 1] = color.g;
        this.img.data[y * (this.width * 4) + x * 4 + 2] = color.b;
        this.img.data[y * (this.width * 4) + x * 4 + 3] = color.a * 255;
    }

    startDrawing() {
        this.img = this._canvasCtx.createImageData(this.width, this.height);
        for (let i = 0; i < this.width * this.height; i++) {
            this.depthBuffer[i] = 0;
        }
    }

    endDrawing() {
        let max = 0;
        for (let i = 0; i < this.width * this.height; i++) {
            max = Math.max(this.depthBuffer[i], max);
        }

        const DRAW_DEPTH_BUFFER = true;
        if (DRAW_DEPTH_BUFFER)
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    const c = map(
                        this.depthBuffer[y * this.width + x],
                        0,
                        max,
                        0,
                        255
                    );
                    this.drawPixel(x, y, new Color([c, c, c, 255]));
                }
            }

        this._canvasCtx.putImageData(this.img, 0, 0);
    }

    // getters and setters
    get canvasDOM(): HTMLCanvasElement {
        return this._canvasDOM;
    }

    get canvasCtx(): CanvasRenderingContext2D {
        return this._canvasCtx;
    }
}
