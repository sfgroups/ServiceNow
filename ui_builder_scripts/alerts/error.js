/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
            items: [{
                id: "alert1",
                status: "critical",
                icon: "circle-check-outline",
                content: {
                    type: "html",
                    value: "<h4>" + "This is a critical message from script" + "<h4>"
                },
                action: {
                    type: "dismiss"
                },
            }]
        });
    }