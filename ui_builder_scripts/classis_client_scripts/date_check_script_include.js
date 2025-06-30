// Name: GetFutureDateValidator
// Accessible from client: true
// Application scope: your scoped app

var GetFutureDateValidator = Class.create();
GetFutureDateValidator.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    isFutureDate: function() {
        var dateStr = this.getParameter('sysparm_date');
        var inputDate = new GlideDateTime(dateStr);
        var now = new GlideDateTime();

        return inputDate.compareTo(now) >= 0; // true if today or future
    }

});
