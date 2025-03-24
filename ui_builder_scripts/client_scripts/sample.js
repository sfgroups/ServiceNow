async function submitTask({api, data}) {
    try {
        // Get form input values
        let shortDesc = api.getState('newTask.short_description');
        let priority = api.getState('newTask.priority');
        let assignmentGroup = api.getState('newTask.assignment_group');

        // Call create_record API
        let response = await api.data.create_record.execute({
            resourceId: "taskCreateResource", // Name of the Data Resource
            data: {
                short_description: shortDesc,
                priority: priority,
                assignment_group: assignmentGroup
            }
        });

        if (response && response.sys_id) {
            let taskUrl = `/now/nav/ui/classic/params/target/task.do?sys_id=${response.sys_id}`;

            // Close Modal
            api.setState('showModal', false);

            // Show Success Notification with Link
            api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
                items: [{
                    id: "alert1",
                    status: "success",
                    icon: "circle-check-outline",
                    content: {
                        type: "html",
                        value: `<h4>New Task Created: <a href="${taskUrl}" target="_blank">${response.sys_id}</a></h4>`
                    },
                    action: {
                        type: "dismiss"
                    }
                }]
            });
        } else {
            // Error Notification
            api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
                items: [{
                    id: "alert2",
                    status: "critical",
                    icon: "alert-circle-outline",
                    content: {
                        type: "html",
                        value: `<h4>Failed to create task. Please try again.</h4>`
                    },
                    action: {
                        type: "dismiss"
                    }
                }]
            });
        }
    } catch (error) {
        console.error("Task creation error:", error);

        // Emit Critical Error Notification
        api.emit("NOW_UXF_PAGE#ADD_NOTIFICATIONS", {
            items: [{
                id: "alert3",
                status: "critical",
                icon: "alert-circle-outline",
                content: {
                    type: "html",
                    value: `<h4>An error occurred: ${error.message}</h4>`
                },
                action: {
                    type: "dismiss"
                }
            }]
        });
    }
}
