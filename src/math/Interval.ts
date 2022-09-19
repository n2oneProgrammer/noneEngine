import AABBCollider from "../Colliders/AABBCollider.js";
import OBBCollider from "../Colliders/OBBCollider.js";
import Vector3 from "./Vector3.js";

export const overlapOnAxisAABBOBB = (aabb: AABBCollider, obb: OBBCollider, axis: Vector3): boolean => {
    let a = Interval.getIntervalAABB(aabb, axis);
    let b = Interval.getIntervalOBB(obb, axis);
    return ((b.min <= a.max) && (a.min <= b.max));
};
export const overlapOnAxisOBBOBB = (obb1: OBBCollider, obb2: OBBCollider, axis: Vector3): boolean => {
    let a = Interval.getIntervalOBB(obb1, axis);
    let b = Interval.getIntervalOBB(obb2, axis);
    return ((b.min <= a.max) && (a.min <= b.max));
};
export default class Interval {
    public min: number = 0;
    public max: number = 0;

    static getIntervalAABB(aabb: AABBCollider, axis: Vector3): Interval {
        let min = aabb.getMin();
        let max = aabb.getMax();
        let vertex = [
            new Vector3([min.x, max.y, max.z]),
            new Vector3([min.x, max.y, min.z]),
            new Vector3([min.x, min.y, max.z]),
            new Vector3([min.x, min.y, min.z]),
            new Vector3([max.x, max.y, max.z]),
            new Vector3([max.x, max.y, min.z]),
            new Vector3([max.x, min.y, max.z]),
            new Vector3([max.x, min.y, min.z]),
        ];
        let result = new Interval();
        result.min = result.max = axis.dot(vertex[0]);
        for (let i = 1; i < 8; i++) {
            let projection = axis.dot(vertex[i]);
            result.min = projection < result.min ? projection : result.min;
            result.max = projection > result.max ? projection : result.max;
        }
        return result
    }

    static getIntervalOBB(obb: OBBCollider, axis: Vector3): Interval {
        let C = obb.origin;
        let E = obb.halfSize;
        let o = obb.orientation;
        let A = [
            new Vector3([o.get(0, 0), o.get(0, 1), o.get(0, 2)]),
            new Vector3([o.get(1, 0), o.get(1, 1), o.get(1, 2)]),
            new Vector3([o.get(2, 0), o.get(2, 1), o.get(2, 2)])
        ];
        let vertex = [
            C.add(A[0].mul(E.x)).add(A[1].mul(E.y)).add(A[2].mul(E.z)),
            C.sub(A[0].mul(E.x)).add(A[1].mul(E.y)).add(A[2].mul(E.z)),
            C.add(A[0].mul(E.x)).sub(A[1].mul(E.y)).add(A[2].mul(E.z)),
            C.add(A[0].mul(E.x)).add(A[1].mul(E.y)).sub(A[2].mul(E.z)),
            C.sub(A[0].mul(E.x)).sub(A[1].mul(E.y)).sub(A[2].mul(E.z)),
            C.add(A[0].mul(E.x)).sub(A[1].mul(E.y)).sub(A[2].mul(E.z)),
            C.sub(A[0].mul(E.x)).add(A[1].mul(E.y)).sub(A[2].mul(E.z)),
            C.sub(A[0].mul(E.x)).sub(A[1].mul(E.y)).add(A[2].mul(E.z)),
        ];
        let result = new Interval();
        result.min = result.max = axis.dot(vertex[0]);
        for (let i = 1; i < 8; i++) {
            let projection = axis.dot(vertex[i]);
            result.min = projection < result.min ? projection : result.min;
            result.max = projection > result.max ? projection : result.max;
        }
        return result
    }
}