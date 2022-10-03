import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";

export interface ILine {
    start: Vector3;
    end: Vector3;
    register?: boolean;
}

export default class LineCollider extends ColliderComponent {
    private _startPoint: Vector3;
    private _endPoint: Vector3;

    constructor(params: ILine | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params === undefined) {
            this._startPoint = Vector3.zero;
            this._endPoint = Vector3.zero;
        } else {
            this._startPoint = params.start;
            this._endPoint = params.end;

        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    public length(): number {
        return this._endPoint.sub(this._startPoint).length()
    }

    lengthSquare(): number {
        return this._endPoint.sub(this._startPoint).lengthSquare()
    }

    //getters and setters

    get startPoint(): Vector3 {
        if (this.modelOwner == null)
            return this._startPoint;
        return this.modelOwner.position.add(this._startPoint);
    }

    get endPoint(): Vector3 {
        if (this.modelOwner == null)
            return this._endPoint;
        return this.modelOwner.position.add(this._endPoint);
    }
}