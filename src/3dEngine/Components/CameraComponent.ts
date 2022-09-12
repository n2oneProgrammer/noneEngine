import Component, {IStartParams, IUpdateParams} from "../Component.js";
import Scene from "../Scene.js";
import Vector3 from "../Vector3.js";
import MeshRenderComponent from "./MeshRenderComponent.js";
import Canvas from "../Canvas.js";
import ClippingPlane from "../ClippingPlane.js";
import Triangle, {RenderedTriangle} from "../Triangle.js";
import {deg2rad} from "../Utils.js";

interface ICameraParams {
    viewportNear: number;
    viewportFov: number;
    viewportRatio: number;
}

export default class CameraComponent extends Component {
    private _viewportWidth: number = 0;
    private _viewportHeight: number = 0;
    private _viewportNear: number;
    private clippingPlanes: [
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane,
        ClippingPlane
    ];
    private viewportRatio: number;
    private viewportFov: number;

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
        let triangles: RenderedTriangle[] = [];
        scene.models.forEach(model => {
                let component = model.getComponent<MeshRenderComponent>(m => m instanceof MeshRenderComponent);
                if (component != undefined) {
                    triangles = triangles.concat(component.renderTriangles(this, scene.canvas));
                }
            }
        );
        scene.canvas.drawTriangles(triangles);
    }

    //Helpers
    clipObject(triangles: Array<Triangle>, boundingSphere: { center: Vector3, radius: number }) {
        let resTriangles: Array<Triangle> | null = triangles;
        for (let i = 0; i < this.clippingPlanes.length; i++) {
            const p = this.clippingPlanes[i];
            console.log(p);
            resTriangles = p.clipObject(resTriangles.map(t => t.copy()), boundingSphere);
            if (resTriangles == null) {
                break;
            }
        }
        return resTriangles;
    }

    applyTransform(vertex: Vector3): Vector3 {
        if (this.modelOwner == null) throw new Error("Component don't have owner");
        let step1 = vertex.sub(this.modelOwner.position);
        return this.modelOwner.rotation.negative().mul(step1) as Vector3;
    }

    projectVertex(vertex: Vector3, canvas: Canvas): [number, number] {
        return this.viewport2Canvas(vertex.x * this._viewportNear / vertex.z, vertex.y * this._viewportNear / vertex.z, canvas);
    }

    private viewport2Canvas(x: number, y: number, canvas: Canvas): [number, number] {
        return [x * canvas.width / this._viewportWidth, y * canvas.height / this._viewportHeight];
    }


    //TODO: REMOVE LATER
    // private traceRay(models: Model[], startPoint: Vector3, viewport: Vector3, t_min: number, t_max: number) {
    //     let closest_t = Infinity;
    //     let closest_model = null;
    //     for (let model of models) {
    //         let component = model.getComponent<MeshRenderComponent>(MeshRenderComponent.name);
    //         if (component != undefined) {
    //             // console.log(component)
    //             let [t1, t2] = component.intersectRay(startPoint, viewport);
    //             if (t1 > t_min && t1 < t_max && t1 < closest_t) {
    //                 closest_t = t1;
    //                 closest_model = component;
    //             }
    //             if (t2 > t_min && t2 < t_max && t2 < closest_t) {
    //                 closest_t = t2;
    //                 closest_model = component;
    //             }
    //         }
    //     }
    //     if (closest_model == null) {
    //         return Color.BLACK;
    //     }
    //     return closest_model.color;
    // }

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