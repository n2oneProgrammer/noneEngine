import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface ISphere {
    position: Vector3;
    radius: number;
}

export default class SphereCollider extends ColliderComponent {
    private _position: Vector3;
    private _radius: number;

    constructor(params: ISphere | undefined) {
        super();
        if (params == undefined) {
            this._position = Vector3.zero;
            this._radius = 1;
        } else {
            this._position = params.position;
            this._radius = params.radius;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    //getters and setters

    get position(): Vector3 {
        return this._position;
    }

    get radius(): number {
        return this._radius;
    }
}