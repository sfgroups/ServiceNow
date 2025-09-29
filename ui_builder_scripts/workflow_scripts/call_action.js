// Example in a Script Step inside an Action
var result = sn_fd.FlowAPI.startSubflowSync('my_subflow_name', {
    param1: 'value1',
    param2: 'value2'
});
gs.info('Subflow result: ' + JSON.stringify(result));
