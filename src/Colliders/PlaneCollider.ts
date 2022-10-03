import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import LineCollider from "./LineCollider.js";
import PointCollider from "./PointCollider.js";
import Quaternion from "../math/Quaternion.js";

export interface IPlane {
    normal: Vector3;
    distance: number;
    register?: boolean;
}

export default class PlaneCollider extends ColliderComponent {
    private readonly _normal: Vector3;
    private readonly _distance: number;

    constructor(params: IPlane | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params == undefined) {
            this._normal = Vector3.forward;
            this._distance = 0;
        } else {
            this._normal = params.normal;
            this._distance = params.distance;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    clip2Plane(line: LineCollider): PointCollider | null {
        let ab = line.endPoint.sub(line.startPoint);
        let nAB = this.normal.dot(ab);
        if (nAB === 0) {
            return null;
        }
        let nA = this.normal.dot(line.startPoint);
        let t = (this.distance - nA) / nAB;
        if (t > 0 && t < 1) {
            return new PointCollider(line.startPoint.add(ab.mul(t)), false);
        }
        return null;
    }

    public planeEquation(pt: Vector3): number {
        return pt.dot(this._normal) - this._distance;
    }

    public isCollideWithPlane(plane: PlaneCollider) {
        let d = this.normal.cross(plane.normal);
        return d.dot(d) != 0;
    }

    //getters and setters

    get normal(): Vector3 {
        if (this.modelOwner == null)
            return this._normal;
        return Quaternion.getQuaternionFromMatrix(this.modelOwner.rotation).mul(this._normal) as Vector3;
    }

    get distance(): number {
        if (this.modelOwner == null)
            return this._distance;
        return this.modelOwner.scale.x * this._distance;
    }
}