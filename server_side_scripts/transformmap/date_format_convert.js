(function transformRow(source) {
    // Get the date value from source
    var srcDate = source.u_date;

    if (!srcDate)
        return ''; // No value, return empty or keep as-is

    srcDate = srcDate.toString().trim();

    // Match MM/DD/YYYY format
    var dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    var match = srcDate.match(dateRegex);

    if (match) {
        // Convert / → -
        var formattedDate = match[1] + '-' + match[2] + '-' + match[3];
        return formattedDate;
    }

    // If format doesn't match, return the original value
    return srcDate;
})(source);
