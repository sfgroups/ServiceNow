// Get the result set from the Lookup Records activity
var records = activity.result; // or use workflow.scratchpad if configured that way

var sysIds = [];
while (records.next()) {
    sysIds.push(records.getValue('sys_id'));
}

// Join sys_ids with commas
var combinedSysIds = sysIds.join(',');

// Save to a workflow scratchpad variable for use in later steps
workflow.scratchpad.combinedSysIds = combinedSysIds;
