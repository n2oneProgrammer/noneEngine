import Scene from "./Scene.js";
import Model from "./Model.js";

export interface IUpdateParams {
    deltaTime: number;
    scene: Scene;
}

export interface IStartParams {
    scene: Scene;
}

export default abstract class Component {
    private _isActive: boolean = true;
    private _modelOwner: Model | null = null;


    abstract start(params: IStartParams): void;

    abstract update(params: IUpdateParams): void;

    // getter and setters
    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    get modelOwner(): Model | null {
        return this._modelOwner;
    }

    set modelOwner(value: Model | null) {
        this._modelOwner = value;
    }
}