// This code uses standard JavaScript methods compatible with ServiceNow.

var genericUserObject = {
    userName: "ItilUser123",
    role: "itil",
    location: "Atlanta",
    active: true
};

// Use Object.keys() to get an array of field names
var fieldNames = Object.keys(genericUserObject);

gs.info("--- Listing Fields for genericUserObject ---");

// Iterate through the array using forEach
fieldNames.forEach(function(name) {
    var value = genericUserObject[name];
    gs.info("Field Name: " + name + ", Value: " + value);
});

// Alternative using a for...in loop with hasOwnProperty check:

for (var fieldName in genericUserObject) {
    if (genericUserObject.hasOwnProperty(fieldName)) {
        // gs.info("Field Name using for...in: " + fieldName);
    }
}
