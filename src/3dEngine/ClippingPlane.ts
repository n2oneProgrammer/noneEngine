import Triangle from "./Triangle.js";
import Vector3 from "../math/Vector3.js";

export default class ClippingPlane {
    normal: Vector3;
    d: number;

    constructor(normal: Vector3 = Vector3.zero, d: number = 0) {
        this.normal = normal;
        this.d = d;
    }

    distance(v: Vector3) {
        return v.dot(this.normal) + this.d;
    }

    intersection(a: Vector3, b: Vector3) {
        const ab = a.sub(b);
        return ab
            .mul(
                (-this.d - a.dot(this.normal)) /
                ab.dot(this.normal)
            )
            .add(a);
    }

    preClipObject(boundingSphere: { center: Vector3, radius: number }) {
        const d = this.distance(boundingSphere.center);

        if (boundingSphere.radius < d)
            return 1;
        if (-boundingSphere.radius > d)
            return -1;
        return 0;
    }

    clipTriangles(triangles: Array<Triangle>) {
        let result: Triangle[] = [];
        triangles.forEach((_t) => {
            result.push(...this.clipTriangle(_t.copy()));
        });
        return result;
    }

    clipTriangle(triangle: Triangle): Triangle[] {
        const d0 = this.distance(triangle.vertices[0]);
        const d1 = this.distance(triangle.vertices[1]);
        const d2 = this.distance(triangle.vertices[2]);

        if (d0 >= 0 && d1 >= 0 && d2 >= 0) {
            return [triangle];
        } else if (d0 <= 0 && d1 <= 0 && d2 <= 0) {
            return [];
        } else if (d0 > 0 && d1 < 0 && d2 < 0) {
            return [
                new Triangle(
                    [
                        triangle.vertices[0],
                        this.intersection(triangle.vertices[1], triangle.vertices[0]),
                        this.intersection(triangle.vertices[2], triangle.vertices[0]),
                    ],
                    triangle.normal,
                    triangle.color
                ),
            ];
        } else if (d0 < 0 && d1 > 0 && d2 < 0) {
            return [
                new Triangle(
                    [
                        this.intersection(triangle.vertices[0], triangle.vertices[1]),
                        triangle.vertices[1],
                        this.intersection(triangle.vertices[2], triangle.vertices[1]),
                    ],
                    triangle.normal,
                    triangle.color
                ),
            ];
        } else if (d0 < 0 && d1 < 0 && d2 > 0) {
            return [
                new Triangle(
                    [
                        this.intersection(triangle.vertices[0], triangle.vertices[2]),
                        this.intersection(triangle.vertices[1], triangle.vertices[2]),
                        triangle.vertices[2],
                    ],
                    triangle.normal, triangle.color
                ),
            ];
        } else if (d0 >= 0 && d1 >= 0 && d2 < 0) {
            const _02 = this.intersection(triangle.vertices[0], triangle.vertices[2]);
            const _12 = this.intersection(triangle.vertices[1], triangle.vertices[2]);
            return [
                new Triangle([triangle.vertices[0], triangle.vertices[1], _02], triangle.normal, triangle.color),
                new Triangle([triangle.vertices[1], _02, _12], triangle.normal, triangle.color),
            ];
        } else if (d0 >= 0 && d1 < 0 && d2 >= 0) {
            const _01 = this.intersection(triangle.vertices[0], triangle.vertices[1]);
            const _12 = this.intersection(triangle.vertices[1], triangle.vertices[2]);
            return [
                new Triangle([triangle.vertices[0], triangle.vertices[2], _01], triangle.normal, triangle.color),
                new Triangle([triangle.vertices[2], _01, _12], triangle.normal, triangle.color),
            ];
        } else if (d0 < 0 && d1 >= 0 && d2 >= 0) {
            const _01 = this.intersection(triangle.vertices[0], triangle.vertices[1]);
            const _02 = this.intersection(triangle.vertices[0], triangle.vertices[2]);
            return [
                new Triangle([triangle.vertices[1], triangle.vertices[2], _01], triangle.normal, triangle.color),
                new Triangle([triangle.vertices[2], _01, _02], triangle.normal, triangle.color),
            ];
        }
        return []
    }
}
