function evaluateProperty({ api, helpers }) {
    // Approach 1: use preloaded session data / data resource
    // This assumes a Data Resource (or the session context) has already loaded the current user's roles.
    const roles = api.context.session.user.roles;            // e.g. ['admin','itil_user']
    return Array.isArray(roles) && roles.includes('admin'); // true if 'admin' is present
  }

  
  function evaluateProperty({ api, helpers }) {
    const userRoles = api.data.userRoles;  // preloaded records from sys_user_has_role
    // Each record has a .role.name field. Check if any record’s role is 'admin'.
    return userRoles && userRoles.some(r => r.role.name === 'admin');
  }

  
  function evaluateProperty({ api, helpers }) {
    // Approach 2: synchronous server call inside evaluateProperty
    const userId = api.context.session.user.sysId;
    // Query sys_user_has_role for current user & 'admin' role
    const result = api.getData('sys_user_has_role', {
      sysparm_query: `user=${userId}^role.name=admin`
    });
    // If any records returned, the user has the 'admin' role
    return (result.records || []).length > 0;
  }
  