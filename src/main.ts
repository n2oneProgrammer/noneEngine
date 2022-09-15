import Scene from "./3dEngine/Scene.js";
import Model from "./3dEngine/Model.js";
import CameraComponent from "./3dEngine/Components/CameraComponent.js";
import Vector3 from "./math/Vector3.js";
import ObjLoader, {FileLoader} from "./3dEngine/Tools/ObjImporter.js";
import MeshRenderComponent from "./3dEngine/Components/MeshRenderComponent.js";
import Color from "./math/Color.js";


const cube = new ObjLoader(await FileLoader.load("/cube.obj")).parse();

let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let scene = new Scene(canvas);
let camera = new Model({
    position: new Vector3([2, 0, -2]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new CameraComponent({
    viewportFov: 90,
    viewportRatio: canvas.width / canvas.height,
    viewportNear: 1
}));
scene.addModel(camera);
scene.addModel(new Model({
    scale: new Vector3([1, 1, 1]),
    position: new Vector3([0, 0, 0]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new MeshRenderComponent({
    mesh: cube,
    color: Color.randomColor()
})));

let fpsCounter = document.getElementById("fps");
// camera.rotation = Quaternion.lookAt(camera.position,Vector3.zero);
scene.start((deltaTime) => {
    if (fpsCounter != null)
        fpsCounter.innerText = (Math.floor(1 / deltaTime * 100) / 100) + " fps";
});
