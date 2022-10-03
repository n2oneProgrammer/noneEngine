import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Quaternion from "../math/Quaternion.js";

export interface IRay {
    position: Vector3;
    direction: Vector3;
    register?: boolean;
}

export default class RayCollider extends ColliderComponent {
    private _position: Vector3;
    private _direction: Vector3;

    constructor(params: IRay | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params == undefined) {
            this._position = Vector3.zero;
            this._direction = new Vector3([0, 0, 1]);
        } else {
            this._position = params.position;
            this._direction = params.direction;
            this.normalizeDirection();
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    public normalizeDirection() {
        this._direction = this._direction.normalize()
    }

    //getters and setters

    get position(): Vector3 {
        if (this.modelOwner == null)
            return this._position;
        return this.modelOwner.position.add(this._position);
    }

    get direction(): Vector3 {
        if (this.modelOwner == null)
            return this._direction;
        return Quaternion.getQuaternionFromMatrix(this.modelOwner.rotation).mul(this._direction) as Vector3;
    }

    static fromPoints(from: Vector3, to: Vector3) {
        return new RayCollider({position: from, direction: to.sub(from).normalize()})
    }
}