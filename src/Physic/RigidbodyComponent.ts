import Component, {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";

export interface IRigidbodyComponent {
    mass: number
}

export default class RigidbodyComponent extends Component {
    private readonly _mass: number;
    private _velocity: Vector3;

    constructor({mass}: IRigidbodyComponent) {
        super();
        if (mass <= 0) throw new Error("Mass must be positive");
        this._mass = mass;
        this._velocity = Vector3.zero;
    }

    start({}: IStartParams): void {
    }

    update({deltaTime}: IUpdateParams): void {
        if (this.modelOwner == null) return;
        let position = this.modelOwner.position;
        position = position.add(this._velocity.mul(deltaTime));
        this.modelOwner.position = position;
        this._velocity = this._velocity.add(new Vector3([0, -9, 0]).mul(deltaTime));
    }

    //getters and setters

    get mass(): number {
        return this._mass;
    }

    get velocity(): Vector3 {
        return this._velocity;
    }
}