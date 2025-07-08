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
//

var gr = new GlideRecord('sn_dpr_model_release');
gr.addNotNullQuery('planned_start_date');
gr.addQuery('planned_start_date', 'ON', todayString);
gr.addQuery('state', 'pending');
gr.query();
///
var today = "2026-07-11";  // Or use gs.nowDate() for today's date

var gr = new GlideRecord('sn_dpr_model_release');
gr.addEncodedQuery("planned_start_dateON" + today + "^state=pending");

gs.info("Running query for planned_start_date = " + today);
gr.query();

var count = 0;
while (gr.next()) {
    gs.info("Matched: " + gr.getDisplayValue('number') + " | Date: " + gr.getDisplayValue('planned_start_date'));
    count++;
}
gs.info("Total matched records: " + count);
