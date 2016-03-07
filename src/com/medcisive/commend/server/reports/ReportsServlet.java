package com.medcisive.commend.server.reports;

import com.medcisive.commend.server.CommendWebappManager;
import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLObject;
import com.medcisive.utility.sql2.SQLTable;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class ReportsServlet extends DBCServlet {

    private CommendWebappManager _manager;
    private static final java.util.ArrayList<java.sql.Timestamp> _rollingMonthStart = new java.util.ArrayList();
    private static final java.util.ArrayList<java.sql.Timestamp> _rollingQuarterStart = new java.util.ArrayList();
    private static final int _numberOfMonthsToProcess = 25;
    private static final int _numberOfQuartersToProcess = 5; // 4 quarters need 5 date points so _numberOfQuartersToProcess = numbOfQuarters + 1
    private static final java.text.SimpleDateFormat _shortMonthDateFormater = new java.text.SimpleDateFormat("MMM");
    private static final java.text.SimpleDateFormat _dateFormater = new java.text.SimpleDateFormat("MMMM dd, yyyy");

    static {
        int year = Calendar.getInstance().get(Calendar.YEAR);
        int month = Calendar.getInstance().get(Calendar.MONTH);
        int quarter = month / 3 + 1;
        Calendar c = Calendar.getInstance();
        c.set(year, month, 1, 0, 0, 0);
        for (int i = 0; i < _numberOfMonthsToProcess; i++) {
            _rollingMonthStart.add(new java.sql.Timestamp(c.getTimeInMillis()));
            c.roll(Calendar.MONTH, -1);
            if (c.get(Calendar.MONTH) == Calendar.DECEMBER) {
                c.set(Calendar.YEAR, c.get(Calendar.YEAR) - 1);
            }
        }
        c.set(year, month, 1, 0, 0, 0);
        switch (quarter) {
            case 1:
                c.set(Calendar.MONTH, Calendar.JANUARY);
                break;
            case 2:
                c.set(Calendar.MONTH, Calendar.APRIL);
                break;
            case 3:
                c.set(Calendar.MONTH, Calendar.JULY);
                break;
            case 4:
                c.set(Calendar.MONTH, Calendar.OCTOBER);
                break;
            default:
                break;
        }
        for (int i = 0; i < _numberOfQuartersToProcess; i++) {
            _rollingQuarterStart.add(new java.sql.Timestamp(c.getTimeInMillis()));
            c.roll(Calendar.MONTH, -3);
            if (c.get(Calendar.MONTH) == Calendar.OCTOBER) {
                c.set(Calendar.YEAR, c.get(Calendar.YEAR) - 1);
            }
        }
    }
    
    @Override
    public Object process(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        Object result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        if (option.equalsIgnoreCase("getQuarterNames")) {
            result = _getQuarterNames(request);
        } else if (option.equalsIgnoreCase("log")) {
            _log(request);
        }
        return result;
    }
    
    private Object _getQuarterNames(HttpServletRequest request) {
        return getQuarterNames();
    }

    public Object getQuarterNames() {
        java.util.Map<String, String> result = new java.util.HashMap();
        for (int i = 0; i < 4; i++) {
            java.sql.Timestamp start = _rollingQuarterStart.get(i + 1);
            java.sql.Timestamp end = _rollingQuarterStart.get(i);
            end = new java.sql.Timestamp(end.getTime() - 60000);
            Calendar c = Calendar.getInstance();
            c.setTimeInMillis(start.getTime());
            int year = c.get(Calendar.YEAR);
            String startStr = _shortMonthDateFormater.format(start).toString();
            String endStr = _shortMonthDateFormater.format(end).toString();
            String quarter = "" + startStr + "-" + endStr + " " + year;
            result.put("" + i, quarter);
        }
        return result;
    }
    
    public static java.util.Map<String, Object> getStartEnd(int id, int offset) {
        java.sql.Timestamp start = _rollingQuarterStart.get(0);
        java.sql.Timestamp end = new java.sql.Timestamp(System.currentTimeMillis());
        if (id == 1) {
            start = _rollingQuarterStart.get(offset + 1);
            end = _rollingQuarterStart.get(offset);
        } else if (id == 2) {
            start = _rollingQuarterStart.get(offset + 4);
            end = _rollingQuarterStart.get(offset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.put("start", _dateFormater.format(start).toString());
        result.put("end", _dateFormater.format(end).toString());
        return result;
    }
    
    public static java.util.Map<String, java.sql.Timestamp> getStartEndTimestamp(int id, int offset) {
        java.sql.Timestamp start = _rollingQuarterStart.get(0);
        java.sql.Timestamp end = new java.sql.Timestamp(System.currentTimeMillis());
        if (id == 1) {
            start = _rollingQuarterStart.get(offset + 1);
            end = _rollingQuarterStart.get(offset);
        } else if (id == 2) {
            start = _rollingQuarterStart.get(offset + 4);
            end = _rollingQuarterStart.get(offset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, java.sql.Timestamp> result = new java.util.HashMap();
        result.put("start", start);
        result.put("end", end);
        return result;
    }
    
    private void _log(HttpServletRequest request) {
        String event = (String) request.getParameter("event");
        String eventId = (String) request.getParameter("eventId");
        _manager.logMe(event, eventId);
    }
}
