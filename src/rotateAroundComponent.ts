import Component, {IStartParams, IUpdateParams} from "./3dEngine/Component.js";
import Quaternion from "./3dEngine/Quaternion.js";
import Vector3 from "./3dEngine/Vector3.js";

export default class RotateAroundComponent extends Component {
    private speed: number;
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
        console.log(this.rotation.y * 180 / Math.PI % 360);
    }

}