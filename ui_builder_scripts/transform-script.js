/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
*/
function evaluateEvent({api, event}) {
	return {
		propName: "productOwnerSysId",
		value: event.payload.value
	};
}

/**
 * @param {params} params
 * @param {api} params.api
 * @param {TransformApiHelpers} params.helpers
 */
function evaluateProperty({
    api,
    helpers
}) {
    const data = api.data.look_up_user.results;
    if (data) {
        return data.map(e => ({
            id: e.sys_id.value,
            label: e.name.value,
            sublabel: e.email.value
        }));
    } else {
        return null;
    }
}

/**
 * @param {params} params
 * @param {api} params.api
 * @param {TransformApiHelpers} params.helpers
 */
function evaluateProperty({
    api,
    helpers
}) {
    return [api.state.productOwnerSysId];
}