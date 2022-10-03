import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";
import {Sphere} from "../3dEngine/Mesh.js";
import AABBCollider from "./AABBCollider.js";
import SphereCollider from "./SphereCollider.js";
import OBBCollider from "./OBBCollider.js";
import PlaneCollider from "./PlaneCollider.js";
import LineCollider from "./LineCollider.js";
import RayCollider from "./RayCollider.js";

export default class PointCollider extends ColliderComponent {
    private _position: Vector3;

    constructor(position: Vector3, register: boolean = true) {
        super({register: register});
        this._position = position;
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    public isInSphere(sphere: Sphere): boolean {
        let distSq = this.position.sub(sphere.center).lengthSquare();
        return sphere.radius * sphere.radius > distSq;
    }

    public closestPointInSphere(sphere: SphereCollider): Vector3 {
        let SP = this.position.sub(sphere.position);
        SP = SP.normalize();
        SP = SP.mul(sphere.radius);
        return SP.add(sphere.position);
    }

    public isInAABB(aabb: AABBCollider): boolean {
        let min = aabb.getMin();
        let max = aabb.getMax();
        if (this.position.x < min.x || this.position.y < min.y || this.position.z < min.z) {
            return false;
        }
        if (this.position.x > max.x || this.position.y > max.y || this.position.z > max.z) {
            return false;
        }
        return true;
    }

    public closestPointInAABB(aabb: AABBCollider): Vector3 {
        let min = aabb.getMin();
        let max = aabb.getMax();
        let result = new Vector3([
            this.position.x < min.x ? min.x : this.position.x,
            this.position.y < min.y ? min.y : this.position.y,
            this.position.z < min.z ? min.z : this.position.z
        ]);
        result = new Vector3([
            this.position.x > max.x ? max.x : result.x,
            this.position.y > max.y ? max.y : result.y,
            this.position.z > max.z ? max.z : result.z
        ]);
        return result;
    }

    public isInOBB(obb: OBBCollider): boolean {
        let dir = this.position.sub(obb.position);
        let nameAxis = ['x', 'y', 'z'];
        for (let i = 0; i < 3; i++) {
            const o = obb.orientation;
            let axis = new Vector3([
                o.get(i, 0),
                o.get(i, 1),
                o.get(i, 2),
            ]);
            let distance = dir.dot(axis);
            if (distance > obb.halfSize.getByName(nameAxis[i] as 'x' | 'y' | 'z')) {
                return false;
            }
            if (distance < -obb.halfSize.getByName(nameAxis[i] as 'x' | 'y' | 'z')) {
                return false;
            }
        }
        return true;
    }

    public closestPointInOBB(obb: OBBCollider): Vector3 {
        let result = obb.position;
        let dir = this.position.sub(obb.position);
        let nameAxis = ['x', 'y', 'z'];
        for (let i = 0; i < 3; i++) {
            const o = obb.orientation;
            let axis = new Vector3([
                o.get(i, 0),
                o.get(i, 1),
                o.get(i, 2),
            ]);
            let distance = dir.dot(axis);
            let halfSize = obb.halfSize.getByName(nameAxis[i] as 'x' | 'y' | 'z');
            if (distance > halfSize) {
                distance = halfSize;
            }
            if (distance < -halfSize) {
                distance = -halfSize;
            }
            result = result.add(axis.mul(distance));
        }
        return result;
    }

    public isOnPlane(plane: PlaneCollider): boolean {
        let dot = this.position.dot(plane.normal);
        return dot - plane.distance == 0;
    }

    public closestPointOnPlane(plane: PlaneCollider): Vector3 {
        let dot = this.position.dot(plane.normal);
        let distance = dot - plane.distance;
        return this.position.sub(plane.normal.mul(distance));
    }

    public isOnLIne(line: LineCollider): boolean {
        let closest = this.closestPointOnLine(line);
        let distanceSq = closest.sub(this.position).lengthSquare();
        return distanceSq == 0;
    }

    public closestPointOnLine(line: LineCollider): Vector3 {
        let lVec = line.endPoint.sub(line.startPoint);
        let t = this.position.dot(line.startPoint) / lVec.dot(lVec);

        t = Math.max(t, 0);
        t = Math.min(t, 1);
        return line.startPoint.add(lVec.mul(t));
    }

    public isOnRay(ray: RayCollider): boolean {
        if (this.position == ray.origin) {
            return true;
        }
        let norm = this.position.sub(ray.origin);
        norm = norm.normalize();
        let diff = norm.dot(ray.direction);
        return diff == 1;
    }

    public closestPointOnRay(ray: RayCollider): Vector3 {
        let t = this.position.sub(ray.origin).dot(ray.direction);
        t = Math.max(t, 0);
        return ray.origin.add(ray.direction.mul(t));
    }

    get position(): Vector3 {
        if (this.modelOwner == null)
            return this._position;
        return this.modelOwner.position.add(this._position);
    }
}