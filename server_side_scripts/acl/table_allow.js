var user = gs.getUserID();
var allowed = false;

// 1. Assigned directly
if (current.assigned_to == user)
    allowed = true;

// 2. Assignment group membership
if (!allowed && current.assignment_group && gs.getUser().isMemberOf(current.assignment_group))
    allowed = true;

// 3. Custom list field
if (!allowed && current.u_assigned_list) {
    var list = current.u_assigned_list.toString().split(',');
    if (list.indexOf(user) > -1)
        allowed = true;
}

answer = allowed;
