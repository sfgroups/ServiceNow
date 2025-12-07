
try {
    var inputs = {};
    inputs['u_asset_type'] = 'laptop'; // Choice 
    inputs['u_manufacture'] = 'hp'; // Choice 

    var dt = new sn_dt.DecisionTableAPI();
    var response = dt.getDecision('b85b1a8b8329ba103ff4ed70deaad3c5', inputs);
    gs.info(JSON.stringify(response.result_elements));

    var result_elements = response && response.result_elements;
    var outputResults = [];
    var aType = response.result_elements.u_support_group.getDisplayValue();
    gs.info("u_support_group Type Display Value: " + aType);
    gs.info("u_approval_group Type Value: " + response.result_elements["u_approval_group"].getDisplayValue());

    // Loop through all result elements dynamically
    for (var key in result_elements) {
        // Check if the current property belongs to the object itself (good practice)
        if (result_elements.hasOwnProperty(key)) {

            // --- EXCLUSION LOGIC ---
            // Check if the key is one of the fields we want to ignore
            if (key === 'sys_id' || key === 'sys_meta') {
                continue; // Skip the rest of the loop block for this specific key
            }
            // --- END EXCLUSION LOGIC ---

            // If we reach this point, the key is a field we want to print
            var displayVal = result_elements[key].getDisplayValue();
            var actualVal = result_elements[key].getValue();

            gs.info("Field Name: " + key + ", Display Value: " + displayVal + ", Actual Value (Sys ID): " + actualVal);
        }
    }

} catch (e) {
    gs.log("Couldn't run this script Error: " + e);
}
