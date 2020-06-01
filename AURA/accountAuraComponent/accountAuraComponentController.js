({
    init: function(cmp, evt) {
        var myPageRef = cmp.get("v.pageReference");
        var recordId = myPageRef.state.c__recID;
        var accountName = myPageRef.state.c__accountName;
        var accountLocation = myPageRef.state.c__accountLocation;

        cmp.set("v.recID", recordId);
        cmp.set("v.acntName", accountName);
        cmp.set("v.acntLocation", accountLocation);
        
    }
})