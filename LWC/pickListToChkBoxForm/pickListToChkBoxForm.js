import { LightningElement, api, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CASE_OBJECT from '@salesforce/schema/Contact';
import ORIGINFIELD from '@salesforce/schema/Case.Origin';


export default class PickListToChkBoxForm extends NavigationMixin(LightningElement) {
    @api recordId;
    @track fields = {};
    @track originValues;
    @track value;


    @wire(getObjectInfo, { objectApiName: CASE_OBJECT })
    objectInfo;

    /*wire method to get the origin picklist values */
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: ORIGINFIELD })
    originPicklistValues({
        error,
        data
    }) {
        if (data) {
            this.originValues = data.values;
            this.myValue = getFieldValue(data, ORIGINFIELD);
            let dataList = [];

            //Update all checkbox as true for new page
            for (let index = 0; index < this.originValues.length; index++) {

                let tempLst = Object.assign({}, this.originValues[index]);
                tempLst.checkedBoolean = false;
                dataList.push(tempLst);
            }
            this.originValues = dataList;
        }
    }


    /*wire method to get current record  origin value */
    @wire(getRecord, { recordId: '$recordId', fields: [ORIGINFIELD] })
    Originsss(
        { error, data }
    ) {
        let dataList = [];
        if (data && this.originValues.length !== 0 && this.recordId !== undefined) {
            this.myValue = getFieldValue(data, ORIGINFIELD);

            for (let index = 0; index < this.originValues.length; index++) {
                
                //Update Appropriate checkbox as true for edit page
                let tempLst = Object.assign({}, this.originValues[index]);
                if (this.myValue === tempLst.value) {
                    tempLst.checkedBoolean = true;
                }
                else {
                    tempLst.checkedBoolean = false;
                }
                dataList.push(tempLst);

            }
            this.originValues = dataList;
        }

    }
   
    /* method to get the checkbox value */
    handleChange(event) {
        this.value = event.detail.value;
    }

    /* Method to save the record */
    handleSubmit(event) {
        event.preventDefault(); // stop the form from submitting
        const fields = event.detail.fields;
        fields.Origin = this.value;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    /* Method to redirect the case standard view */
    handleSucess(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: 'Case',
                actionName: 'view'
            }
        });
        const evt = new ShowToastEvent({
            message: "case has been created sucessfully",
            variant: "success",
        });
        this.dispatchEvent(evt);
    }


}