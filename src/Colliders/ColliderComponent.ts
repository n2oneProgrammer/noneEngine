import Component from "../3dEngine/Component.js";

export default abstract class ColliderComponent extends Component {
    static colliders: ColliderComponent[];

    protected constructor() {
        super();
        ColliderComponent.colliders.push(this);
    }


}