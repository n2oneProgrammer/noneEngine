import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface IPlane {
    normal: Vector3;
    distance: number;
}

export default class PlaneCollider extends ColliderComponent {
    private readonly normal: Vector3;
    private readonly distance: number;

    constructor(params: IPlane | undefined) {
        super();
        if (params == undefined) {
            this.normal = Vector3.forward;
            this.distance = 0;
        } else {
            this.normal = params.normal;
            this.distance = params.distance;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    planeEquation(pt: Vector3): number {
        return pt.dot(this.normal) - this.distance;
    }

}