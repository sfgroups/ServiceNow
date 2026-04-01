(function executeRule(current, previous /*null when async*/) {

    // 1. Get the table name dynamically from the current object
    var tableName = current.getTableName();

    // 2. Check if the number assigned already exists in this specific table
    var grCheck = new GlideRecord(tableName);
    grCheck.addQuery('number', current.number);
    grCheck.query();

    if (grCheck.hasNext()) {
        // 3. If it exists, get the next valid number from sys_number_counter
        var newNumber = NumberManager.getNextObjNumberPadded(current);
        
        // 4. Assign the fresh number to the record
        current.number = newNumber;
    }

})(current, previous);
