function onChange(control, oldValue, newValue, isLoading) {
    var fieldName = 'assigned_to'; // The field we are validating and setting
    
    if (isLoading || newValue === '') {
        g_form.hideFieldMsg(fieldName);
        return;
    }

    var ga = new GlideAjax('x_your_scope.UserValidatorAjax'); 
    ga.addParam('sysparm_name', 'validateUserRecord');
    ga.addParam('sysparm_user_id', newValue);

    ga.getXMLAnswer(function(answer) {
        var result = JSON.parse(answer);
        g_form.hideFieldMsg(fieldName);

        if (result.isValid) {
            // BEST PRACTICE: Pass 3rd param (Display Value) to avoid extra sync server calls
            g_form.setValue(fieldName, result.sys_id, result.name);
        } else {
            // Invalid record: Clear and notify user
            g_form.clearValue(fieldName);
            g_form.showFieldMsg(fieldName, 'Selected user record is invalid or has no name.', 'error');
        }
    });
}
