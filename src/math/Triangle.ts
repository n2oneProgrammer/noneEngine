import Vector3 from "./Vector3.js";
import Color from "./Color.js";

export default class Triangle {
    vertices: [Vector3, Vector3, Vector3];
    normal: Vector3;
    color: Color;

    constructor(vertices: [Vector3, Vector3, Vector3], normal: Vector3, color: Color) {
        this.vertices = vertices;
        this.normal = normal;
        this.color = color;
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3], this.normal, this.color
        );
    }
}