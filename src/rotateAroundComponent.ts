import Component, {IStartParams, IUpdateParams} from "./3dEngine/Component.js";
import Vector3 from "./math/Vector3.js";
import Quaternion from "./math/Quaternion.js";

export default class RotateAroundComponent extends Component {
    private readonly speed: number;
    private angle: number;

    constructor(speed: number = 2) {
        super();
        this.angle = 0;
        this.speed = speed;
    }

    start({}: IStartParams): void {
        console.log("INIT ROTATION")
    }

    update({deltaTime}: IUpdateParams): void {
        if (this.modelOwner == null) return;
        this.modelOwner.position = new Vector3([Math.cos(this.angle) * 40, 0, Math.sin(this.angle) * 40]);
        this.angle += deltaTime * this.speed;
        this.modelOwner.rotation = Quaternion.lookAt(this.modelOwner.position, new Vector3([0, 0, 0]));
        // this.modelOwner.rotation = Quaternion.setFromEuler(this.rotation);
        // this.rotation = this.rotation.add(new Vector3([0, this.speed * deltaTime, 0]));
        // console.log(this.rotation.y * 180 / Math.PI % 360);
    }
}
