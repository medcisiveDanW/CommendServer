function calculate_commend_date(date) {
    var months = [];
        months.push('undefined');
        months.push('Jan');
        months.push('Feb');
        months.push('Mar');
        months.push('Apr');
        months.push('May');
        months.push('Jun');
        months.push('Jul');
        months.push('Aug');
        months.push('Sep');
        months.push('Oct');
        months.push('Nov');
        months.push('Dec');
    var d = date.replace(new RegExp(' ', 'g'), "").replace(",", ""),
        month = d.substring(0,3),
        day = d.substring(3,5),
        year = d.substring(5,12),
        result = null;
    for(i in months) {
        if(months[i]==month) {
            month = i;
            break;
        }
    }
    if(month.length==1) {
        month = 0 + month;
    }
    result = (year + month + day)*1;
    return result;
}
(function($) {
    $.fn.dataTableExt.oSort['commend_date-asc']  = function(a,b) {
        var x = calculate_commend_date(a),
            y = calculate_commend_date(b);
        return ((x < y) ? -1 : ((x > y) ?  1 : 0));
    };
    $.fn.dataTableExt.oSort['commend_date-desc'] = function(a,b) {
        var x = calculate_commend_date(a),
            y = calculate_commend_date(b);
        return ((x < y) ? 1 : ((x > y) ?  -1 : 0));
    };
})(jQuery);

