import Scene from "./3dEngine/Scene.js";
import Model from "./3dEngine/Model.js";
import CameraComponent from "./3dEngine/Components/CameraComponent.js";
import Vector3 from "./math/Vector3.js";
import ObjLoader, {FileLoader} from "./3dEngine/Tools/ObjImporter.js";
import MeshRenderComponent from "./3dEngine/Components/MeshRenderComponent.js";
import RotateAroundComponent from "./TestingComponents/RotateAroundComponent.js";
import Color from "./math/Color.js";
import RigidbodyComponent from "./Physic/RigidbodyComponent.js";
import SphereCollider from "./Colliders/SphereCollider.js";


const cube = new ObjLoader(await FileLoader.load("/cube.obj")).parse();

let canvas = <HTMLCanvasElement>document.getElementById("canvas");
let scene = new Scene(canvas);
let camera = new Model({
    position: new Vector3([0, 10, -20]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new CameraComponent({
    viewportFov: 90,
    viewportRatio: canvas.width / canvas.height,
    viewportNear: 1
})).addComponent(new RotateAroundComponent(10, 0.5));
scene.addModel(camera);
for (let i = -15; i < 15; i++) {
    for (let j = -15; j < 15; j++) {
        scene.addModel(new Model({
            scale: new Vector3([1, 1, 1]),
            position: new Vector3([i, 0, j]),
            rotation: new Vector3([0, 0, 0])
        }).addComponent(new MeshRenderComponent({
            mesh: cube,
            color: Color.randomColor()
        })));
    }
}
let obj = new Model({
    scale: new Vector3([1, 1, 1]),
    position: new Vector3([0, 10, 0]),
    rotation: new Vector3([0, 0, 0])
}).addComponent(new MeshRenderComponent({
    mesh: cube,
    color: Color.randomColor()
})).addComponent(new RigidbodyComponent({mass: 10}))
    .addComponent(new SphereCollider({
        position: Vector3.zero,
        radius: 1
    }));
scene.addModel(obj);
console.log(scene);
let fpsCounter = document.getElementById("fps");
// camera.rotation = Quaternion.lookAt(camera.position,Vector3.zero);
scene.start((deltaTime) => {
    if (fpsCounter != null)
        fpsCounter.innerText = (Math.floor(1 / deltaTime * 100) / 100) + " fps";
});
