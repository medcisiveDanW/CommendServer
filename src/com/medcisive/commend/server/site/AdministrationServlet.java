package com.medcisive.commend.server.site;

import com.google.gson.Gson;
import com.medcisive.commend.server.CommendWebappManager;
import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.SQLTable;
import java.io.IOException;
import java.text.ParseException;
import java.util.Calendar;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class AdministrationServlet extends HttpServlet {

    private static Gson _gson = new Gson();
    private CommendWebappManager _manager;
    private CommendSiteDatabaseController _dbc;
    private static Object _result = null;
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

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected synchronized void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(true);
        _result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        _dbc = new CommendSiteDatabaseController(_manager.providerSta3n);

        if (option.equalsIgnoreCase("graphData")) {
            _result = _getGraphData(request);
        } else if (option.equalsIgnoreCase("getGraphJSON")) {
            _result = _getGraphJSON(request);
        } else if (option.equalsIgnoreCase("OEF4Panel")) {
            _result = _getOEF4Panel(request);
        } else if (option.equalsIgnoreCase("data")) {
            _result = _getProviderData();
        } else if (option.equalsIgnoreCase("encounterStatistics")) {
            _result = _getEncounterStatistics(request);
        } else if (option.equalsIgnoreCase("groupStatistics")) {
            _result = _getGroupStatistics(request);
        } else if (option.equalsIgnoreCase("getOEF4StatisticsData")) {
            _result = _getOEF4StatisticsData(request);
        } else if (option.equalsIgnoreCase("getOEF4DeadlineReportWithinRange")) {
            _result = _getOEF4DeadlineReportWithinRange(request);
        } else if (option.equalsIgnoreCase("getOEF4QualifyingReportWithinRange")) {
            _result = _getOEF4QualifyingReportWithinRange(request);
        } else if (option.equalsIgnoreCase("addAllWorkgroup")) {
            _addALLWorkgroup();
        }
        
        response.getWriter().write(_gson.toJson(_result));
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private void _addALLWorkgroup() {
        int sta3n = Integer.parseInt(_manager.providerSta3n);
        int sid = Integer.parseInt(_manager.providerSID);
        _dbc.addAllGroup(sta3n,sid);
    }

    private SQLTable _getOEF4StatisticsData(HttpServletRequest request) {
        String sStart = (String) request.getParameter("start"); // String representing the miliseconds for the starting Timestamp. i.e. Date.getTime();
        String sEnd = (String) request.getParameter("end");
        long lStart = Long.parseLong(sStart);
        long lEnd = Long.parseLong(sEnd);
        java.sql.Timestamp tsStart = new java.sql.Timestamp(lStart);
        java.sql.Timestamp tsEnd = new java.sql.Timestamp(lEnd);
        String sids = (String) request.getParameter("sids");
        return _dbc.getOEF4StatisticsData(tsStart, tsEnd, sids);
    }

    private SQLTable _getOEF4DeadlineReportWithinRange(HttpServletRequest request) {
        String sStart = (String) request.getParameter("start");
        String sEnd = (String) request.getParameter("end");
        long lStart = Long.parseLong(sStart);
        long lEnd = Long.parseLong(sEnd);
        java.sql.Timestamp tsStart = new java.sql.Timestamp(lStart);
        java.sql.Timestamp tsEnd = new java.sql.Timestamp(lEnd);
        return _dbc.getOEF4DeadlineReportWithinRange(tsStart, tsEnd);
    }

    private SQLTable _getOEF4QualifyingReportWithinRange(HttpServletRequest request) {
        String sStart = (String) request.getParameter("start");
        String sEnd = (String) request.getParameter("end");
        long lStart = Long.parseLong(sStart);
        long lEnd = Long.parseLong(sEnd);
        java.sql.Timestamp tsStart = new java.sql.Timestamp(lStart);
        java.sql.Timestamp tsEnd = new java.sql.Timestamp(lEnd);
        return _dbc.getOEF4QualifyingReportWithinRange(tsStart, tsEnd);
    }

    private Object _getGraphData(HttpServletRequest request) {
        java.util.Map<String, String> result = new java.util.HashMap();
        String sid = (String) request.getParameter("sid");
        String type = (String) request.getParameter("type");
        SQLTable tm = _dbc.getGraphData(sid, type);
        for (Integer i : tm.keySet()) {
            java.util.Map<String, Object> tmm = tm.getRow(i);
            if (tmm == null) {
                continue;
            }
            String jsonData = (String) tmm.get("jsonObject");
            String ien = (String) tmm.get("ien");
            if (jsonData != null) {
                result.put(ien, jsonData);
            }
        }
        return result;
    }

    private Object _getGraphJSON(HttpServletRequest request) {
        String ien = (String) request.getParameter("ien");
        String type = (String) request.getParameter("type");
        SQLTable tm = _dbc.getGraphJSON(ien, type);
        for (Integer i : tm.keySet()) {
            java.util.Map<String, Object> tmm = tm.getRow(i);
            if (tmm == null) {
                continue;
            }
            return tmm.get("jsonObject");
        }
        return null;
    }

    private Object _getOEF4Panel(HttpServletRequest request) {
        String sid = (String) request.getParameter("sid");
        return _dbc.getOEF4Panel(sid);
    }

    private Object _getProviderData() {
        java.util.Map<String, Object> result = new java.util.HashMap();
        java.util.Map<String, String> providers = new java.util.HashMap();
        SQLTable tm = _dbc.getProviders();
        for (Integer i : tm.keySet()) {
            java.util.Map<String, Object> tmm = tm.getRow(i);
            if (tmm == null) {
                continue;
            }
            String duz = (String) tmm.get("DUZ");
            String name = (String) tmm.get("name");
            providers.put(name, duz);
        }
        result.put("providers", providers);
        result.put("name", _manager);
        return result;
    }

    public Object _getEncounterStatistics(HttpServletRequest request) {
        String wgId = (String) request.getParameter("wgId");
        String temporalCatId = (String) request.getParameter("temporalCatId");
        String temporalOffset = (String) request.getParameter("temporalOffset");
        int offset = Integer.parseInt(temporalOffset);
        java.sql.Timestamp start = _rollingQuarterStart.get(0);
        java.sql.Timestamp end = new java.sql.Timestamp(System.currentTimeMillis());
        if (temporalCatId.equalsIgnoreCase("1")) {
            start = _rollingQuarterStart.get(offset + 1);
            end = _rollingQuarterStart.get(offset);
        } else if (temporalCatId.equalsIgnoreCase("2")) {
            start = _rollingQuarterStart.get(offset + 4);
            end = _rollingQuarterStart.get(offset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.put("start", _dateFormater.format(start).toString());
        result.put("end", _dateFormater.format(end).toString());
        if (wgId != null) {
            result.put("data", _dbc.getEncounterStatistics(wgId, temporalOffset, temporalCatId));
        }
        return result;
    }
    
    private Object _getGroupStatistics(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        String temporalCatIdStr = (String) request.getParameter("temporalCatId");
        String temporalOffsetStr = (String) request.getParameter("temporalOffset");
        int wgId = Integer.parseInt(wgIdStr);
        int temporalOffset = Integer.parseInt(temporalOffsetStr);
        int temporalCatId = Integer.parseInt(temporalCatIdStr);
        java.sql.Timestamp start = _rollingQuarterStart.get(0);
        java.sql.Timestamp end = new java.sql.Timestamp(System.currentTimeMillis());
        if (temporalCatId==1) {
            start = _rollingQuarterStart.get(temporalOffset + 1);
            end = _rollingQuarterStart.get(temporalOffset);
        } else if (temporalCatId==2) {
            start = _rollingQuarterStart.get(temporalOffset + 4);
            end = _rollingQuarterStart.get(temporalOffset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.put("start", _dateFormater.format(start).toString());
        result.put("end", _dateFormater.format(end).toString());
        if (wgId != -1) {
            result.put("data", _dbc.getGroupStatistics(wgId, temporalOffset, temporalCatId));
        }
        return result;
    }
}
