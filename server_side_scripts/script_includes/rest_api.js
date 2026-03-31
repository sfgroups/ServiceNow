(function process(request, response) {
    try {
        var queryParams = request.queryParams;

        // 1. EXTRACT & SANITIZE PARAMETERS
        // Use default values for safe, predictable results
        var filter = queryParams.sysparm_query ? queryParams.sysparm_query.toString() : "active=true";
        var limit = parseInt(queryParams.sysparm_limit) || 50;
        var offset = parseInt(queryParams.sysparm_offset) || 0;

        // Security: Enforce a maximum hard limit to prevent system strain
        if (limit > 1000) limit = 1000;

        var results = [];
        var gr = new GlideRecord('change_request');

        // 2. APPLY FILTER (Encoded Query)
        gr.addEncodedQuery(filter);

        // If the user didn't provide a sort in the query string, default to newest first
        if (filter.indexOf('ORDERBY') == -1) {
            gr.orderByDesc('sys_created_on');
        } else {
            gr.addEncodedQuery(filter); // GlideRecord honors ORDERBYDESC inside the string
        }

        // 3. APPLY PAGINATION (Windowing)
        // chooseWindow(first_row, last_row)
        // Note: l is exclusive, so use offset + limit
        gr.chooseWindow(offset, offset + limit);

        // 4. ENSURE STABLE SORTING
        // Always sort by a unique field (number or sys_id) for consistent pages
        gr.orderBy('number');

        gr.query();

        // 5. PROCESS RESULTS
        while (gr.next()) {
            results.push({
                sys_id: gr.getUniqueValue(),
                number: gr.getValue('number'),
                short_description: gr.getValue('short_description'),
                type: gr.getValue('type'),
                state: gr.getDisplayValue('state'),
                assigned_to: gr.getDisplayValue('assigned_to')
            });
        }

        // 6. BUILD ROBUST RESPONSE
        response.setBody({
            info: {
                count: results.length,
                next_offset: offset + limit,
                applied_filter: filter
            },
            result: results
        });
        response.setStatus(200);

    } catch (e) {
        // Error handling for enterprise resilience
        gs.error("API Error in Change Request Fetch: " + e.message);
        response.setError(new sn_ws_err.ServiceError());
        response.setStatus(500);
    }

})(request, response);
