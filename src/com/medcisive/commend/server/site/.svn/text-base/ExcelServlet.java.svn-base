package com.medcisive.commend.server.site;

import com.google.gson.Gson;
import com.medcisive.commend.server.CommendWebappManager;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

/**
 *
 * @author vhapalchambj
 */
@WebServlet(name = "ExcelServlet", urlPatterns = {"/ExcelServlet"})
public class ExcelServlet extends HttpServlet {
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(true);
        CommendWebappManager manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        ExcelSpreadsheetWriter esw = new ExcelSpreadsheetWriter(manager);
        String option = (String) request.getParameter("option");
        
        try {
            if (option.equalsIgnoreCase("Productivity")) {
                esw.writeProductivitySpreadsheet(request, response);
            } else if (option.equalsIgnoreCase("Encounters")) {
                esw.writeEncountersSpreadsheet(request, response);
            } else if (option.equalsIgnoreCase("CPT")) {
                esw.writeCPTSpreadsheet(request, response);
            }            
        } catch (WriteException ex) {
            System.out.println(ex);
            Logger.getLogger(ExcelServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
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
}
