import Vector3 from "../math/Vector3.js";
import {Matrix3x3} from "../math/Matrix.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import {overlapOnAxisOBBOBB} from "../math/Interval.js";
import PlaneCollider from "./PlaneCollider.js";
import LineCollider from "./LineCollider.js";

export interface IOOB {
    position: Vector3;
    size: Vector3;
    orientation?: Matrix3x3;
    register?: boolean;
}

export default class OBBCollider extends ColliderComponent {
    private _position: Vector3;
    private _halfSize: Vector3;
    private _orientation: Matrix3x3;

    constructor(params: IOOB | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params == undefined) {
            this._position = Vector3.zero;
            this._halfSize = Vector3.one.mul(1 / 2);
            this._orientation = Matrix3x3.zero;
        } else {
            this._position = params.position;
            this._halfSize = params.size.mul(1 / 2);
            this._orientation = params.orientation || Matrix3x3.zero;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    // findCollisionFeatureOBB(obj: OBBCollider): CollisionData {
    //
    // }

    public static clipEdgesToOBB(edges: LineCollider[], obb: OBBCollider) {
        let planes = obb.getPlanes();
        let result = [];
        for (let i = 0; i < planes.length; i++) {
            for (let j = 0; j < edges.length; j++) {
                let intersection = planes[i].clip2Plane(edges[j]);
                if (intersection != null) {
                    if (intersection.isInOBB(obb)) {
                        result.push(intersection);
                    }
                }
            }
        }
        return result;
    }

    public getVertices(): Vector3[] {
        let v = [];
        let c = this.position;
        let e = this.halfSize;
        let o = this.orientation;
        let a = [
            new Vector3([o.get(0, 0), o.get(0, 1), o.get(0, 2)]),
            new Vector3([o.get(1, 0), o.get(1, 1), o.get(1, 2)]),
            new Vector3([o.get(2, 0), o.get(2, 1), o.get(2, 2)]),
        ];
        v.push(c.add(a[0].mul(e.x)).add(a[1].mul(e.y)).add(a[2].mul(e.z)));
        v.push(c.sub(a[0].mul(e.x)).add(a[1].mul(e.y)).add(a[2].mul(e.z)));
        v.push(c.add(a[0].mul(e.x)).sub(a[1].mul(e.y)).add(a[2].mul(e.z)));
        v.push(c.add(a[0].mul(e.x)).add(a[1].mul(e.y)).sub(a[2].mul(e.z)));
        v.push(c.sub(a[0].mul(e.x)).sub(a[1].mul(e.y)).sub(a[2].mul(e.z)));
        v.push(c.add(a[0].mul(e.x)).sub(a[1].mul(e.y)).sub(a[2].mul(e.z)));
        v.push(c.sub(a[0].mul(e.x)).add(a[1].mul(e.y)).sub(a[2].mul(e.z)));
        v.push(c.sub(a[0].mul(e.x)).sub(a[1].mul(e.y)).add(a[2].mul(e.z)));
        return v;
    }

    public getEdges() {
        let result: LineCollider[] = [];
        let vertices = this.getVertices();
        let index = [
            [6, 1], [6, 3], [6, 4], [2, 7], [2, 5], [2, 0],
            [0, 1], [0, 3], [7, 1], [7, 4], [4, 5], [5, 3]
        ];
        for (let j = 0; j < 12; j++) {
            result.push(new LineCollider({
                start: vertices[index[j][0]],
                end: vertices[index[j][1]],
                register: false
            }))
        }
        return result;
    }

    public getPlanes(): PlaneCollider[] {
        let c = this.position;
        let e = this.halfSize;
        let o = this.orientation;
        let a = [
            new Vector3([o.get(0, 0), o.get(0, 1), o.get(0, 2)]),
            new Vector3([o.get(1, 0), o.get(1, 1), o.get(1, 2)]),
            new Vector3([o.get(2, 0), o.get(2, 1), o.get(2, 2)]),
        ];
        let result = [];
        result.push(new PlaneCollider({normal: a[0], distance: a[0].dot(c.add(a[0].mul(e.x))), register: false}));
        result.push(new PlaneCollider({
            normal: a[0].mul(-1),
            distance: -a[0].dot(c.sub(a[0].mul(e.x))),
            register: false
        }));
        result.push(new PlaneCollider({normal: a[1], distance: a[1].dot(c.add(a[1].mul(e.y))), register: false}));
        result.push(new PlaneCollider({
            normal: a[1].mul(-1),
            distance: -a[1].dot(c.sub(a[1].mul(e.y))),
            register: false
        }));
        result.push(new PlaneCollider({normal: a[2], distance: a[2].dot(c.add(a[2].mul(e.z))), register: false}));
        result.push(new PlaneCollider({
            normal: a[2].mul(-1),
            distance: -a[2].dot(c.sub(a[2].mul(e.z))),
            register: false
        }));

        return result;
    }


    public isCollideWithOBB(obb: OBBCollider) {
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

    public isCollideWithPlane(plane: PlaneCollider) {
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
        let dot = plane.normal.dot(this.position);
        let dist = dot - plane.distance;
        return Math.abs(dist) <= pLen;
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

    get orientation(): Matrix3x3 {
        return this._orientation;
    }
}