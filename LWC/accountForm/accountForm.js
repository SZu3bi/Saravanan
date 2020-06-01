import { LightningElement, track, api } from 'lwc';

export default class AccountForm extends LightningElement {

    @track fields = {};

    @api handleSubmit() {
        this.template.querySelector('lightning-record-edit-form').submit(this.fields);
    }

    handleNameChange(event) {
        this.fields.Name = event.target.value;
    }

    handleSucess(event) {
        const accountId = event.detail.id;
        const selectEvent = new CustomEvent('accountid', {
            detail: accountId
        });
        this.dispatchEvent(selectEvent);
    }
}