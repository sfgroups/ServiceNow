(function(inputs, outputs) {
    // 'inputs' here contains the outputs from the mapped Data Collector
    // Referenced as: inputs.<data_collector_variable_name>.<output_name>
    
    var scanData = inputs.security_scan_data;
    var criticalCount = scanData.critical_vulnerabilities;
    var status = scanData.scan_status;

    // Logic to determine policy compliance
    if (status === 'completed' && criticalCount === 0) {
        outputs.compliant = true;
        outputs.result_message = "Security check passed: 0 critical vulnerabilities found.";
    } else {
        outputs.compliant = false;
        outputs.result_message = "Security check failed: Found " + criticalCount + " critical vulnerabilities.";
    }
})(inputs, outputs);
