import Vector3 from "../math/Vector3";
import Color from "../math/Color.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export default class Triangle extends ColliderComponent {
    vertices: [Vector3, Vector3, Vector3];
    normal: Vector3;
    color: Color;

    constructor(vertices: [Vector3, Vector3, Vector3], normal: Vector3, color: Color) {
        super();
        this.vertices = vertices;
        this.normal = normal;
        this.color = color;
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    copy() {
        return new Triangle(
            this.vertices.map((v) => v.copy()) as [Vector3, Vector3, Vector3], this.normal, this.color
        );
    }
}