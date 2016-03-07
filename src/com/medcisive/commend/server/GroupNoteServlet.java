package com.medcisive.commend.server;

import com.google.gson.Gson;
import com.medcisive.utility.LogUtility;
import com.medcisive.utility.NoteBuilder;
import com.medcisive.utility.Timer;
import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.SQLObject;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class GroupNoteServlet extends HttpServlet {

    private static Gson _gson = new Gson();
    private CommendWebappManager _manager = null;
    private Object _result = null;
    private static GroupNoteDBC _dbc = null;
    private static final java.text.SimpleDateFormat _dateFormater = new java.text.SimpleDateFormat("yyyyMMdd.HHmmss");

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
        response.setContentType("application/json");
        HttpSession session = request.getSession(true);
        _result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        if(_manager==null) {
            LogUtility.error("CommendWebappManager is NULL.");
            _manager.logMe("CommendWebappManager is NULL.", "1044");
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("CommendWebappManagerIsNULL");
            return;
        } else if(_manager._mdws==null) {
            boolean ready = false;
            Timer t = Timer.start();
            while(!ready) {
                if(_manager._mdwsReady) { ready = true; }
                else {
                    long duration = t.stop();
                    if(duration>450000) { // 45 seconds till timeout
                        LogUtility.error("MDWS failed to start.");
                        _manager.logMe("MDWS failed to start.", "1045");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        response.getWriter().write("MDWSfailed");
                        return;
                    }
                }
            }
        }
        if(_dbc==null){
            _dbc = new GroupNoteDBC();
        }
        if (option.equalsIgnoreCase("saveNote")) {
            _result = _saveNote(request);
        } else if (option.equalsIgnoreCase("getGroupMembers")) {
            _result = _getGroupMembers(request);
        } else if (option.equalsIgnoreCase("getEncounters")) {
            _result = _getEncounters(request);
        } else if (option.equalsIgnoreCase("getAppointments")) {
            _result = _getAppointments(request);
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

    private java.util.List _getGroupMembers(HttpServletRequest request) {
        String encounterString = (String)request.getParameter("encounterString");
        java.util.List result = null;
        java.sql.Timestamp time = null;
        String location = null;
        int index = encounterString.indexOf(";");
        if(index>0 && encounterString.length()>index+1){
            location = encounterString.substring(0, index);
            encounterString = encounterString.substring(index+1,encounterString.length());
            index = encounterString.indexOf(";");
            encounterString = encounterString.substring(0, index);
            try {
                time = new java.sql.Timestamp(_dateFormater.parse(encounterString).getTime());
            } catch(Exception e){
                System.out.println(e);
            }
        }
        if(time!=null && location!=null){
            result = _dbc.getGroup(location,time);
        }
        return result;
    }
    
    private boolean _saveNote(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> pm = getParameterMap(request);
        NoteBuilder nb = _generateOutcomeNote(pm);
        String note = nb.toMDWSString();
        String patientIENString = (String)pm.get("patientIEN");
        int patientIEN = Integer.parseInt(patientIENString);
        boolean result = false;
        if(_switchPatientByIEN(patientIEN)) {
            System.out.println(nb.toString());
            result = _manager._mdws.writeNote((String)pm.get("titleIEN"), (String) pm.get("encounter"), note);
            if(result) {
                _manager.logMe("MDWS saved note successfully.", "1006");
            } else {
                String message = "MDWS Error: Unknown Write Result Message.(MDWS dose not exsist.)";
                String fault = "MDWS Error: Unknown Write Result Fault.(MDWS dose not exsist.";
                if(_manager._mdws!=null) {
                    message = _manager._mdws.writeResult.getFault().getMessage();
                    fault = _manager._mdws.writeResult.getFault().getStackTrace();
                }
                _manager.logMe("MDWS failed to save note.", "1005");
                _manager.logNoteError((String)pm.get("titleIEN"), (String) pm.get("encounter"), note, message, fault);
            }
        }
        return result;
    }
    
    private NoteBuilder _generateOutcomeNote(java.util.Map parameterMap) {
        String titleIEN = (String) parameterMap.get("titleIEN");
        if ((titleIEN == null) || (titleIEN.length() <= 2)) { return null; }
        com.medcisive.utility.HashTree pd = new com.medcisive.utility.HashTree((String)parameterMap.get("patientData"));
        String groupNoteHeader = "";
        if(pd.get("Therapy Mode" + pd.pathSeparator + "PRIMARY MODE")!=null){
            groupNoteHeader += "Group For: " + pd.get("Therapy Mode" + pd.pathSeparator + "PRIMARY MODE") + "\n";
        }
        if(parameterMap.get("numberOfParticipants")!=null){
            groupNoteHeader += "Number of participants: " + parameterMap.get("numberOfParticipants") + "\n";
        }
        if(pd.get("Therapy Mode" + pd.pathSeparator + "Duration")!=null){
            groupNoteHeader += "Duration: " + pd.get("Therapy Mode" + pd.pathSeparator + "Duration") + "\n";
        }
        NoteBuilder currentNote = new NoteBuilder();
        currentNote.insertBlock("Group Session:", "\n" + groupNoteHeader + "\n" + (String) parameterMap.get("groupNote"));
        currentNote.insertBlock("Participation:", "\n" + (String) parameterMap.get("patientNote"));
        currentNote.addData((String) parameterMap.get("patientData"));
        return currentNote;
    }
    
    private boolean _switchPatientByIEN(int patientIEN) {
        boolean result = false;
        if(_manager!=null && _manager._mdws!=null) {
            if(!_manager._mdws.patientDFN.equalsIgnoreCase("" + patientIEN)) {
                result = _manager._mdws.selectPatient("" + patientIEN);
            } else { result = true; }
        }
        return result;
    }
        
    private boolean _switchPatient() {
        boolean result = false;
        if(_manager!=null && _manager._mdws!=null&&_manager.getCurrentPatient()!=null&&_manager.getCurrentPatient().patientIEN!=null) {
            if(!_manager._mdws.patientDFN.equalsIgnoreCase(_manager.getCurrentPatient().patientIEN)) {
                result = _manager._mdws.selectPatient(_manager.getCurrentPatient().patientIEN);
            } else { result = true; }
        }
        return result;
    }
    
    private Object _getAppointments(HttpServletRequest request) {
        String sta3nString = (String)request.getParameter("sta3n");
        String patientSIDString = (String)request.getParameter("patientSID");
        Object result = null;
        int sta3n = Integer.parseInt(sta3nString);
        int patientSID = Integer.parseInt(patientSIDString);
        if(sta3n!=-1 && patientSID!=-1){
            result = _dbc.getAppointments(sta3n,patientSID);
        }
        return result;
    }
    
    private Object _getEncounters(HttpServletRequest request) {
        if(_switchPatient()) {
            return _manager._mdws.getEncounters();
        } else {
            return _manager.getCurrentPatient().getNoteEncounters(); //Old backup system.
        }
    }

    private java.util.LinkedHashMap<String, Object> getParameterMap(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> result = new java.util.LinkedHashMap();
        result.put("patientIEN", request.getParameter("noteData[patientIEN]"));
        result.put("groupNote", request.getParameter("noteData[groupNote]"));
        result.put("patientNote", request.getParameter("noteData[patientNote]"));
        result.put("encounter", request.getParameter("noteData[encounter]"));
        result.put("saveNote", request.getParameter("noteData[saveNote]"));
        result.put("titleIEN", request.getParameter("noteData[titleIEN]"));
        result.put("title", request.getParameter("noteData[title]"));
        result.put("patientData", request.getParameter("noteData[patientData]"));
        result.put("saveNoteHash",request.getParameter("noteData[saveNoteHash]"));
        result.put("numberOfParticipants",request.getParameter("noteData[numberOfParticipants]"));
        return result;
    }

    class GroupNoteDBC extends com.medcisive.utility.sql2.DBCUtil {
        
        public java.util.List<java.util.Map<String,String>> getGroup(String locationIEN, java.sql.Timestamp time){
            if(locationIEN==null || time==null){ return null; }
            String query =
                "select pt.Sta3n, " +
                "       pt.PatientName AS Name, \n" +
                "       pt.PatientIEN, \n" +
                "       pt.PatientSID, \n" +
                "       vst.visitDateTime, \n" +
                "       lc.LocationName,  \n" +
                "       lc.LocationSID \n" +
                "from VDWWork.Outpat.Visit vst join \n" +
                "  VDWWork.SPatient.SPatient pt on \n" +
                "   pt.Sta3n = vst.Sta3n and \n" +
                "   pt.PatientSID = vst.patientSID \n" +
                "  join VDWWork.Dim.Location lc on \n" +
                "    lc.Sta3n = vst.Sta3n and \n" +
                "    lc.LocationSID = vst.locationSID \n" +
                "where vst.VisitDateTime = " + DBC.fixTimestamp(time)+ " \n" +
                "  and vst.Sta3n = '640' \n" +
                "  and vst.PrimaryStopCode < 600 \n" +
                "  and vst.PrimaryStopCode > 499 \n" +
                "  and lc.LocationIEN = " + DBC.fixString(locationIEN) + " \n" +
                "order by pt.patientName";
            
            final java.util.List<java.util.Map<String,String>> result = new java.util.ArrayList();
            _dest.query(query, new SQLObject() {

                @Override
                public void row(ResultSet rs) throws SQLException {
                    java.util.Map<String,String> map = new java.util.HashMap();
                    String Name = rs.getString("Name");
                    String Sta3n = rs.getString("Sta3n");
                    String PatientIEN = rs.getString("PatientIEN");
                    String PatientSID = rs.getString("PatientSID");
                    String Time = rs.getString("visitDateTime");
                    String LocationSID = rs.getString("LocationSID");
                    map.put("Name", Name);
                    map.put("Sta3n", Sta3n);
                    map.put("PatientIEN", PatientIEN);
                    map.put("PatientSID", PatientSID);
                    map.put("AppointmentDateTime", Time);
                    map.put("LocationSID", LocationSID);
                    result.add(map);
                }
            });
            return result;
        }
        
        public java.util.List<java.util.Map<String,String>> getAppointments(int sta3n, int patientSID){
            long msday = 1000*60*60*24;
            long year  = 365;
            year = year * msday;
            java.sql.Timestamp from = new java.sql.Timestamp(System.currentTimeMillis() - year);
            final java.text.SimpleDateFormat format = new java.text.SimpleDateFormat("yyyyMMdd.kkmmss");
            String query =
                "SELECT apt.Sta3n \n" +
                "      ,apt.PatientIEN \n" +
                "      ,apt.PatientSID \n" +
                "      ,apt.AppointmentDateTime \n" +
                "      ,loc.LocationIEN \n" +
                "      ,apt.LocationSID \n" +
                "      ,loc.LocationName \n" +
                "FROM VDWWork.Appt.Appointment apt, \n" +
                "     VDWWork.Dim.Location loc \n" +
                "WHERE apt.AppointmentDateTime > " + DBC.fixTimestamp(from)+ " \n" +
                "  AND apt.Sta3n = " + sta3n + " \n" +
                "  AND apt.Sta3n = loc.Sta3n \n" +
                "  AND apt.LocationSID = loc.LocationSID \n" +
                "  AND apt.PatientSID = " + patientSID + " \n" +
                "ORDER BY apt.AppointmentDateTime DESC";
            final java.util.List<java.util.Map<String,String>> result = new java.util.ArrayList();
            _dest.query(query, new SQLObject() {

                @Override
                public void row(ResultSet rs) throws SQLException {
                    java.util.Map<String,String> map = new java.util.HashMap();
                    java.sql.Timestamp appointment = rs.getTimestamp("AppointmentDateTime");
                    map.put("Sta3n", rs.getString("Sta3n"));
                    map.put("PatientIEN", rs.getString("PatientIEN"));
                    map.put("PatientSID", rs.getString("PatientSID"));
                    map.put("AppointmentDateTime", "" + appointment);
                    map.put("LocationIEN", rs.getString("LocationIEN"));
                    map.put("LocationSID", rs.getString("LocationSID"));
                    map.put("LocationName", rs.getString("LocationName"));
                    map.put("Encounter", rs.getString("LocationIEN") + ";" + format.format(appointment) + ";A");
                    map.put("Display", rs.getString("AppointmentDateTime") + " " + rs.getString("LocationName"));
                    result.add(map);
                }
            });
            return result;
        }
    }
}
