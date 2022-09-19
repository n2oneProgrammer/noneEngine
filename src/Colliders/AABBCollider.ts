import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";

export interface IAABB {
    origin: Vector3;
    size: Vector3;
}

export default class AABBCollider extends ColliderComponent {
    private _origin: Vector3;
    private _halfSize: Vector3;

    constructor(params: IAABB | undefined) {
        super();
        if (params == undefined) {
            this._origin = Vector3.zero;
            this._halfSize = Vector3.one.mul(1 / 2);
        } else {
            this._origin = params.origin;
            this._halfSize = params.size.mul(1 / 2);
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    getMin(): Vector3 {
        let p1 = this.origin.add(this.halfSize);
        let p2 = this.origin.sub(this.halfSize);
        return new Vector3([Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.min(p1.z, p2.z)]);
    }

    getMax(): Vector3 {
        let p1 = this.origin.add(this.halfSize);
        let p2 = this.origin.sub(this.halfSize);
        return new Vector3([Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), Math.max(p1.z, p2.z)]);
    }

    static fromMinMax(min: Vector3, max: Vector3): AABBCollider {
        return new AABBCollider({
            origin: min.add(max).mul(1 / 2),
            size: max.sub(min)
        })
    }

    //getters and setters

    get origin(): Vector3 {
        return this._origin;
    }

    get halfSize(): Vector3 {
        return this._halfSize;
    }
}