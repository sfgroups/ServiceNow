(function execute(inputs, outputs) {
    try {
        // Initialize RESTMessage with alias + HTTP method
        var r = new sn_ws.RESTMessageV2('CountryInfoSOAP', 'post');

        // Override default endpoint if needed (optional)
        // r.setEndpoint("http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso");

        // Set request headers
        r.setRequestHeader("Content-Type", "text/xml; charset=utf-8");

        // SOAP request body
        var soapBody = '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
            '  <soap12:Body>' +
            '    <ListOfCountryNamesByName xmlns="http://www.oorsprong.org/websamples.countryinfo"/>' +
            '  </soap12:Body>' +
            '</soap12:Envelope>';

        r.setRequestBody(soapBody);

        // Execute
        var response = r.execute();
        var httpStatus = response.getStatusCode();
        var responseBody = response.getBody();

        gs.info("SOAP HTTP Status: " + httpStatus);
        gs.info("SOAP Response Body: " + responseBody);

        // Set outputs for the Flow
        outputs.httpStatus = httpStatus;
        outputs.soapResponse = responseBody;

    } catch (ex) {
        gs.error("Error during SOAP call with alias: " + ex.message);
        outputs.httpStatus = -1;
        outputs.soapResponse = "Error: " + ex.message;
    }
})(inputs, outputs);
