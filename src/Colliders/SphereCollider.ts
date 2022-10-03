import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import AABBCollider from "./AABBCollider.js";
import PointCollider from "./PointCollider.js";
import OBBCollider from "./OBBCollider.js";
import PlaneCollider from "./PlaneCollider.js";
import CollisionData from "../Physic/CollisionData.js";

export interface ISphere {
    position: Vector3;
    radius: number;
    register?: boolean;
}

export default class SphereCollider extends ColliderComponent {
    private _position: Vector3;
    private _radius: number;

    constructor(params: ISphere | undefined) {
        super({register: params === undefined ? true : params.register});
        if (params == undefined) {
            this._position = Vector3.zero;
            this._radius = 1;
        } else {
            this._position = params.position;
            this._radius = params.radius;
        }
    }

    start({}: IStartParams): void {
    }

    update({}: IUpdateParams): void {
    }

    findCollisionFeatureSphere(obj: SphereCollider): CollisionData {
        let result = new CollisionData();
        let r = this.radius + obj.radius;
        let d = obj.position.sub(this.position);
        if (d.lengthSquare() - r * r > 0 || d.lengthSquare() == 0) {
            return result;
        }
        d = d.normalize();
        result.colliding = true;
        result.normal = d;
        result.depth = Math.abs(d.length() - r) * 0.5;
        let dtp = this.radius - result.depth;
        result.contacts.push(this.position.add(d.mul(dtp)));
        return result;
    }

    public findCollisionFeatureOBB(obj: OBBCollider): CollisionData {
        let result = new CollisionData();
        let closestPoint = new PointCollider(this.position).closestPointInOBB(obj);
        let distanceSq = closestPoint.sub(this.position).lengthSquare();
        if (distanceSq > this.radius * this.radius) {
            return result;
        }
        let normal: Vector3;
        if (distanceSq == 0) {
            let mSq = closestPoint.sub(obj.position).lengthSquare();
            if (mSq == 0) {
                return result;
            }
            normal = closestPoint.sub(obj.position).normalize();
        } else {
            normal = this.position.sub(closestPoint).normalize()
        }
        let outsidePoint = this.position.sub(normal.mul(this.radius));
        let distance = closestPoint.sub(outsidePoint).length();
        result.colliding = true;
        result.contacts.push(closestPoint.add(outsidePoint.sub(closestPoint).mul(0.5)));
        result.normal = normal;
        result.depth = distance * 0.5;
        return result;
    }

    public isCollideWithSphere(sphere: SphereCollider): boolean {
        let sumRadius = this.radius + sphere.radius;
        let distanceSq = this.position.sub(sphere.position).lengthSquare();
        return distanceSq < sumRadius * sumRadius;
    }

    public isCollideWithAABB(aabb: AABBCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointInAABB(aabb);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }

    public isCollideWithOBB(obb: OBBCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointInOBB(obb);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }

    public isCollideWithPlane(plane: PlaneCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointOnPlane(plane);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }


    //getters and setters

    get position(): Vector3 {
        if (this.modelOwner == null)
            return this._position;
        return this.modelOwner.position.add(this._position);
    }

    get radius(): number {
        if (this.modelOwner == null)
            return this._radius;
        return this.modelOwner.scale.x * this.radius;
    }
}