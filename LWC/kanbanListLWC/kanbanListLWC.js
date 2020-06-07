import { LightningElement, api, wire, track } from 'lwc';
import findRecords from '@salesforce/apex/kanbanUtilityClass.findRecords';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class KanbanListLWC extends LightningElement {

    @api objectName;
    @api fieldName;
    @api searchKey;
    @api columns;
    @track data;
    @track refreshTable;
    @track dragRecordId;
    @track updateRecord;

    @wire(CurrentPageReference) pageRef;

    // retrieving the data using wire service
    @wire(findRecords, {
        searchKey: '$searchKey', objectName: '$objectName',
        searchField: '$fieldName', columns: '$columns'
    })
    relations(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.emptyList = true;
        }
    }

    constructor() {
        super();
        //register dragover event to the template
        this.template.addEventListener('dragover', this.handleDragOver.bind(this));
        this.template.addEventListener('drop', this.handleDrop.bind(this));
    }

    //method which firimng on drag of the component
    handleDragStart(event) {
        event.dataTransfer.dropEffect = 'move';
        let itemId = event.target.dataset.item;
        //fire an event to the subscribers
        fireEvent(this.pageRef, 'dropSelectedItem', itemId);

    }

    handleDragOver(event) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
    }

    handleDrop(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        event.preventDefault();

        this.updateRecord = {
            Id: this.dragRecordId,
            Status: this.template.querySelector('lightning-card').title
        };

        //To update the record 
        updateRecord({ fields: this.updateRecord })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Updated',
                        variant: 'success'
                    })
                );

                //Child to parent event to refresh all child components , after the updation of records
                const selectEvent = new CustomEvent('refresh');
                this.dispatchEvent(selectEvent);
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'There is an Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

    }

    connectedCallback() {
        // subscribe to dropSelectedItem event  
        registerListener('dropSelectedItem', this.handledropSelectedItem, this);
    }

    disconnectedCallback() {
        // unsubscribe from dropSelectedItem event
        unregisterAllListeners(this);
    }

    //method is called due to listening dropSelectedItem event
    handledropSelectedItem(accountInfo) {
        this.dragRecordId = accountInfo;
    }

    @api
    refreshMethod() {
        //To refrsh the list using refreshapex
        return refreshApex(this.refreshTable);
    }
}