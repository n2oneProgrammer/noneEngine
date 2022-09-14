import Vector3 from "../math/Vector3";
import Color from "../math/Color.js";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    color :Color;

    constructor(vertices: [Vector3, Vector3, Vector3], color: Color = new Color([0, 0, 0, 1])) {
        this.vertices = vertices;
        this.color = color;
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3]
        );
    }
}
export type TrianglePoints = [[number, number], [number, number], [number, number]]

export class RenderedTriangle {
    private readonly _points: TrianglePoints;
    private readonly _z: number;
    private _color: Color;

    constructor(points: TrianglePoints, color: Color, z: number) {
        this._points = points;
        this._color = color;
        this._z = z;
    }

    get points(): TrianglePoints {
        return this._points;
    }

    get z(): number {
        return this._z;
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }
}
