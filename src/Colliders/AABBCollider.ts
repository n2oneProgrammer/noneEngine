import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import OBBCollider from "./OBBCollider.js";
import {overlapOnAxisAABBOBB} from "../math/Interval.js";
import PlaneCollider from "./PlaneCollider.js";

export interface IAABB {
    origin: Vector3;
    size: Vector3;
    register?: boolean;
}

export default class AABBCollider extends ColliderComponent {
    private _position: Vector3;
    private _halfSize: Vector3;

    constructor(params: IAABB | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params == undefined) {
            this._position = Vector3.zero;
            this._halfSize = Vector3.one.mul(1 / 2);
        } else {
            this._position = params.origin;
            this._halfSize = params.size.mul(1 / 2);
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    public isCollideWithAABB(aabb: AABBCollider): boolean {
        let aMin = this.getMin();
        let aMax = this.getMax();
        let bMin = aabb.getMin();
        let bMax = aabb.getMax();

        return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
            (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
            (aMin.z <= bMax.z && aMax.z >= bMin.z);
    }

    public isCollideWithOBB(obb: OBBCollider): boolean {
        let o = obb.orientation;
        let tests = [
            new Vector3([1, 0, 0]),
            new Vector3([0, 1, 0]),
            new Vector3([0, 0, 1]),
            new Vector3([o.get(0, 0), o.get(0, 1), o.get(0, 2)]),
            new Vector3([o.get(1, 0), o.get(1, 1), o.get(1, 2)]),
            new Vector3([o.get(2, 0), o.get(2, 1), o.get(2, 2)]),
        ];
        for (let i = 0; i < 3; i++) {
            tests.push(tests[i].cross(tests[0]));
            tests.push(tests[i].cross(tests[1]));
            tests.push(tests[i].cross(tests[2]));
        }
        for (let i = 0; i < 15; i++) {
            if (!overlapOnAxisAABBOBB(this, obb, tests[i])) {
                return false;
            }
        }
        return true;
    }

    isCollideWithPlane(plane: PlaneCollider) {
        let pLen = this.halfSize.x * Math.abs(plane.normal.x) +
            this.halfSize.y * Math.abs(plane.normal.y) +
            this.halfSize.z * Math.abs(plane.normal.z);
        let dot = plane.normal.dot(this.position);
        let dist = dot - plane.distance;
        return Math.abs(dist) <= pLen;
    }

    getMin(): Vector3 {
        let p1 = this.position.add(this.halfSize);
        let p2 = this.position.sub(this.halfSize);
        return new Vector3([Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.min(p1.z, p2.z)]);
    }

    getMax(): Vector3 {
        let p1 = this.position.add(this.halfSize);
        let p2 = this.position.sub(this.halfSize);
        return new Vector3([Math.max(p1.x, p2.x), Math.max(p1.y, p2.y), Math.max(p1.z, p2.z)]);
    }

    static fromMinMax(min: Vector3, max: Vector3): AABBCollider {
        return new AABBCollider({
            origin: min.add(max).mul(1 / 2),
            size: max.sub(min)
        })
    }

    //getters and setters

    get position(): Vector3 {
        if (this.modelOwner == null)
            return this._position;
        return this.modelOwner.position.add(this._position);
    }

    get halfSize(): Vector3 {
        if (this.modelOwner == null)
            return this._halfSize;
        return new Vector3([
            this.modelOwner.scale.x * this._halfSize.x,
            this.modelOwner.scale.y * this._halfSize.y,
            this.modelOwner.scale.z * this._halfSize.z
        ])
    }
}