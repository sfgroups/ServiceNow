[
  { "name": "userName", "label": "User Name", "fieldType": "string" }
]
```
Step 1: Create the Server-Side Script Include
Ensure your Script Include is not client-callable (it doesn't need to extend AbstractAjaxProcessor).
Name: MyUibUtils
Script:
javascript
var MyUibUtils = Class.create();
MyUibUtils.prototype = {
    initialize: function() {},
    
    getGreeting: function(userName) {
        return "Hello, " + userName + "! Data from server.";
    },

    type: 'MyUibUtils'
};
Use code with caution.

Step 2: Create a Transform Data Resource (The Bridge)
This acts as the "Data Broker" that UIB can see. 
Navigate to Data Resources > New > Transform.
Properties (JSON): Define the inputs UIB will pass to the script.
json
[
  { "name": "userName", "label": "User Name", "fieldType": "string" }
]
Use code with caution.

Script: Call your Script Include here.
javascript
function transform(input) {
    var utils = new MyUibUtils();
    return utils.getGreeting(input.userName);
}
Use code with caution.

Important: Create an ACL for this Data Broker (type: ux_data_broker) so the user has permission to execute it. 
Step 3: Use it in UI Builder
Add Data Resource: In your UIB page, click + Add in the Data Resources panel and select your new Transform Data Resource.
Pass Inputs: Bind the userName property to a page property or state variable (e.g., @context.session.user.fullName).
Consume Output: Bind the output of this resource to a component (like a Stylized Text label) using:
@data.my_transform_resource_id.output. 
When to Trigger?
On Page Load: Set the Data Resource to "Execute when it is added to the page".
On Event (e.g., Button Click): Set it to "Only execute when invoked" and use a Client Script to call:
api.data.my_transform_resource_id.execute({ userName: "John" });
```