import Scene from "./general/Scene.js";
import Model from "./general/Model.js";
import Vector3 from "./general/Vector3.js";
import CameraComponent from "./general/Components/CameraComponent.js";
import Color from "./general/Color.js";
import CubeMeshRenderComponent from "./general/Components/MeshRender/CubeMeshRenderComponent.js";
import RotateAroundComponent from "./rotateAroundComponent.js";

let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let scene = new Scene(canvas);
scene.addModel(new Model({
    position: new Vector3([0, 0, 0]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new CameraComponent({
    viewportFov: 90,
    viewportRatio: 1920 / 1080,
    viewportNear: 1
})).addComponent(new RotateAroundComponent(2)));
scene.addModel(new Model({
    scale: new Vector3([3,3,3]),
    position: new Vector3([0, 0, 10]),
    rotation: new Vector3([45, 0, 0])
}).addComponent(new CubeMeshRenderComponent({
    color: new Color([255, 0, 0, 1]),
    size: new Vector3([1, 1, 1])
})));

scene.start();