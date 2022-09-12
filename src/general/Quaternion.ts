import Vector3 from "./Vector3.js";

export interface IQuaternion {
    x: number,
    y: number,
    z: number,
    w: number
}

export default class Quaternion {
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    constructor(data: IQuaternion | [number, number, number, number]) {
        if (data instanceof Array) {
            this._x = data[0];
            this._y = data[1];
            this._z = data[2];
            this._w = data[3];
        } else {
            this._x = data.x;
            this._y = data.y;
            this._z = data.z;
            this._w = data.w;
        }
    }

    add(q: Quaternion): Quaternion {
        return new Quaternion([this._x + q._x, this._y + q._y, this._z + q._z, this._w + q._w])
    }

    mul(v: Vector3 | Quaternion): Vector3 | Quaternion {
        if (v instanceof Vector3) {
            const ix = this.w * v.x + this.y * v.z - this.z * v.y;
            const iy = this.w * v.y + this.z * v.x - this.x * v.z;
            const iz = this.w * v.z + this.x * v.y - this.y * v.x;
            const iw = -this.x * v.x - this.y * v.y - this.z * v.z;

            return new Vector3([
                ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
                iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
                iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x]
            );
        } else {
            return new Quaternion(
                [this.x * v.w + this.w * v.x + this.y * v.z - this.z * v.y,
                    this.y * v.w + this.w * v.y + this.z * v.x - this.x * v.z,
                    this.z * v.w + this.w * v.z + this.x * v.y - this.y * v.x,
                    this.w * v.w - this.x * v.x - this.y * v.y - this.z * v.z]
            );
        }
    }

    negative() {
        return new Quaternion([-this._x, -this._y, -this._z, this._w]);
    }

    //getters and setters
    get w(): number {
        return this._w;
    }

    get z(): number {
        return this._z;
    }

    get y(): number {
        return this._y;
    }

    get x(): number {
        return this._x;
    }

    // static
    static zero = new Quaternion([0, 0, 0, 1]);

    static setFromEuler(vector: Vector3) {
        const c1 = Math.cos(vector.x / 2);
        const c2 = Math.cos(vector.y / 2);
        const c3 = Math.cos(vector.z / 2);

        const s1 = Math.sin(vector.x / 2);
        const s2 = Math.sin(vector.y / 2);
        const s3 = Math.sin(vector.z / 2);

        return new Quaternion([
                s1 * c2 * c3 + c1 * s2 * s3,
                c1 * s2 * c3 - s1 * c2 * s3,
                c1 * c2 * s3 + s1 * s2 * c3,
                c1 * c2 * c3 - s1 * s2 * s3
            ]
        );
    }


}