var today = new GlideDate(); // Today with no time
var gr = new GlideRecord('sys_delegate');
gr.addQuery('delegate', '62826bf03710200044e0bfc8bcbe5df1');
gr.query();

while (gr.next()) {
    var start = new GlideDate(gr.getValue('start_date'));
    var end = new GlideDate(gr.getValue('end_date'));

    if (start.compareTo(today) <= 0 && end.compareTo(today) >= 0) {
        gs.info('Found valid delegation for today');
        // Do your logic here
    }
}
