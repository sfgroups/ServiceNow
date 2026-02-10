(function(inputs, outputs) {
    try {
        // 1. Initialize REST message (configured in ServiceNow Outbound REST)
        var request = new sn_ws.RESTMessageV2('External_Security_Tool', 'GetScanResults');
        request.setStringParameterNoEscape('release_tag', inputs.release_tag);
        
        // 2. Execute and parse response
        var response = request.execute();
        var responseBody = response.getBody();
        var parsedData = JSON.parse(responseBody);
        
        // 3. Map external data to DPR Outputs
        outputs.critical_vulnerabilities = parsedData.critical_count;
        outputs.scan_status = parsedData.status;
        outputs.evidence_url = parsedData.report_link;

    } catch (ex) {
        // Use PaCEExecutionError to surface issues during the policy run
        throw new PaCEExecutionError("Failed to fetch evidence from external system: " + ex.message);
    }
})(inputs, outputs);
