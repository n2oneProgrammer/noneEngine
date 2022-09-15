import Component, {IStartParams, IUpdateParams} from "../3dEngine/Component.js";
import Vector3 from "../math/Vector3.js";
import Quaternion from "../math/Quaternion.js";

export default class RotateAroundComponent extends Component {
    private readonly radius: number;
    private readonly speed: number;
    private angle: number;

    constructor(radius: number = 10, speed: number = 2) {
        super();
        this.angle = 0;
        this.radius = radius;
        this.speed = speed;
    }

    start({}: IStartParams): void {
        console.log("INIT ROTATION")
    }

    update({deltaTime}: IUpdateParams): void {
        if (this.modelOwner == null) return;
        this.modelOwner.position = new Vector3([
            Math.cos(this.angle) * this.radius,
            this.modelOwner.position.y,
            Math.sin(this.angle) * this.radius
        ]);
        this.angle += this.speed * deltaTime;
        this.modelOwner.rotation = Quaternion.lookAt(this.modelOwner.position, new Vector3([0, 0, 0]))
    }
}
