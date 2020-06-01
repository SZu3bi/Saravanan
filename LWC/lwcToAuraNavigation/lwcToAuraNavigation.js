import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class LwcToAuraNavigation extends NavigationMixin(LightningElement) {

    @api recordId;
    acntName ='Back Benchers';
    acntLocation = 'Chennai';

    navigateToAuraComponent() {
        this[NavigationMixin.Navigate]({
            "type": "standard__component",
            "attributes": {
                "componentName": "c__accountAuraComponent"
            },
            state: {
                c__recID: this.recordId,
                c__accountName: this.acntName ,
                c__accountLocation: this.acntLocation
            }
        });
    }


}