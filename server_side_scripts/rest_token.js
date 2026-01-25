// 1. Get the credential record by sys_id (replace with your 'hasicred' sys_id)
var credSysId = "YOUR_HASICRED_SYS_ID"; 
var provider = new sn_cc.StandardCredentialsProvider();
var credential = provider.getCredentialByID(credSysId);

// 2. Extract role_id and secret_id from the credential object
// Basic Auth stores these in 'user_name' and 'password' attributes
var roleId = credential.getAttribute("user_name");
var secretId = credential.getAttribute("password");

if (roleId && secretId) {
    // 3. Prepare the REST call to HashiCorp Vault
    var vaultAddr = "https://your-vault-instance:8200";
    var request = new sn_ws.RESTMessageV2();
    request.setEndpoint(vaultAddr + "/v1/auth/approle/login");
    request.setHttpMethod("POST");
    request.setRequestHeader("Content-Type", "application/json");

    var body = {
        "role_id": roleId,
        "secret_id": secretId
    };
    request.setRequestBody(JSON.stringify(body));

    // 4. Execute and parse the response
    var response = request.execute();
    var responseBody = response.getBody();
    var httpStatus = response.getStatusCode();

    if (httpStatus === 200) {
        var parsedData = JSON.parse(responseBody);
        var vaultToken = parsedData.auth.client_token;
        gs.info("Successfully retrieved Vault Token: " + vaultToken);
    } else {
        gs.error("Vault authentication failed. Status: " + httpStatus + ", Error: " + responseBody);
    }
} else {
    gs.error("Could not retrieve credentials for sys_id: " + credSysId);
}
