import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface IRay {
    origin: Vector3;
    direction: Vector3;
}

export default class RayCollider extends ColliderComponent {
    private _origin: Vector3;
    private _direction: Vector3;

    constructor(params: IRay | undefined) {
        super();
        if (params == undefined) {
            this._origin = Vector3.zero;
            this._direction = new Vector3([0, 0, 1]);
        } else {
            this._origin = params.origin;
            this._direction = params.direction;
            this.normalizeDirection();
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    normalizeDirection() {
        this._direction = this._direction.normalize()
    }

    //getters and setters

    get origin(): Vector3 {
        return this._origin;
    }

    get direction(): Vector3 {
        return this._direction;
    }

    static fromPoints(from: Vector3, to: Vector3) {
        return new RayCollider({origin: from, direction: to.sub(from).normalize()})
    }
}