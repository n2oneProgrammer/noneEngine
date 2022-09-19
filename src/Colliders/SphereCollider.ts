import Vector3 from "../math/Vector3.js";
import ColliderComponent from "./ColliderComponent.js";
import {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import AABBCollider from "./AABBCollider.js";
import PointCollider from "./PointCollider.js";
import OBBCollider from "./OBBCollider.js";
import PlaneCollider from "./PlaneCollider.js";

export interface ISphere {
    position: Vector3;
    radius: number;
}

export default class SphereCollider extends ColliderComponent {
    private _position: Vector3;
    private _radius: number;

    constructor(params: ISphere | undefined) {
        super();
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

    isCollideWithSphere(sphere: SphereCollider): boolean {
        let sumRadius = this.radius + sphere.radius;
        let distanceSq = this.position.sub(sphere.position).lengthSquare();
        return distanceSq < sumRadius * sumRadius;
    }

    isCollideWithAABB(aabb: AABBCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointInAABB(aabb);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }

    isCollideWithOBB(obb: OBBCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointInOBB(obb);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }

    isCollideWithPlane(plane: PlaneCollider): boolean {
        let closestPoint = new PointCollider(this.position).closestPointOnPlane(plane);
        let distSq = this.position.sub(closestPoint).lengthSquare();
        let radiusSq = this.radius * this.radius;
        return distSq < radiusSq;
    }


    //getters and setters

    get position(): Vector3 {
        return this._position;
    }

    get radius(): number {
        return this._radius;
    }
}