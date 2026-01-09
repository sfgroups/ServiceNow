        function onClick(g_form) {
    // 1. Custom Validation
    if (g_form.getValue('short_description') == '') {
        g_form.addErrorMessage('Short description is required.');
        return; 
    }

    // 2. Submit using the standard Workspace Save verb
    // This will either Insert or Update depending on the record state
    g_form.submit('sysverb_ws_save'); 
}
