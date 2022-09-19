import Component from "./Component.js";
import Scene from "./Scene.js";
import Vector3 from "../math/Vector3.js";
import {Matrix3x3} from "../math/Matrix.js";

export interface IModel {
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export default class Model {
    private _position: Vector3;
    private _rotation: Matrix3x3;
    private _scale: Vector3;
    private _components: Component[];

    constructor(data: IModel | null) {
        this._position = data?.position || Vector3.zero;
        this._rotation = Matrix3x3.setFromEuler(data?.rotation || Vector3.zero);
        this._scale = data?.scale || new Vector3([1, 1, 1]);
        this._components = [];
    }

    start(scene: Scene) {
        this._components.forEach(component => component.start({scene: scene}));
    }

    update(deltaTime: number, scene: Scene) {
        this._components.forEach(component => {
            component.update({deltaTime: deltaTime, scene: scene});
        })
    }

    // getters and setters
    get scale(): Vector3 {
        return this._scale;
    }

    set scale(value: Vector3) {
        this._scale = value;
    }

    get rotation(): Matrix3x3 {
        return this._rotation;
    }

    set rotation(value: Matrix3x3) {
        this._rotation = value;
    }

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
    }

    get components(): Component[] {
        return this._components;
    }

    addComponent(component: Component): Model {
        component.modelOwner = this;
        this._components.push(component);
        return this;
    }

    removeComponent(component: Component): Model {
        this._components = this._components.filter(c => c === component);
        return this;
    }

    getComponent<T extends Component>(f: (m: Component) => boolean): T | undefined {
        return <T>this._components.find(m => f(m));
    }
}
