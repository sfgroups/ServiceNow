(function executeRule(gForm, gUser, gSNC) {
    var dateVal = gForm.getValue('end');

    var ga = new GlideAjax('GetFutureDateValidator');
    ga.addParam('sysparm_name', 'isFutureDate');
    ga.addParam('sysparm_date', dateVal);

    ga.getXMLAnswer(function(response) {
        if (response === 'false') {
            gForm.showFieldMsg('end', 'Date must be today or in the future.', 'error');
            gForm.setValue('end', '');
        }
    });
})(gForm, gUser, gSNC);
