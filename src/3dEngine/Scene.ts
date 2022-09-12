import Model from "./Model.js";
import Canvas from "./Canvas.js";
import CameraComponent from "./Components/CameraComponent.js";

export default class Scene {
    private lastFrameTime: number = 0;
    private isStarted: boolean = false;
    private _models: Model[];
    private readonly _canvas: Canvas;
    private _mainCamera: CameraComponent | null;

    constructor(canvasDOM: HTMLCanvasElement | null) {
        this._canvas = new Canvas(canvasDOM);
        this._mainCamera = null;
        this._models = [];
    }

    start() {
        if (this.isStarted) return;
        this.isStarted = true;
        this.lastFrameTime = Date.now();
        this._models.forEach(model => model.start(this));
        requestAnimationFrame(this.update.bind(this));
    }


    update() {
        let deltaTime = (Date.now() - this.lastFrameTime) / 1000;
        this.lastFrameTime = Date.now();
        this._models.forEach(model => model.update(deltaTime, this));
        if (this.mainCamera != null) {
            this.canvas.clearCanvas();
            this.mainCamera.render(this);
        }
        requestAnimationFrame(this.update.bind(this));
    }


    // Getters and setters
    get canvas(): Canvas {
        return this._canvas;
    }

    get models(): Model[] {
        return this._models;
    }

    addModel(model: Model): Scene {
        this._models.push(model);
        model.start(this);
        return this;
    }

    removeModel(model: Model): Scene {
        this._models = this._models.filter(m => m !== model);
        return this;
    }


    get mainCamera(): CameraComponent | null {
        return this._mainCamera;
    }

    set mainCamera(value: CameraComponent | null) {
        this._mainCamera = value;
    }
}
