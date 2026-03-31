(function() {
    var tables = ['x_your_scope_table_1', 'x_your_scope_table_2', 'x_your_scope_table_3']; 
    var duplicateSummary = [];

    tables.forEach(function(tableName) {
        var ga = new GlideAggregate(tableName);
        ga.addAggregate('COUNT', 'number');
        ga.groupBy('number');
        ga.addHaving('COUNT', '>', 1);
        ga.query();

        var hasDuplicates = false;
        var duplicateCount = 0;

        while (ga.next()) {
            hasDuplicates = true;
            duplicateCount++;
        }

        if (hasDuplicates) {
            gs.info('[!] Table ' + tableName + ' HAS duplicates (' + duplicateCount + ' unique numbers duplicated).');
            duplicateSummary.push(tableName);
        } else {
            gs.info('[✓] Table ' + tableName + ' is clean.');
        }
    });

    if (duplicateSummary.length > 0) {
        gs.info('Action Required: Duplicates found in: ' + duplicateSummary.join(', '));
    } else {
        gs.info('All checked tables are unique.');
    }
})();
