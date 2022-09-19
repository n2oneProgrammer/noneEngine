import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface IPlane {
    normal: Vector3;
    distance: number;
}

export default class PlaneCollider extends ColliderComponent {
    private readonly _normal: Vector3;
    private readonly _distance: number;

    constructor(params: IPlane | undefined) {
        super();
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

    planeEquation(pt: Vector3): number {
        return pt.dot(this._normal) - this._distance;
    }
    //getters and setters

    get normal(): Vector3 {
        return this._normal;
    }

    get distance(): number {
        return this._distance;
    }
}