import Component, {IStartParams, IUpdateParams} from "../Component.js";
import Vector3 from "../Vector3.js";
import Color from "../Color.js";
import CameraComponent from "./CameraComponent.js";
import Triangle, {RenderedTriangle, TrianglePoints} from "../Triangle.js";
import Canvas from "../Canvas.js";

export interface IMeshRenderComponent {
    color: Color;
}

export default class MeshRenderComponent extends Component {
    private _vertexes: Vector3[];
    private _triangles: [number, number, number][];
    private _color: Color;

    constructor({color}: IMeshRenderComponent) {
        super();
        this._color = color;
        this._vertexes = [];
        this._triangles = [];
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    //TODO REMOVE OR MOVE TO SPHERE
    // intersectRay(startPoint: Vector3, viewport: Vector3): [number, number] {
    //     // debugger
    //     if (this.modelOwner == null) throw new Error("Component don't have owner");
    //     let CO = startPoint.sub(this.modelOwner.position);
    //     let a = viewport.dot(viewport);
    //     let b = 2 * CO.dot(viewport);
    //     let c = CO.dot(CO) - this.radius * this.radius;
    //     let discriminant = b * b - 4 * a * c;
    //     if (discriminant < 0) return [Infinity, Infinity];
    //     let sqrtDisc = Math.sqrt(discriminant);
    //     // debugger
    //     let t1 = (-b + sqrtDisc) / (2 * a);
    //     let t2 = (-b - sqrtDisc) / (2 * a);
    //     return [t1, t2];
    // }
    project(camera: CameraComponent) {
        let copy = this.copy();
        copy._vertexes = copy._vertexes.map(v => camera.applyTransform(this.calcVertexPos(v)));
        return copy;
    }

    renderTriangles(camera: CameraComponent, canvas: Canvas) {
        if (this.modelOwner === undefined) throw new Error("Component don't have owner");
        const projectedMesh = this.project(camera);
        const triangles = projectedMesh.getTriangles();
        const clippedTriangles = camera.clipObject(triangles, {
            center: this.getMeshCenter(),
            radius: this.getMeshRadius()
        });
        // let clippedTriangles = triangles;
        if (!clippedTriangles) return [];
        console.log(triangles.length, clippedTriangles.length);
        canvas.drawTriangles(clippedTriangles.map(t => new RenderedTriangle(
            t.vertices.map(v => camera.projectVertex(v, canvas)) as TrianglePoints,
            this.color,
            t.vertices.reduce((prev, x) => prev + x.z, 0) / t.vertices.length)
        ));
        return []
    }

    getTriangles() {
        return this._triangles.map(t => new Triangle(t.map(i => this.vertexes[i]) as [Vector3, Vector3, Vector3]))
    }

    copy() {
        let mesh = new MeshRenderComponent({color: this.color});
        mesh._vertexes = this._vertexes;
        mesh._triangles = this._triangles;
        mesh.modelOwner = this.modelOwner;
        return mesh;
    }

    calcVertexPos(vertex: Vector3): Vector3 {
        let step1 = vertex.mul(this.modelOwner?.scale || new Vector3([1, 1, 1]));
        let step2 = this.modelOwner ? this.modelOwner.rotation.mul(step1) as Vector3 : step1;
        return step2.add(this.modelOwner?.position || Vector3.zero)
    }

    getMeshCenter() {
        let center = Vector3.zero;
        this._vertexes.forEach(v => center = center.add(v));
        return center.mul(1 / this._vertexes.length).add(this.modelOwner?.position || Vector3.zero);
    }

    getMeshRadius() {
        let center = this.getMeshCenter();
        let maxRadiusSquare = 0;
        this._vertexes.forEach(v => {
            let d = center.sub(v).lengthSquare();
            if (d > maxRadiusSquare) {
                maxRadiusSquare = d;
            }
        });
        return Math.sqrt(maxRadiusSquare);
    }

//getters and setters
    get color()
        :
        Color {
        return this._color;
    }

    set color(value
                  :
                  Color
    ) {
        this._color = value;
    }

    get vertexes()
        :
        Vector3[] {
        return this._vertexes;
    }

    set vertexes(value
                     :
                     Vector3[]
    ) {
        this._vertexes = value;
    }

    get triangles()
        :
        [number, number, number][] {
        return this._triangles;
    }

    set triangles(value
                      :
                      [number, number, number][]
    ) {
        this._triangles = value;
    }


}