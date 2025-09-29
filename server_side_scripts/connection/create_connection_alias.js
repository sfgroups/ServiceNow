// Create a new record in basic_auth_credentials
var basicAuthCred = new GlideRecord('basic_auth_credentials');
basicAuthCred.initialize();
basicAuthCred.name = 'MyBasicAuthCredential'; // Credential name
basicAuthCred.username = 'your_username'; // Basic Auth username
basicAuthCred.password = 'your_password'; // Basic Auth password
basicAuthCred.comment = 'This is a Basic Auth credential for API integration'; // Optional description

// Insert the record
basicAuthCred.insert();

var aliasGR = new GlideRecord('sys_alias');
// Initialize a new record
aliasGR.initialize();
// Set field values
aliasGR.name = 'my_custom_alias';         // Set the alias name
// Insert the record into the table
aliasGR.setValue('type', 'connection');     
var aliasSysId = aliasGR.insert();
if (aliasSysId) {
    gs.info('Alias record created successfully with Sys ID: ' + aliasSysId);
} else {
    gs.error('Failed to create alias record');
}