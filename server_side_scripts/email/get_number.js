(function runMailScript(current, template, email, email_action, event) {
    // Use .getDisplayValue() to ensure cross-scope compatibility
    var scopeNum = current.cl_scope.number.getDisplayValue();
    if (scopeNum) {
        template.print(scopeNum);
    }
})(current, template, email, email_action, event);
