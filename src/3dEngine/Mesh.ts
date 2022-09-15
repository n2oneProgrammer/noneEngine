import Vector3 from "../math/Vector3.js";
import CameraComponent from "./Components/CameraComponent.js";
import Model from "./Model.js";
import Triangle from "./Triangle.js";
import Color from "../math/Color.js";

export interface Sphere {
    center: Vector3;
    radius: number;
}

export default class Mesh {
    vertexes: Array<Vector3>;
    triangles: Array<[number, number, number]>;
    normals: Array<Vector3>;
    boundingSphere!: Sphere;

    constructor(
        vertices: Array<Vector3>,
        triangles: Array<[number, number, number]>,
        normals?: Array<Vector3>
    ) {
        this.triangles = triangles;
        this.vertexes = vertices;
        this.normals = [];
        if (normals) this.normals = normals;
        else this.calculateNormals();
    }

    calculateNormals() {
        this.normals = [];
        this.triangles.forEach((t) => {
            const v1 = this.vertexes[t[1]].sub(this.vertexes[t[0]]);
            const v2 = this.vertexes[t[2]].sub(this.vertexes[t[0]]);
            this.normals.push(v1.cross(v2).normalize());
        });
    }

    calculateBoundingSphere() {
        const center = this.vertexes
            .reduce((pV: Vector3, cV: Vector3) => cV.add(pV))
            .mul(1 / this.vertexes.length);
        let radius = 0;
        this.vertexes.forEach((v) => {
            const x = center.sub(v).lengthSquare();
            if (x > radius) {
                radius = x;
            }
        });
        radius = Math.sqrt(radius);
        this.boundingSphere = {center, radius};
    }

    copy() {
        return new Mesh(this.vertexes, this.triangles, this.normals);
    }

    project(camera: CameraComponent, modelOwner: Model) {
        let copy = this.copy();
        copy.vertexes = copy.vertexes.map(v => camera.applyTransform(this.calcVertexPos(v, modelOwner)));
        copy.normals = copy.normals.map((n) =>
            camera.transformNormalToCamera(modelOwner.rotation.mul(n) as Vector3)
        );
        copy.calculateBoundingSphere();
        return copy;
    }

    calcVertexPos(vertex: Vector3, modelOwner: Model): Vector3 {
        let step1 = vertex.mul(modelOwner.scale || new Vector3([1, 1, 1]));
        let step2 = modelOwner.rotation.mul(step1) as Vector3;
        return step2.add(modelOwner.position)
    }

    getTriangles(color: Color) {
        return this.triangles.map(
            (t, i) =>
                new Triangle(
                    t.map((i) => this.vertexes[i]) as [
                        Vector3,
                        Vector3,
                        Vector3
                    ],
                    this.normals[i],
                    color
                )
        );
    }
}
