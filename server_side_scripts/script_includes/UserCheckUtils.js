var UserCheckUtils = Class.create();
UserCheckUtils.prototype = {
    initialize: function() {},

    /**
     * Checks if a user is in a comma-separated list field on a referenced record.
     * @param {string} userSysId - The sys_id of the user to check (usually gs.getUserID()).
     * @param {GlideRecord} record - The current record (e.g., eata record).
     * @param {string} refFieldName - The name of the reference field to the scope table.
     * @param {string} listFieldName - The name of the list field on the scope table.
     * @return {boolean}
     */
    isUserInReferencedList: function(userSysId, record, refFieldName, listFieldName) {
        if (!record[refFieldName]) return false;

        var refGR = record[refFieldName].getRefRecord();
        if (refGR.isValidRecord()) {
            var listValue = refGR.getValue(listFieldName) || "";
            // Check if user ID exists in the comma-separated string
            return listValue.indexOf(userSysId) > -1;
        }
        return false;
    },

    type: 'UserCheckUtils'
};


(function executeRule(current, previous /*null when async*/) {
    var utils = new UserCheckUtils();
    
    // Replace 'scope' with your reference field and 'assigned_list' with your list field
    g_scratchpad.isUserAuthorized = utils.isUserInReferencedList(
        gs.getUserID(), 
        current, 
        'scope', 
        'assigned_list'
    );
})(current, previous);


function onCondition() {
    if (g_scratchpad.isUserAuthorized === true) {
        g_form.setReadOnly('some_field', false);
        g_form.setVisible('restricted_section', true);
    }
}
