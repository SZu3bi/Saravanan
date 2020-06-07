import { LightningElement } from 'lwc';

export default class KanbanViewLWC extends LightningElement {

    refreshComp() {
        this.template.querySelector(".New").refreshMethod();
        this.template.querySelector(".Working").refreshMethod();
        this.template.querySelector(".Closed").refreshMethod();
    }
}