var choices = new GlideRecord('sys_choice');
choices.addQuery('name', 'task'); // Or your child table
choices.addQuery('element', 'state');
choices.orderBy('value');
choices.query();
while (choices.next()) {
    gs.info('Value: ' + choices.value + ' - Label: ' + choices.label);
}
