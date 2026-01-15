```
1. Modify the UI Action Record
Go to the UI Action record for your custom action and navigate to the Workspace section:
Workspace Form Button: Ensure this is Checked.
Workspace Form Menu: Ensure this is Unchecked. If this is checked, the system often defaults it to the overflow menu.
Format for Configurable Workspace: Ensure this is Checked to ensure it is properly registered for modern workspace experiences. 
```

🔑 Key Point (Important)

ACLs do NOT control field read-only behavior in the UI.
They control whether data can be written to the database.

So:

❌ Field may still look editable

✅ Save will fail or silently not update (depending on client behavior)

That’s why your field is not displaying as read-only, even though the Write ACL exists.

🧪 How to Verify ACL Is Working

Test via Background Script as helpdesk user:

var gr = new GlideRecord('sn_dpr_workspace_ea_assessment');
gr.get('SYS_ID_HERE');
gr.setValue('some_field', 'test');
gr.update();  // ❌ should fail or not update


If it fails → ACL is correct ✅

🚨 Why ServiceNow Works This Way
Layer	Purpose
ACL	Security (DB-level)
UI Policy	UX (Read-only, visible, mandatory)
Client Script	Advanced UI logic