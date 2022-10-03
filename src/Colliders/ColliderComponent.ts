import Component from "../3dEngine/Component.js";

export interface IColliderComponent {
    register?: boolean;
}

export default abstract class ColliderComponent extends Component {
    static colliders: ColliderComponent[];

    protected constructor(params: IColliderComponent) {
        super();
        if (params.register === undefined || params.register)
            ColliderComponent.colliders.push(this);
    }


}