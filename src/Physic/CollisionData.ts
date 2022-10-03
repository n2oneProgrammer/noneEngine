import Vector3 from "../math/Vector3.js";

export default class CollisionData {
    public colliding: boolean = false;
    public normal: Vector3 = new Vector3([0, 0, 1]);
    public depth: number = Number.MAX_VALUE;
    public contacts: Vector3[] = [];

    constructor() {
        this.resetCollisionManifold();
    }

    resetCollisionManifold() {
        this.colliding = false;
        this.normal = new Vector3([0, 0, 1]);
        this.depth = Number.MAX_VALUE;
        this.contacts = [];
    }

}