package com.medcisive.commend.server;

import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class CustomOutcomeServlet extends HttpServlet {
    private static Gson _gson = new Gson();
    private CommendWebappManager _manager = null;
    private static Object _result = null;
    private static CommendDatabaseController _dbc = new CommendDatabaseController();

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(true);
        _result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        if (option.equalsIgnoreCase("create")) {
            _result = _create(request);
        } else if(option.equalsIgnoreCase("update")) {
            _result = _update(request);
        } else if(option.equalsIgnoreCase("delete")) {
            _result = _delete(request);
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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
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
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() { return "Short description"; }// </editor-fold>

    private String _create(HttpServletRequest request) {
        String idStr = request.getParameter("id");
        String nameStr = request.getParameter("name");
        String questionStr = request.getParameter("question");
        String scaleId = request.getParameter("scaleId");
        String goal = request.getParameter("goal");
        String valueStr = request.getParameter("value");
        String isRangeHigherStr = request.getParameter("isRangeHigher");
        String freqUnitStr = request.getParameter("freqUnit");
        String isCheckedStr = request.getParameter("isChecked");
        String min = request.getParameter("min");
        String symp = request.getParameter("symp");
        System.out.println("nameStr:" + nameStr+ " questionStr:" + questionStr+ " scaleId:" + scaleId);
        return _dbc.saveNewOutcome(nameStr, questionStr, scaleId, goal, symp, isRangeHigherStr.equalsIgnoreCase("true"), freqUnitStr, _manager.providerDUZ);
    }

    private boolean _update(HttpServletRequest request) {
        String idStr = request.getParameter("id");
        String nameStr = request.getParameter("name");
        String questionStr = request.getParameter("question");
        return _dbc.updateOutcome(idStr, nameStr, questionStr);
    }

    private boolean _delete(HttpServletRequest request) {
        String id = request.getParameter("id");
        boolean result = false;
        if(_dbc.isOutcomeUsed(id)) {
            result = _dbc.disableOutcome(id);
        } else {
            result = _dbc.deleteOutcome(id);
        }
        return result;
    }
}
