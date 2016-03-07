package com.medcisive.commend.server;

import com.medcisive.utility.*;
import com.medcisive.mdws.MDWSAdaptor;

/**
 *
 * @author vhapalchambj
 */
public class CommendWebappManager {

    public java.util.Date todayDate = new java.util.Date();
    public java.sql.Timestamp today = new java.sql.Timestamp(todayDate.getTime());
    public java.text.SimpleDateFormat formater = new java.text.SimpleDateFormat("MMM dd, yyyy");
    public String todayStr = formater.format(today).toString();
    public java.util.LinkedHashMap<String, PatientData> patients = null;
    public PatientData currentPatient = null;
    private String _defaultPatientDFN = null;
    public String providerName = null;
    public String providerDUZ = null;
    public String providerSID = null;
    public String providerSta3n = null;
    public String providerRole = null;
    public String cosignerSID = null;
    public String cosignerDUZ = null;
    public String cosignerName = null;
    public String cosignerSta3n = null;
    public String key = null;
    public CommendDatabaseController _dbc = null;
    public MDWSAdaptor _mdws = null;
    public boolean _mdwsReady = false;
    public boolean isValid = false;
    public boolean isInPatientPanel = false;
    public long oneDay = 1 * 24 * 60 * 60 * 1000;
    public String computerName = null;

    public CommendWebappManager() {
        System.out.println("Testing Mode!!!");
        _dbc = new CommendDatabaseController();
        providerDUZ = "70479";//dan
        //providerDUZ = "15150";//Steve

        java.util.Map<String,String> pro = _dbc.getProviderInfo(providerDUZ);
        providerName = pro.get("name");
        providerSID = pro.get("sid");
        providerSta3n = pro.get("sta3n");
        providerRole = pro.get("providerRole");
        cosignerSID = pro.get("cosignerSID");
        cosignerDUZ = pro.get("cosignerDUZ");
        cosignerName = pro.get("cosignerName");
        //cosignerSta3n possible placeholder
        computerName = "testComputerName";
        patients = _dbc.getPatients(this);
        //isValid = setCurrentPatientByDFN("7171838");//zzcharlie
        isValid = setCurrentPatientByDFN("7189953");
        new StartMDWS().start();
    }

    public CommendWebappManager(String key) {
        this.key = key;
        this._dbc = new CommendDatabaseController();
        java.util.HashMap<String, Object> currentAccess = _dbc.getAccess(key);
        if (!currentAccess.isEmpty()) {
            providerDUZ = (String) currentAccess.get("providerDUZ");
            _dbc.deleteAccess(providerDUZ);
            java.util.Map<String,String> pro = _dbc.getProviderInfo(providerDUZ);
            providerName = pro.get("name");
            providerSID = pro.get("sid");
            providerSta3n = pro.get("sta3n");
            providerRole = pro.get("providerRole");
            cosignerSID = pro.get("cosignerSID");
            cosignerDUZ = pro.get("cosignerDUZ");
            cosignerName = pro.get("cosignerName");
            //cosignerSta3n possible placeholder
            computerName = _dbc.getComputerName(providerDUZ);
            String patSSN = (String) currentAccess.get("SSN");
            System.out.println("currentAccess - providerDUZ: " + providerDUZ + " providerName: " + providerName + " computerName: " + computerName + " patSSN: " + patSSN);
            patients = _dbc.getPatients(this);
            boolean firstPatient = true;
            String patientList = "";
            for (String DFN : patients.keySet()) {
                if (firstPatient) {
                    _defaultPatientDFN = DFN;
                    firstPatient = false;
                }
                if (patients.get(DFN).SSN.equalsIgnoreCase(patSSN)) {
                    _defaultPatientDFN = DFN;
                }
                patientList += "Patient: DFN:" + DFN + " name: " + patients.get(DFN).patientName + "\n";
            }
            isValid = revertToDefaultPatient();
        } else {
            isValid = false;
        }
        logMe("MDWSAdaptor created.", "1001");
        new StartMDWS().start();
    }

    public boolean setCurrentPatientByKey(String key) {
        if (key == null || key.isEmpty()) {
            return false;
        }
        String result;
        if (setCurrentPatientBySSN(result = _dbc.getPatientSSN(key))) {
            return true;
        } else {
            logMe("Patient Selection Error(key): " + key + " SSN: " + result, "1007");
            return revertToDefaultPatient();
        }
    }

    public boolean setCurrentPatientBySSN(String SSN) {
        if (SSN == null || SSN.isEmpty()) {
            return false;
        }
        String result;
        if (setCurrentPatientByDFN(result = _dbc.getPatientDFN(SSN))) {
            return true;
        } else {
            logMe("Patient Selection Error(SSN): " + SSN + " DFN: " + result, "1007");
            return revertToDefaultPatient();
        }
    }

