var USBNavigationBreadcrumbItemsProvider = Class.create();
USBNavigationBreadcrumbItemsProvider.prototype = {
    initialize: function() {},


    /**
     * @param {{
     * appId: string,
     * route: string,
     * fields: Record<string, any>,
     * params: Record<string, any>,
     * fetchStaticRoutes: boolean,
     * selectedToolbarItem: { 
     *  availability: any, badge: any, group?: string, 
     * 	icon?: string, id: string,
     * 	label: string | { message: string, translatable: boolean},
     * 	order?: number, presence?: any,
     * 	routeInfo: {route: string, fields: Record<string, any>, params?: Record<string, any>}
     * }
     * prevBreadcrumbRoute: { route: string, fields?: Record<string, any>, params?: Record<string, any>},
     * prevSelectedContent: { route: string, fields?: Record<string, any>, params?: Record<string, any>}
     * }} context
     * @returns {{
     *		operation?: "REPLACE" | "APPEND" | "REPLACE_LAST_ITEM",
     * 		items: Array<{
     * 					label: string,
     * 					icon?: string,
     *					routeInfo: {
     *						route: string,
     *						fields: Record<string, any>
     *						params: Record<string,any>,
     *						targetRoute?: "current" | { route: string, fields?: Record<string, any>, params?: <string,any> }
     * 					},
     *					operation?: "REPLACE" | "APPEND" | "REPLACE_LAST_ITEM"
     * 				>}}
     */
    provideItems: function(context) {
        gs.info("Context : " + JSON.stringify(context, null, 4));
        if (context.route == 'home') {
            var ipa_bread = {
                "operation": "APPEND",
                "items": [{
                    "label": "home",
                    "pageTitle": "home",
                    "hideBreadcrumb": false,
                    "routeInfo": {
                        "route": "record",
                        "fields": {
                            "table": "sn_dpr_model_release",
                            "sysId": "83f52644834d2210bef196a6feaad383"
                        },
                        "params": {}
                    },
                    "operation": "APPEND"
                }]
            };
            return ipa_bread;
        }
        if (context.route == "incident") {
            var op_bread = {
                "operation": "APPEND",
                "items": [{
                    "label": "USB incident",
                    "pageTitle": "USB Incident",
                    "hideBreadcrumb": false,
                    "routeInfo": {
                        "route": "record",
                        "fields": {
                            "table": "sn_dpr_model_release",
                            "sysId": "83f52644834d2210bef196a6feaad383"
                        },
                        "params": {}
                    },
                    "operation": "APPEND"
                },{
                    "label": "Incident",
                    "pageTitle": "Incident",
                    "hideBreadcrumb": false,
                    "routeInfo": {
                        "route": "record",
                        "fields": {
                            "table": "sn_dpr_model_release",
                            "sysId": "83f52644834d2210bef196a6feaad383"
                        },
                        "params": {}
                    },
                    "operation": "APPEND"
                }]
            };
            return op_bread;
        }

        return {
            items: []
        };

        //return new sn_dpr_workspace.DPRWorkspaceNavigationUtil().provideItems(context);
    },
    getAppId: function() {
        return "73d96a3ec30126502a24d7ec050131df";

        //return new sn_dpr_workspace.DPRWorkspaceNavigationUtil().DPR_WS_APP.PAGE_REGISTRY_ID;
    },
    getHandledRoutes: function() {
        return ["home", "list"];
        //return new sn_dpr_workspace.DPRWorkspaceNavigationUtil().DPR_WS_APP.L1_ROUTES;
    },

    /**
     * @param {{
     * appId: string,
     * route: string,
     * fields: Record<string, any>,
     * params: Record<string, any>,
     * fetchStaticRoutes: boolean,
     * selectedToolbarItem: { 
     *  availability: any, badge: any, group?: string, 
     * 	icon?: string, id: string,
     * 	label: string | { message: string, translatable: boolean},
     * 	order?: number, presence?: any,
     * 	routeInfo: {route: string, fields: Record<string, any>, params?: Record<string, any>}
     * }
     * prevBreadcrumbRoute: { route: string, fields?: Record<string, any>, params?: Record<string, any>},
     * prevSelectedContent: { route: string, fields?: Record<string, any>, params?: Record<string, any>}
     * }} context
     * @returns {Array<{
     * 		items: Array<{
     * 					label: string,
     * 					icon?: string,
     *					routeInfo: {
     *						route: string,
     *						fields: Record<string, any>
     *						params: Record<string,any>,
     *						targetRoute?: "current" | { route: string, fields?: Record<string, any>, params?: <string,any> }
     * 					},
     *					operation?: "REPLACE" | "APPEND" | "REPLACE_LAST_ITEM"
     * 				>}>}
     */
    getStaticRoutes: function(context) {
        /**
         * Return All your static routes from here
         */
        return {
            items: []
        };
    },

    type: 'USBNavigationBreadcrumbItemsProvider'
};