import Component, {IStartParams, IUpdateParams} from "../Component.js";
import CameraComponent from "./CameraComponent.js";
import Triangle from "../Triangle.js";
import Vector3 from "../../math/Vector3.js";
import Canvas from "../Canvas.js";
import Mesh from "../Mesh.js";
import Color from "../../math/Color.js";

export interface IMeshRenderComponent {
    mesh: Mesh;
    color: Color
}

export default class MeshRenderComponent extends Component {
    mesh: Mesh;
    color: Color;

    constructor({mesh, color}: IMeshRenderComponent) {
        super();
        this.mesh = mesh;
        this.color = color;
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    renderTriangles(camera: CameraComponent, canvas: Canvas) {
        if (this.modelOwner == null) throw new Error("Component don't have owner");
        const projectedMesh = this.mesh.project(camera, this.modelOwner);
        const res = camera.preClipObject(projectedMesh.boundingSphere);
        if (res == -1) return;

        let triangles = projectedMesh.getTriangles(this.color);
        triangles = triangles.filter(t => t.normal.dot((t.vertices[0].negative())) > 0);
        if (res == 0) triangles = camera.clipObject(triangles);
        console.log(triangles.length, triangles);
        let projectTriangle = triangles.map(t => new Triangle(
            t.vertices.map(v => camera.projectVertex(v, canvas)) as [Vector3, Vector3, Vector3]
            , t.normal, t.color
        ));
        canvas.drawTriangles(projectTriangle);
    }

}
