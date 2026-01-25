var PingFedDynamicAuthUtil = Class.create();
PingFedDynamicAuthUtil.prototype = {
    initialize: function() {},

    /** Main Entry Point */
    getAccessToken: function(vaultAlias, pingAlias, pfUsername) {
        try {
            var vaultToken = this._getVaultClientToken(vaultAlias);
            if (!vaultToken) return null;

            var dynamicPassword = this._getSecretFromVault(vaultAlias, vaultToken);
            if (!dynamicPassword) return null;

            return this._getPingOAuthToken(pingAlias, pfUsername, dynamicPassword);
        } catch (ex) {
            gs.error("Dynamic Auth Orchestration failed: " + ex.message);
            return null;
        }
    },

    /** 1. Get Vault Token */
    _getVaultClientToken: function(aliasId) {
        var conn = this._getConnection(aliasId);
        var request = new sn_ws.RESTMessageV2();
        request.setEndpoint(conn.url + "/v1/auth/approle/login");
        request.setHttpMethod("POST");
        if (conn.mid) request.setMIDServer(conn.mid);
        request.setRequestBody(JSON.stringify({ "role_id": conn.user, "secret_id": conn.pass }));

        var response = request.execute();
        return (response.getStatusCode() == 200) ? JSON.parse(response.getBody()).auth.client_token : null;
    },

    /** 2. Get Secret from Vault */
    _getSecretFromVault: function(aliasId, vaultToken) {
        var conn = this._getConnection(aliasId);
        var request = new sn_ws.RESTMessageV2();
        request.setEndpoint(conn.url + "/v1/secret/data/pingfed_creds");
        request.setHttpMethod("GET");
        request.setRequestHeader("X-Vault-Token", vaultToken);
        if (conn.mid) request.setMIDServer(conn.mid);

        var response = request.execute();
        return (response.getStatusCode() == 200) ? JSON.parse(response.getBody()).data.data.password : null;
    },

    /** 3. Exchange for Ping Token with Basic Auth Header */
    _getPingOAuthToken: function(aliasId, pfUsername, pfPassword) {
        var conn = this._getConnection(aliasId);
        var request = new sn_ws.RESTMessageV2();
        request.setEndpoint(conn.url + "/as/token.oauth2");
        request.setHttpMethod("POST");
        if (conn.mid) request.setMIDServer(conn.mid);

        // A. CONSTRUCT BASIC AUTH HEADER (Client ID : Client Secret)
        // Note: GlideStringUtil.base64Encode is available in scoped apps
        var authString = conn.user + ":" + conn.pass;
        var encodedAuth = GlideStringUtil.base64Encode(authString);
        
        request.setRequestHeader("Authorization", "Basic " + encodedAuth);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        // B. CONSTRUCT BODY (Credentials only contain user credentials, not client credentials)
        var body = "grant_type=password" +
            "&username=" + encodeURIComponent(pfUsername) +
            "&password=" + encodeURIComponent(pfPassword);

        request.setRequestBody(body);
        
        var response = request.execute();
        if (response.getStatusCode() == 200) {
            return JSON.parse(response.getBody()).access_token;
        }
        gs.error("PingFed Auth Failed (" + response.getStatusCode() + "): " + response.getBody());
        return null;
    },

    /** Helper to resolve Connection Alias details */
    _getConnection: function(aliasId) {
        var provider = new sn_cc.ConnectionInfoProvider();
        var info = provider.getConnectionInfo(aliasId);
        if (!info) throw "Alias not found: " + aliasId;

        var cred = info.getCredential();
        return {
            url: info.getAttribute("connection_url"),
            mid: info.getAttribute("mid_server"),
            user: cred.getAttribute("user_name"), // Vault Role ID or Ping Client ID
            pass: cred.getAttribute("password")   // Vault Secret ID or Ping Client Secret
        };
    },

    type: 'PingFedDynamicAuthUtil'
};
