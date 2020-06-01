import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class NavToNewRecordWithDefaults extends NavigationMixin(LightningElement) {

    @api recordId;

    navigateToNewContactWithDefaults() {
        const defaultValues = encodeDefaultFieldValues({
            AccountId: this.recordId,
            FirstName: 'Saravanan',
            LastName: 'Rajendran',
            Email:'rcsaravananmkd@gmail.com',
            Phone:'9566725043'
        });

        console.log(defaultValues);

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
}