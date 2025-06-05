/**
 * @param {params} params
 * @param {api} params.api
 * @param {any} params.event
 * @param {any} params.imports
 * @param {ApiHelpers} params.helpers
 */
function handler({
    api,
    event,
    helpers,
    imports
}) {
    try {
        console.log(JSON.stringify(api, null, 4));
    } catch (ex) {
        console.log("Error :" + ex);
    }

}