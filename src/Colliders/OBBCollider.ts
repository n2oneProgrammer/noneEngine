import Vector3 from "../math/Vector3.js";
import {Matrix3x3} from "../math/Matrix.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import {overlapOnAxisOBBOBB} from "../math/Interval.js";
import PlaneCollider from "./PlaneCollider.js";

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

    isCollideWithOBB(obb: OBBCollider) {
        let o1 = this.orientation;
        let o2 = this.orientation;
        let tests = [
            new Vector3([o1.get(0, 0), o1.get(0, 1), o1.get(0, 2)]),
            new Vector3([o1.get(1, 0), o1.get(1, 1), o1.get(1, 2)]),
            new Vector3([o1.get(2, 0), o1.get(2, 1), o1.get(2, 2)]),
            new Vector3([o2.get(0, 0), o2.get(0, 1), o2.get(0, 2)]),
            new Vector3([o2.get(1, 0), o2.get(1, 1), o2.get(1, 2)]),
            new Vector3([o2.get(2, 0), o2.get(2, 1), o2.get(2, 2)])
        ];
        for (let i = 0; i < 3; i++) {
            tests.push(tests[i], tests[0]);
            tests.push(tests[i], tests[1]);
            tests.push(tests[i], tests[2]);
        }
        for (let i = 0; i < 15; i++) {
            if (!overlapOnAxisOBBOBB(this, obb, tests[i])) {
                return false;
            }
        }
        return true;
    }

    isCollideWithPlane(plane: PlaneCollider) {
        let o = this.orientation;
        let rot = [
            new Vector3([o.get(0, 0), o.get(0, 1), o.get(0, 2)]),
            new Vector3([o.get(1, 0), o.get(1, 1), o.get(1, 2)]),
            new Vector3([o.get(2, 0), o.get(2, 1), o.get(2, 2)]),
        ];
        let normal = plane.normal;
        let pLen = this.halfSize.x * Math.abs(normal.dot(rot[0])) +
            this.halfSize.y * Math.abs(normal.dot(rot[1])) +
            this.halfSize.z * Math.abs(normal.dot(rot[2]));
        let dot = plane.normal.dot(this.origin);
        let dist = dot - plane.distance;
        return Math.abs(dist) <= pLen;
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