package com.medcisive.commend.server;

import com.google.gson.Gson;
import com.medcisive.utility.LogUtility;
import com.medcisive.utility.NoteBuilder;
import com.medcisive.utility.Timer;
import com.medcisive.utility.sql2.DBC;
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
public class NoteServlet extends HttpServlet {
    private static Gson _gson = new Gson();
    private CommendWebappManager _manager = null;
    private Object _result = null;
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
        if (option.equalsIgnoreCase("saveDraft")) {
            _result = _saveDraft(request);
        } else if (option.equalsIgnoreCase("saveNote")) {
            _result = _saveNote(request);
        } else if (option.equalsIgnoreCase("saveOutcomeNote")) {
            _result = _saveOutcomeNote(request);
        } else if (option.equalsIgnoreCase("searchTitle")) {
            _result = _searchTitle(request);
        } else if (option.equalsIgnoreCase("getEncounters")) {
            _result = _getEncounters(request);
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

    private boolean _saveDraft(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> pm = getParameterMap(request);
        NoteBuilder nb = _generateNote(pm);
        System.out.println("*****************Start Note*********************************");
        System.out.println(pm.get("patientData"));
        nb.print();
        System.out.println("*****************Stop  Note*********************************");
        return _saveDraftSQL(pm,nb);
    }

    private boolean _saveNote(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> pm = getParameterMap(request);
        NoteBuilder nb = _generateNote(pm);
        String note = nb.toMDWSString();
        boolean result = false;

        if(_manager!=null && _manager._mdws!=null) {
            if(_switchPatient()) {
                result = _manager._mdws.writeNote((String)pm.get("titleIEN"), (String) pm.get("encounter"), note);
                if(result) {
                    _manager.logMe("MDWS saved note successfully.", "1006");
                    _manager.deleteDraftNote();
                }
                else {
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
        }
        return result;
    }

    private boolean _saveOutcomeNote(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> pm = getParameterMap(request);
        NoteBuilder nb = _generateOutcomeNote(pm);
        String note = nb.toMDWSString();
        boolean result = false;

        if(_manager!=null && _manager._mdws!=null) {
            if(_switchPatient()) {
                result = _manager._mdws.writeNote((String)pm.get("titleIEN"), (String) pm.get("encounter"), note);
                if(result) {
                    _manager.logMe("MDWS saved note successfully.", "1006");
                    _manager.deleteDraftNote();
                }
                else {
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
        }
        return result;
    }

    private Object _searchTitle(HttpServletRequest request) {
        com.medcisive.utility.Nexus result = new com.medcisive.utility.Nexus();
        String search = (String) request.getParameter("search");
        if(search.equalsIgnoreCase("null")) { search = null; }
        java.util.Map<String, String> map = _dbc.getHistoricNoteTitles(_manager.currentPatient.patientSID,_manager.providerSID);
        java.util.Map<String, String> searchMap = null;
        if (search != null && _manager._mdws != null) {
            searchMap = _manager._mdws.getNoteTitles(search);
        }
        result.key("historic").push("historic").put(map);
        if (searchMap!=null) {
            result.key("search").push("search").put(searchMap);
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

    private NoteBuilder _generateNote(java.util.Map parameterMap) {
        String titleIEN = (String) parameterMap.get("titleIEN");
        if ((titleIEN == null) || (titleIEN.length() <= 2)) {
            return null;
        }
        NoteBuilder currentNote = new NoteBuilder();
        java.util.Map<String, String> saveHash = (java.util.HashMap<String, String>) parameterMap.get("saveHash");
        currentNote.insertBlock("Mental Health Treatment Coordinator: ", parameterMap.get("principalMentalHealthProvider") + "\nTime in Session: " + parameterMap.get("timeInSession") + "\nSession Number: " + parameterMap.get("sessionNumber")); // Default Save
        currentNote.insertBlock("INFORMATION:", (String) parameterMap.get("information")); // Default Save
        currentNote.insertBlock("Veteran's chart ", (String) parameterMap.get("vetransChart")); // Default Save
        currentNote.insertBlock("Session focused on the client's concerns including:", (String) parameterMap.get("sessionFocusedOn")); // Default Save
        if (saveHash.get("CURRENT SUBSTANCE USE:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("CURRENT SUBSTANCE USE:", (String) parameterMap.get("substanceUse"));
        } // Optional Save
        currentNote.insertBlock("SUICIDAL/HOMICIDAL RISK:", (String) parameterMap.get("suicidalHomicidalRisk")); // Default Save
        if (saveHash.get("MEDICATION MANAGEMENT:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("MEDICATION MANAGEMENT:", (String) parameterMap.get("medicationManagement"));
        } // Optional Save
        if (saveHash.get("ACTIVE PROBLEM LIST:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("ACTIVE PROBLEM LIST:", (String) parameterMap.get("activeProblemList"));
        } // Optional Save
        if (saveHash.get("SIDE EFFECTS:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("SIDE EFFECTS:", (String) parameterMap.get("sideEffects"));
        } // Optional Save
        String sem = (String)parameterMap.get("sideEffectsMeasurements");
        if (sem!=null && !sem.equalsIgnoreCase("\n")) {
            currentNote.insertBlock("SIDE EFFECTS MEASUREMENTS:", sem);
        } // Optional Save
        if (saveHash.get("LABS:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("LABS:", (String) parameterMap.get("labs"));
        } // Optional Save
        if (saveHash.get("WEIGHT:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("WEIGHT:", (String) parameterMap.get("weight"));
        } // Optional Save
        if (saveHash.get("MENTAL STATUS EXAM:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("MENTAL STATUS EXAM:", (String) parameterMap.get("mentalStatusExam"));
        } // Optional Save
        String om = (String)parameterMap.get("outcomeMeasurements");
        if (om!=null && !om.equalsIgnoreCase("\n")) {
            currentNote.insertBlock("OUTCOME MEASUREMENTS:", om);
        } // Optional Save
        if (saveHash.get("IMPRESSION:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("IMPRESSION:", (String) parameterMap.get("impression"));
        } // Optional Save
        currentNote.insertBlock("ASSESSMENT:", (String) parameterMap.get("assessment")); // Default Save
        currentNote.insertBlock("DIAGNOSIS:", (String) parameterMap.get("diagnosis")); // Default Save
        currentNote.insertBlock("PLAN:", (String) parameterMap.get("plan")); // Default Save
        if (saveHash.get("SEEN BY ATTENDING PHYSICIAN:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("SEEN BY ATTENDING PHYSICIAN:", (String) parameterMap.get("seenByAttendingPhysician"));
        } // Optional Save
        if (saveHash.get("LPS CONSERVED:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("LPS CONSERVED:", (String) parameterMap.get("lpsConserved"));
        } // Optional Save
        if (saveHash.get("Client states that:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("Client states that", (String) parameterMap.get("clientStatesThat"));
        } // Optional Save
        if (saveHash.get("Medication refills:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("Medication refills", (String) parameterMap.get("medicationRefills"));
        } // Optional Save
        currentNote.insertBlock("EDUCATION:", (String) parameterMap.get("education")); // Default Save
        if (saveHash.get("TOBACCO SCREEN:").equalsIgnoreCase("1")) {
            currentNote.insertBlock("TOBACCO SCREEN:", (String) parameterMap.get("tobaccoScreen"));
        } // Optional Save
        currentNote.addData((String) parameterMap.get("patientData")); // Always Save
        //"5116;20100903.120000;A"
        return currentNote;
    }

    private NoteBuilder _generateOutcomeNote(java.util.Map parameterMap) {
        String titleIEN = (String) parameterMap.get("titleIEN");
        if ((titleIEN == null) || (titleIEN.length() <= 2)) { return null; }
        NoteBuilder currentNote = new NoteBuilder();
        currentNote.insertBlock("OUTCOME NOTE:", (String) parameterMap.get("outcomeNote"));
        currentNote.addData((String) parameterMap.get("patientData"));
        //"5116;20100903.120000;A"
        return currentNote;
    }

    private java.util.HashMap<String,String> _getSaveHash(String str) {
        java.util.HashMap<String,String> hash = new java.util.HashMap();
        if(str!=null) {
            String tail = str;
            String head = "";
            while(tail.length()>0) {
                head = _getBlock(tail);
                int index = head.indexOf(':');
                String key = head.substring(0,index+1);
                String value = head.substring(index+1,head.length());
                hash.put(key, value);
                tail = tail.replaceAll(head, "");
                tail = tail.substring(1, tail.length());
            }
        }
        return hash;
    }

    private String _getBlock(String str) {
        int index = str.indexOf(',');
        if(index>-1) {
            return str.substring(0,index);
        }
        return str;
    }

    private boolean _saveDraftSQL(java.util.Map map, NoteBuilder note) {
        return _dbc.saveDraft(_manager,map,note);
    }

    private NoteBuilder _getNote(String providerSID, String patientSID) {  // moved to CommendDatabase Controller..
        NoteBuilder result = null;
        String note = (String)_getDraft(providerSID,patientSID).get("noteText");
        result = new NoteBuilder(note);
        return result;
    }

    private java.util.Map _getDraft(String providerSID, String patientSID) {
        return _dbc.getDraft(providerSID, patientSID);
    }

    private java.util.LinkedHashMap<String, Object> getParameterMap(HttpServletRequest request) {
        java.util.LinkedHashMap<String, Object> result = new java.util.LinkedHashMap();
        result.put("outcomeNote", request.getParameter("noteData[outcomeNote]"));
        result.put("encounter", request.getParameter("noteData[encounter]"));
        result.put("saveNote", request.getParameter("noteData[saveNote]"));
        result.put("titleIEN", request.getParameter("noteData[titleIEN]"));
        result.put("title", request.getParameter("noteData[title]"));
        result.put("patientData", request.getParameter("noteData[patientData]"));
        String saveNoteHash = request.getParameter("noteData[saveNoteHash]");
        result.put("saveNoteHash",saveNoteHash);
        result.put("saveHash",_getSaveHash(saveNoteHash));
        result.put("principalMentalHealthProvider", request.getParameter("noteData[principalMentalHealthProvider]"));
        result.put("timeInSession", request.getParameter("noteData[timeInSession]"));
        result.put("sessionNumber", request.getParameter("noteData[sessionNumber]"));
        result.put("information", request.getParameter("noteData[information]"));
        result.put("vetransChart", request.getParameter("noteData[vetransChart]"));
        result.put("sessionFocusedOn", request.getParameter("noteData[sessionFocusedOn]"));
        result.put("substanceUse", request.getParameter("noteData[substanceUse]"));
        result.put("suicidalHomicidalRisk", request.getParameter("noteData[suicidalHomicidalRisk]"));
        result.put("psychosocialIntervention", request.getParameter("noteData[psychosocialIntervention]"));
        result.put("medicationManagement", request.getParameter("noteData[medicationManagement]"));
        result.put("activeProblemList", request.getParameter("noteData[activeProblemList]"));
        result.put("sideEffects", request.getParameter("noteData[sideEffects]"));
        result.put("sideEffectsMeasurements", request.getParameter("noteData[sideEffectsMeasurements]"));
        result.put("labs", request.getParameter("noteData[labs]"));
        result.put("weight", request.getParameter("noteData[weight]"));
        result.put("mentalStatusExam", request.getParameter("noteData[mentalStatusExam]"));
        result.put("outcomeMeasurements", request.getParameter("noteData[outcomeMeasurements]"));
        result.put("impression", request.getParameter("noteData[impression]"));
        result.put("assessment", request.getParameter("noteData[assessment]"));
        result.put("diagnosis", request.getParameter("noteData[diagnosis]"));
        result.put("plan", request.getParameter("noteData[plan]"));
        result.put("seenByAttendingPhysician", request.getParameter("noteData[seenByAttendingPhysician]"));
        result.put("lpsConserved", request.getParameter("noteData[lpsConserved]"));
        result.put("clientStatesThat", request.getParameter("noteData[clientStatesThat]"));
        result.put("medicationRefills", request.getParameter("noteData[medicationRefills]"));
        result.put("education", request.getParameter("noteData[education]"));
        result.put("tobaccoScreen", request.getParameter("noteData[tobaccoScreen]"));
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
}