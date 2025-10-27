(function transformEntry(source) {
    var value = source.u_status.toString().trim().toLowerCase();

    var mapping = {
        "active": "1",
        "in progress": "2",
        "completed": "3",
        "pending": "4"
    };

    // Default fallback if not found
    return mapping[value] || "1";
})(source);
