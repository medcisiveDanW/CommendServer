package com.medcisive.commend.server.site;

import com.google.gson.Gson;
import com.medcisive.commend.server.CommendDatabaseController;
import com.medcisive.commend.server.CommendWebappManager;
import com.medcisive.commend.server.reports.WorkgroupServlet;
import com.medcisive.utility.sql2.SQLTable;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class PTSDManagerServlet extends HttpServlet {
    private static Gson _gson = new Gson();
    private CommendWebappManager _manager;
    private CommendSiteDatabaseController _dbc = null;
    private static Object _result = null;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void  processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(true);
        _result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        _dbc = new CommendSiteDatabaseController(_manager.providerSta3n);
        if (option.equalsIgnoreCase("graphData")) {
            _result = _getGraphData(request);
        } else if (option.equalsIgnoreCase("graphDataWithinRange")) {
            _result = _getGraphDataWithinRange(request);
        } else if (option.equalsIgnoreCase("OEF4Panel")) {
            _result = _getOEF4Panel(request);
        } else if (option.equalsIgnoreCase("log")) {
            _logEvent(request);
        } else if (option.equalsIgnoreCase("data")) {
            _result = _getProviderData();
        } else if (option.equalsIgnoreCase("groups")) {
            _result = _getGroups(request);
        }
        response.getWriter().write(_gson.toJson(_result));
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
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
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

    private java.util.List<String> _getGraphData(HttpServletRequest request) {
        java.util.List<String> result = new java.util.ArrayList();
        String sid = (String) request.getParameter("sid");
        String type = (String) request.getParameter("type");
        SQLTable tm = _dbc.getGraphData(sid,type);
        for (Integer i : tm.keySet()) {
            java.util.Map<String, Object> tmm = tm.getRow(i);
            if (tmm == null) {
                continue;
            }
            String jsonData = (String) tmm.get("jsonObject");
            if (jsonData != null) {
                result.add(jsonData);
            }
        }
        return result;
    }

    private java.util.List<String> _getGraphDataWithinRange(HttpServletRequest request) {
        java.util.List<String> result = new java.util.ArrayList();
        String sStart = (String) request.getParameter("start");
        String sEnd = (String) request.getParameter("end");
        long lStart = Long.parseLong(sStart);
        long lEnd = Long.parseLong(sEnd);
        java.sql.Timestamp tsStart = new java.sql.Timestamp(lStart);
        java.sql.Timestamp tsEnd   = new java.sql.Timestamp(lEnd);
        SQLTable tm = _dbc.getGraphDataWithinRange(tsStart,tsEnd);
        for (Integer i : tm.keySet()) {
            java.util.Map<String, Object> tmm = tm.getRow(i);
            if (tmm == null) {
                continue;
            }
            String jsonData = (String) tmm.get("jsonObject");
            if (jsonData != null) {
                result.add(jsonData);
            }
        }
        return result;
    }

    private SQLTable _getOEF4Panel(HttpServletRequest request) {
        String sid = (String) request.getParameter("sid");
        return _dbc.getOEF4Panel(sid);
    }

    private void _logEvent(HttpServletRequest request) {
        String event = (String) request.getParameter("event");
        String eventId = (String) request.getParameter("eventId");
        _manager.logMe(event, eventId);
    }

    private SQLTable _getGroups(HttpServletRequest request) {
        String sidStr = (String) request.getParameter("sid");
        int sid = Integer.parseInt(sidStr);
        WorkgroupServlet ws = new WorkgroupServlet();
        return (SQLTable)ws.getGroups(sid);
    }
    private java.util.Map<String, Object> _getProviderData() {
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
        result.put("name", _manager.providerName);
        return result;
    }
}
