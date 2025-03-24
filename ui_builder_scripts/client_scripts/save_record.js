function evaluateEvent({ api }) {
    api.data.createRecord({
        table: "my_table",
        data: {
            name: api.state.formData.name,
            email: api.state.formData.email,
            description: api.state.formData.description
        }
    }).then(() => {
        api.state.showModal = false;  // Close modal after saving
    });
    // helpers.modal.open("[component-id$='alert_modal']") // define your model id inplace of alert_modal
}
