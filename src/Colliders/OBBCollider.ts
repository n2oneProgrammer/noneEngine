import Vector3 from "../math/Vector3.js";
import {Matrix3x3} from "../math/Matrix.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface IOOB {
    origin: Vector3;
    size: Vector3;
    orientation?: Matrix3x3;
}

export default class OBBCollider extends ColliderComponent {
    private _origin: Vector3;
    private _halfSize: Vector3;
    private _orientation: Matrix3x3;

    constructor(params: IOOB | undefined) {
        super();
        if (params == undefined) {
            this._origin = Vector3.zero;
            this._halfSize = Vector3.one.mul(1 / 2);
            this._orientation = Matrix3x3.zero;
        } else {
            this._origin = params.origin;
            this._halfSize = params.size.mul(1 / 2);
            this._orientation = params.orientation || Matrix3x3.zero;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    //getters and setters

    get origin(): Vector3 {
        return this._origin;
    }

    get halfSize(): Vector3 {
        return this._halfSize;
    }

    get orientation(): Matrix3x3 {
        return this._orientation;
    }
}