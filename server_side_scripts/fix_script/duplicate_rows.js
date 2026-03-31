(function() {
    var tables = ['x_your_scope_table_1', 'x_your_scope_table_2']; // Add your tables here

    tables.forEach(function(tableName) {
        gs.info('--- Processing table: ' + tableName + ' ---');

        // 1. Find duplicate numbers using GlideAggregate
        var ga = new GlideAggregate(tableName);
        ga.addAggregate('COUNT', 'number');
        ga.groupBy('number');
        ga.addHaving('COUNT', '>', 1);
        ga.query();

        var duplicateFound = false;
        while (ga.next()) {
            duplicateFound = true;
            var duplicateNum = ga.getValue('number');
            var count = ga.getAggregate('COUNT', 'number');
            gs.info('Found duplicate number: ' + duplicateNum + ' (Count: ' + count + ')');

            // 2. Fix Duplicates: Keep the oldest record, renumber the rest
            var gr = new GlideRecord(tableName);
            gr.addQuery('number', duplicateNum);
            gr.orderBy('sys_created_on'); // Keep the original record
            gr.query();
            
            if (gr.next()) {
                // Skip the first (oldest) record
                while (gr.next()) {
                    var nm = new NumberManager(tableName);
                    var newNum = nm.getNextObjNumberPadded();
                    
                    gr.setValue('number', newNum);
                    gr.setWorkflow(false); // Prevents business rules from triggering
                    gr.update();
                    gs.info('Updated duplicate record ' + gr.getUniqueValue() + ' to new number: ' + newNum);
                }
            }
        }

        if (!duplicateFound) {
            gs.info('No duplicate numbers found in ' + tableName);
        }

        // 3. Sync sys_number sequence with the actual MAX number in the table
        var maxGr = new GlideRecord(tableName);
        maxGr.orderByDesc('number');
        maxGr.setLimit(1);
        maxGr.query();

        if (maxGr.next()) {
            var currentMax = maxGr.getValue('number');
            var numericPart = parseInt(currentMax.replace(/\D/g, ''), 10);
            var nextSequence = numericPart + 1;

            var sysNum = new GlideRecord('sys_number');
            sysNum.addQuery('category', tableName);
            sysNum.query();

            if (sysNum.next()) {
                var existingSeq = parseInt(sysNum.getValue('number'), 10);
                if (nextSequence > existingSeq) {
                    sysNum.setValue('number', nextSequence);
                    sysNum.update();
                    gs.info('Updated sys_number sequence for ' + tableName + ' to: ' + nextSequence);
                }
            }
        }
    });
})();
