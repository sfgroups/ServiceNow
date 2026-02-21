var UserValidatorAjax = Class.create();
UserValidatorAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

    validateUserRecord: function() {
        var userSysId = this.getParameter('sysparm_user_id');
        var result = { isValid: false, sys_id: "", name: "" };

        if (!userSysId) return JSON.stringify(result);

        var userGR = new GlideRecordSecure('sys_user');
        if (userGR.get(userSysId)) {
            var name = userGR.getDisplayValue();
            if (!gs.nil(name)) {
                result.isValid = true;
                result.sys_id = userSysId;
                result.name = name;
            }
        }
        return JSON.stringify(result);
    },

    type: 'UserValidatorAjax'
});