    public boolean setCurrentPatientByDFN(String DFN) {
        if (DFN == null || DFN.isEmpty()) {
            return false;
        }
        currentPatient = patients.get(DFN);
        if (currentPatient != null) {
            isInPatientPanel = true;
            return true;
        } else {
            isInPatientPanel = false;
            currentPatient = _dbc.getPatientExternal(DFN);
            if (currentPatient != null) {
                logMe("External Patient Selection (DFN): " + DFN, "1019");
                return true;
            } else {
                logMe("Patient Selection Error (DFN): " + DFN, "1007");
                return revertToDefaultPatient();
            }
        }
    }

    private boolean revertToDefaultPatient() {
        return setCurrentPatientByDFN(_defaultPatientDFN);
    }

    public PatientData getCurrentPatient() {
        return currentPatient;
    }

    public String getMedicationManagement() {
        return _dbc.getMedicationManagement(currentPatient);
    }

    public PatientData getPatient(String DFN) {
        return patients.get(DFN);
    }

    public java.util.Collection<CustomOutcomeDefinition> getCustomOutcomes() {
        return _dbc.getCustomOutcomeDefinition(providerDUZ);
    }

    public String formatDate(java.sql.Timestamp ts) {
        return formater.format(ts).toString();
    }

    public boolean insertHash(String hashMap, NoteBuilder nb) {
        java.util.HashMap<String, String> map = new java.util.HashMap();
        String str = hashMap;
        String subString;
        int start = 0;
        int end = 0;
        while (str.length() > 0) {
            start = str.indexOf('[');
            end = str.indexOf(']');
            if ((start >= 0) && (end >= 0)) {
                subString = str.substring(start, end + 1);
                int index = subString.indexOf('=');
                if (index > -1) {
                    String checkDupplicat = subString.substring(index + 1, subString.length());
                    index = checkDupplicat.indexOf('=');
                    if (index < 0) {
                        subString = removeBrackets(subString);
                        map.put(getScoreKey(subString), getScoreValue(subString));
                    }
                }
                str = str.substring(end + 1, str.length());
            } else {
                str = "";
                return false;
            }
        }
        return true;
    }

    private String getScoreKey(String str) {
        int index = str.indexOf('=');
        return str.substring(0, index);
    }

    private String getScoreValue(String str) {
        int index = str.indexOf('=');
        return str.substring(index + 1, str.length());
    }

    private String removeBrackets(String str) {
        int index = str.indexOf('[');
        str = str.substring(index + 1, str.length());
        index = str.indexOf(']');
        return str.substring(0, index);
    }

    public void logFeedback(java.sql.Timestamp date, String SSN, String providerDUZ, String feedback, String type) {
        _dbc.logFeedback(date, SSN, providerDUZ, feedback, type);
    }

    public void logMe(String event, String eventId) {
        String SSN = null;
        if (currentPatient != null) {
            SSN = currentPatient.SSN;
        }
        _dbc.logEvent(null, null, SSN, providerDUZ, computerName, event, eventId);
    }

    public boolean logNoteError(String titleIEN, String encounterString, String noteText, String messageMDWS, String stackTraceMDWS) {
        return _dbc.logNoteError(providerSta3n, providerDUZ, providerSID, providerName,
                                 null, currentPatient.patientIEN, currentPatient.patientSID, currentPatient.patientName,
                                 titleIEN, encounterString, noteText,
                                 cosignerSta3n,cosignerDUZ,cosignerSID,cosignerName,
                                 messageMDWS,stackTraceMDWS);
    }

    public com.medcisive.utility.NoteBuilder getRecentNote() {
        Integer patSID = Integer.parseInt(currentPatient.patientSID);
        Integer proSID = Integer.parseInt(providerSID);
        com.medcisive.utility.NoteBuilder result = _dbc.getRecentNote(patSID,proSID);
        return result;
    }

    public com.medcisive.utility.NoteBuilder getDraftNote() {
        com.medcisive.utility.NoteBuilder result = _dbc.getDraftNote(providerSID, currentPatient.patientSID);
        return result;
    }

    public boolean isDraftNote() {
        boolean result = _dbc.isDraftNote(providerSID, currentPatient.patientSID);
        return result;
    }

    public boolean deleteDraftNote() {
        boolean result = _dbc.deleteDraftNote(providerSID, currentPatient.patientSID);
        return result;
    }

    public boolean reinitializManager(String key) {
        boolean result = false;
        java.util.HashMap<String, Object> currentAccess = _dbc.getAccess(key);
        if (!currentAccess.isEmpty()) {
            String accessProviderDUZ = (String) currentAccess.get("providerDUZ");
            if(!providerDUZ.equalsIgnoreCase(accessProviderDUZ)) { result = true; }
        }
        return result;
    }

    private class StartMDWS extends Thread {
        @Override
        public void run() {
            _mdws = new MDWSAdaptor();
            _mdws.providerDUZ = providerDUZ;
            _mdws.cosignerDUZ = cosignerDUZ;
            _mdws.patientDFN = getCurrentPatient().patientIEN;
            _mdws.siteCode = providerSta3n;
            _mdwsReady = _mdws.adInitium();
        }
    }
}