// Get today's date in yyyy-MM-dd format
var today = new GlideDate();
today.setDisplayValue(gs.nowDate());

// Build the GlideRecord query
var gr = new GlideRecord('sn_dpr_model_release');

// Add query to match only today's date
gr.addEncodedQuery('planned_start_dateONToday@javascript:gs.beginningOfToday()@javascript:gs.endOfToday()');

gr.query();

while (gr.next()) {
    gs.print('Matched Record: ' + gr.getDisplayValue('number') + ' | Planned Start Date: ' + gr.getDisplayValue('planned_start_date'));
}
