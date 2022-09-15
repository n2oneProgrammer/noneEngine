import Component, {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";
import Quaternion from "../math/Quaternion.js";

export default class RotateComponent extends Component {
    private readonly speed: number;
    private rotation: Vector3;

    constructor(speed: number = 2) {
        super();
        this.rotation = Vector3.zero;
        this.speed = speed;
    }

    start({}: IStartParams): void {
        console.log("INIT ROTATION")
    }

    update({deltaTime}: IUpdateParams): void {
        if (this.modelOwner == null) return;
        this.modelOwner.rotation = Quaternion.setFromEuler(this.rotation);
        this.rotation = this.rotation.add(new Vector3([0, this.speed * deltaTime, 0]));
    }
}
