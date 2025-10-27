(function transformEntry(source) {
    // Field: u_impacted_applications (list of references to cmdb_ci_business_app)
    if (source.u_impacted_applications) {
        var appNames = source.u_impacted_applications.toString().split(',');
        var sysIdList = [];

        for (var i = 0; i < appNames.length; i++) {
            var appName = appNames[i].trim();
            if (!appName)
                continue;

            var appGR = new GlideRecord('cmdb_ci_business_app');
            appGR.addQuery('name', appName);
            appGR.query();

            if (appGR.next()) {
                sysIdList.push(appGR.getUniqueValue());
            } else {
                // Optional: create new record if not found
                gs.warn('Business App not found: ' + appName + '. Creating new record.');
                var newApp = new GlideRecord('cmdb_ci_business_app');
                newApp.initialize();
                newApp.name = appName;
                var newSysId = newApp.insert();
                sysIdList.push(newSysId);
            }
        }

        // Join sys_ids into comma-separated string (ServiceNow list reference format)
        source.u_impacted_applications = sysIdList.join(',');
    }

    return source;
})(source);
