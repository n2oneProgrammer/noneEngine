import Scene from "./3dEngine/Scene.js";
import Model from "./3dEngine/Model.js";
import CameraComponent from "./3dEngine/Components/CameraComponent.js";
import CubeMeshRenderComponent from "./3dEngine/Components/MeshRender/CubeMeshRenderComponent.js";
import Vector3 from "./math/Vector3.js";
import Color from "./math/Color.js";
import Matrix from "./math/Matrix.js";

let m1 = new Matrix([0, 1, 2, 3]);
let m2 = new Matrix([[0], [1], [2], [3]]);
// let m3 = new Matrix([[0, 1], [1, 1], [2, 1], [3, 1]]);

console.log(m1);
console.log(m2.mul(m1).mul(m2));
let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let scene = new Scene(canvas);
scene.addModel(new Model({
    position: new Vector3([0, 0, -20]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new CameraComponent({
    viewportFov: 90,
    viewportRatio: canvas.width / canvas.height,
    viewportNear: 1
})));
for (let i = -15; i < 15; i++) {
    for (let j = -15; j < 15; j++) {
        scene.addModel(new Model({
            scale: new Vector3([1, 1, 1]),
            position: new Vector3([i, j, 10]),
            rotation: new Vector3([0, 0, 0])
        }).addComponent(new CubeMeshRenderComponent({
            color: Color.randomColor(),
            size: new Vector3([1, 1, 1])
        })));
    }
}
let fpsCounter = document.getElementById("fps");

scene.start((deltaTime) => {
    if (fpsCounter != null)
        fpsCounter.innerText = (Math.floor(1 / deltaTime * 100) / 100) + " fps";
});
