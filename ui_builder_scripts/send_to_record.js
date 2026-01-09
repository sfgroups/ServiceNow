/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
function handler({api, event, helpers, imports}) {
    const versionId = event.payload.data.output;
    const fields = {
        table: 'sn_pace_data_collector_version',
        sysId: versionId
    };
    helpers.navigate.to('sn-pace-record', fields, {}, false, false, 'current');
}