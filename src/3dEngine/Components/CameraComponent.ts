import Component, {IStartParams, IUpdateParams} from "../Component.js";
import Scene from "../Scene.js";
import MeshRenderComponent from "./MeshRenderComponent.js";
import Canvas from "../Canvas.js";
import ClippingPlane from "../ClippingPlane.js";
import Triangle from "../../math/Triangle.js";
import {deg2rad} from "../../math/Utils.js";
import Vector3 from "../../math/Vector3.js";

interface ICameraParams {
    viewportNear: number;
    viewportFov: number;
    viewportRatio: number;
}

export default class CameraComponent extends Component {
    private _viewportWidth: number = 0;
    private _viewportHeight: number = 0;
    private readonly _viewportNear: number;
    private readonly clippingPlanes: [
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane
    ];
    private readonly viewportRatio: number;
    private readonly viewportFov: number;

    constructor({viewportNear, viewportFov, viewportRatio}: ICameraParams) {
        super();
        this._viewportNear = viewportNear;
        this.viewportFov = viewportFov;
        this.viewportRatio = viewportRatio;
        this.calcDistance(viewportFov);

        const x = Math.cos(deg2rad(this.viewportFov / 2));
        const y = Math.sin(deg2rad(this.viewportFov / 2));
        const a = this._viewportHeight / 2;
        const z = a / Math.sqrt(a * a + this._viewportNear * this._viewportNear);
        const z2 = this._viewportNear / Math.sqrt(a * a + this._viewportNear * this._viewportNear);
        this.clippingPlanes = [
            new ClippingPlane(
                new Vector3([0, 0, 1]),
                this._viewportNear
            ),
            new ClippingPlane(new Vector3([x, 0, y])),
            new ClippingPlane(new Vector3([-x, 0, y])),
            new ClippingPlane(new Vector3([0, z2, z])),
            new ClippingPlane(new Vector3([0, -z2, z]))
        ];
        console.log(this)
    }

    calcDistance(angle: number) {
        const a = deg2rad(angle / 2);
        const tg = Math.tan(a);
        const x = 2 * this._viewportNear * tg;
        this._viewportWidth = x;
        this._viewportHeight = x / this.viewportRatio;
    }

    start({scene}: IStartParams): void {
        if (!this.isActive) return;
        scene.mainCamera = this;
    }

    update({}: IUpdateParams): void {
    }

    render(scene: Scene) {
        scene.models.forEach(model => {
                let component = model.getComponent<MeshRenderComponent>(m => m instanceof MeshRenderComponent);
                if (component != undefined) {
                    component.renderTriangles(this, scene.canvas);
                }
            }
        );
    }

    transformNormalToCamera(vertex: Vector3): Vector3 {
        return this.modelOwner!.rotation.mul(-1).mul(vertex.toMatrix()).toVector3();
    }

    //Helpers
    preClipObject(boundingSphere: { center: Vector3, radius: number }) {
        let res = 1;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            const c_res = p.preClipObject(boundingSphere);
            if (c_res === -1) {
                return -1;
            }
            if (c_res === 0) {
                res = 0;
            }
        }
        return res;
    }

    clipObject(triangles: Array<Triangle>) {
        let resTriangles: Array<Triangle> | null = triangles;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            resTriangles = p.clipTriangles(resTriangles.map(t => t.copy()));
            if (resTriangles == null) {
                break;
            }
        }
        return resTriangles;
    }

    applyTransform(vertex: Vector3): Vector3 {
        if (this.modelOwner == null) throw new Error("Component don't have owner");
        let step1 = vertex.sub(this.modelOwner.position);
        return this.modelOwner.rotation.mul(-1).mul(step1.toMatrix()).toVector3();
    }

    projectVertex(vertex: Vector3, canvas: Canvas): Vector3 {
        return this.viewport2Canvas(new Vector3([vertex.x * this._viewportNear / vertex.z, vertex.y * this._viewportNear / vertex.z, vertex.z]), canvas);
    }

    private viewport2Canvas(v: Vector3, canvas: Canvas): Vector3 {
        return new Vector3(
            [(v.x * canvas.width) / this._viewportWidth + canvas.width / 2,
                -(v.y * canvas.height) / this._viewportHeight + canvas.height / 2,
                v.z]);
    }

    // getters and setters


    get viewportWidth(): number {
        return this._viewportWidth;
    }

    set viewportWidth(value: number) {
        this._viewportWidth = value;
    }

    get viewportHeight(): number {
        return this._viewportHeight;
    }

    set viewportHeight(value: number) {
        this._viewportHeight = value;
    }
}
