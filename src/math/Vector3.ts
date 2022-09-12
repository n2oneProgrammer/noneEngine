interface IVector3 {
    x: number;
    y: number;
    z: number;
}

export default class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(data: IVector3 | [number, number, number]) {
        if (data instanceof Array) {
            this._x = data[0];
            this._y = data[1];
            this._z = data[2];
        } else {
            this._x = data.x;
            this._y = data.y;
            this._z = data.z;
        }
    }

    add(v: Vector3): Vector3 {
        return new Vector3([this._x + v._x, this._y + v._y, this._z + v._z]);
    }

    sub(v: Vector3) {
        return this.add(v.negative());
    }

    mul(v: Vector3 | number): Vector3 {
        if (v instanceof Vector3) {
            return new Vector3([this._x * v._x, this._y * v._y, this._z * v._z]);
        }
        return new Vector3([this._x * v, this._y * v, this._z * v]);
    }

    cross(v: Vector3): Vector3 {
        return new Vector3({
            x: this._y * v.z - this._z * v.y,
            y: this._z * v.x - this._x * v.z,
            z: this._x * v.y - this._y - v.x
        })
    }

    div(v: number) {
        if (v == 0) throw new Error("do not divide by 0");
        return new Vector3([this._x / v, this._y / v, this._z / v]);
    }

    negative(): Vector3 {
        return new Vector3([-this._x, -this._y, -this._z]);
    }

    dot(v: Vector3): number {
        return this._x * v._x + this._y * v._y + this._z * v._z;
    }

    lengthSquare(): number {
        return this._x * this._x + this._y * this._y + this._z * this._z;
    }

    copy() {
        return new Vector3([this._x, this._y, this._z]);
    }

    // getters and setters
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
    static zero = new Vector3([0, 0, 0]);

}