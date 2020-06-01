import { LightningElement, track, wire, api } from 'lwc';
//Import Apex methods
import getContatcs from '@salesforce/apex/ContactUtilities.getContacts';
import deletecontact from '@salesforce/apex/ContactUtilities.deleteContacts';
import createContact from '@salesforce/apex/ContactUtilities.addContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

// row actions
const actions = [
    { label: 'Delete', name: 'delete' }
];

// datatable columns with row actions
const columns = [
    { label: 'First Name', fieldName: 'FirstName', type: "string", sortable: true },
    { label: 'Last Name', fieldName: 'LastName', type: "string", sortable: true },
    { label: 'Email', fieldName: 'Email', type: "email", sortable: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'right'
        }
    }
];

export default class ConatctListViewWithRefreshApex extends NavigationMixin(LightningElement) {

    // reactive variable
    @api recordId;
    @track data;
    @track columns = columns;
    @track record = [];
    @track ShowModal = false;
    @track currentRecordId;
    @track isEditForm = false;
    @track showLoadingSpinner = false;
    @track newRecord = false;
    @track editRecord = false;
    @track viewRecord = false;
    @track sortBy;
    @track sortDirection;
    @track emptyList = false;
    @track error;
    @track firstName;
    @track lastName;
    @track email;


    // non-reactive variables
    refreshTable;

    // retrieving the data using wire service
    @wire(getContatcs, { sourceAccount: '$recordId' })
    relations(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.emptyList = true;
        }
    }

    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;
        // sort direction
        this.sortDirection = event.detail.sortDirection;
        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }

    sortData(fieldname, direction) {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1 : -1;
        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;

    }

    //To handle the row actions
    handleRowActions(event) {
        let actionName = event.detail.action.name;
        let row = event.detail.row;
        // eslint-disable-next-line default-case
        switch (actionName) {
            case 'delete':
                this.deleteRelations(row);
                break;
        }
    }

    //To create new record
    createNewRecord() {
        // open modal box
        this.currentRecordId = '';
        this.ShowModal = true;
        this.isEditForm = true;
        this.newRecord = true;
    }

    // handleing record edit form submit
    handleSubmit() {
        createContact({ firstName: this.firstName, lastName: this.lastName, email: this.email, acntId: this.recordId })
            .then(result => {
                this.handleSuccess();
            })
            .catch(error => {
                this.error = error.body.message;
            });
    }

    // refreshing the datatable after record edit form success
    handleSuccess() {
        // closing modal
        this.ShowModal = false;
        // showing success message
        if (this.newRecord === true) {
            this.dispatchEvent(new ShowToastEvent({
                message: 'Contact Created sucessfully',
                variant: 'success'
            }));

        }
        if (this.newRecord === false) {
            this.dispatchEvent(new ShowToastEvent({
                message: 'Contact updated sucessfully',
                variant: 'success'
            }));
        }
        return refreshApex(this.refreshTable);
    }

    //To delete the selected relations
    deleteRelations(currentRow) {
        let currentRecord = [];
        currentRecord.push(currentRow.Id);
        this.showLoadingSpinner = true;

        // calling apex class method to delete the selected contact
        deletecontact({ deleteContactIds: currentRecord })
            .then(result => {
                this.showLoadingSpinner = false;

                // showing success message
                this.dispatchEvent(new ShowToastEvent({
                    message: 'Contatact Deleted sucessfully',
                    variant: 'success'
                }));

                // refreshing table data using refresh apex
                return refreshApex(this.refreshTable);

            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    message: error.message,
                    variant: 'error'
                }));
            });
    }


    //Event to track the First Name field
    firstNameChange(event) {
        this.firstName = event.target.value;
        this.error = '';
    }

    //Event to track the last Name field
    lastNameChange(event) {
        this.lastName = event.target.value;
        this.error = '';
    }


    //Event to track the Email field
    emailChange(event) {
        this.email = event.target.value;
        this.error = '';
    }

    // closing modal box
    closeModal() {
        this.ShowModal = false;
        this.newRecord = false;
        this.editRecord = false;
        this.viewRecord = false;
        this.error = '';
    }

}