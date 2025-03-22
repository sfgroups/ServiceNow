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
                status: "info",
                icon: "circle-check-outline",
                content: {
                    type: "html",
                    value: "<div><p>This is the first line</p><p>This is the second line.</p></div>"
                },
                action: {
                    type: "dismiss"
                },
            }]
        });
    }