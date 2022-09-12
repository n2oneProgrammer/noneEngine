import MeshRenderComponent, {IMeshRenderComponent} from "../MeshRenderComponent.js";
import Vector3 from "../../../math/Vector3.js";

export interface ICubeMeshRenderComponent {
    size: Vector3
}

export default class CubeMeshRenderComponent extends MeshRenderComponent {
    private _size: Vector3;

    constructor(params: IMeshRenderComponent & ICubeMeshRenderComponent) {
        super(params);
        let {size} = params;
        this._size = Vector3.zero;
        this.size = size;

    }

    //getters and setters

    get size(): Vector3 {
        return this._size;
    }

    set size(value: Vector3) {
        this._size = value;
        this.vertexes = [];
        this.vertexes.push(new Vector3([value.x / 2, value.y / 2, value.z / 2]));
        this.vertexes.push(new Vector3([-value.x / 2, value.y / 2, value.z / 2]));

        this.vertexes.push(new Vector3([-value.x / 2, -value.y / 2, value.z / 2]));
        this.vertexes.push(new Vector3([value.x / 2, -value.y / 2, value.z / 2]));

        this.vertexes.push(new Vector3([value.x / 2, value.y / 2, -value.z / 2]));
        this.vertexes.push(new Vector3([-value.x / 2, value.y / 2, -value.z / 2]));

        this.vertexes.push(new Vector3([-value.x / 2, -value.y / 2, -value.z / 2]));
        this.vertexes.push(new Vector3([value.x / 2, -value.y / 2, -value.z / 2]));

        this.triangles = [];
        this.triangles.push([0, 1, 2]);
        this.triangles.push([0, 2, 3]);
        this.triangles.push([4, 0, 3]);
        this.triangles.push([4, 3, 7]);
        this.triangles.push([5, 4, 7]);
        this.triangles.push([5, 7, 6]);
        this.triangles.push([1, 5, 6]);
        this.triangles.push([1, 6, 2]);
        this.triangles.push([4, 5, 1]);
        this.triangles.push([4, 1, 0]);
        this.triangles.push([2, 6, 7]);
        this.triangles.push([2, 7, 3]);
    }
}
