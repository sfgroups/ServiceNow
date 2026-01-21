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


function onClick() {
  if (!g_form.isDirty()) {
    g_form.addInfoMessage('No changes to save');
    return;
  }

  g_form.save();
   g_form.save();
  g_form.addInfoMessage('Record saved successfully');
}


