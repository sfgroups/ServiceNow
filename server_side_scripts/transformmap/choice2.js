(function transformEntry(source) {
    var displayValue = source.u_status.toString().trim();
    var sysChoice = new GlideRecord('sys_choice');

    sysChoice.addQuery('name', 'u_my_table'); // target table name
    sysChoice.addQuery('element', 'u_status'); // target field name
    sysChoice.addQuery('label', displayValue);
    sysChoice.query();

    if (sysChoice.next()) {
        return sysChoice.value.toString();
    } else {
        gs.warn("Choice value not found for label: " + displayValue);
        return ''; // or default value
    }
})(source);
