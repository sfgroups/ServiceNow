function compareDates(changeStartStr, changeEndStr, releaseStartStr, releaseEndStr) {
    // Helper to strip time and return a date object (only year, month, day)
    function toDateOnly(dateStr) {
        return new Date(dateStr.split(' ')[0]); // split on space, keep only date
    }

    var changeStartDate = toDateOnly(changeStartStr);
    var changeEndDate = toDateOnly(changeEndStr);
    var releaseStartDate = new Date(releaseStartStr);
    var releaseEndDate = new Date(releaseEndStr);

    var isStartValid = changeStartDate >= releaseStartDate;
    var isEndValid = changeEndDate <= releaseEndDate;

    return isStartValid && isEndValid;
}

// Example usage
var releaseStart = "2025-07-03";
var releaseEnd = "2025-08-29";
var changeStart = "2025-07-02 22:03:33";
var changeEnd = "2025-08-29 22:03:40";

var result = compareDates(changeStart, changeEnd, releaseStart, releaseEnd);
gs.info("Is change within release window? " + result); // false in this case
