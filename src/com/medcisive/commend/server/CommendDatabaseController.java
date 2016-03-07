package com.medcisive.commend.server;

import com.medcisive.utility.NoteBuilder;
import com.medcisive.utility.sql2.SQLObject;
import com.medcisive.utility.sql2.DBC;
import java.sql.*;

/**
 *
 * @author vhapalchambj
 */
public class CommendDatabaseController extends com.medcisive.utility.sql2.DBCUtil {

    public CommendDatabaseController() {}
    
    public boolean update(String update) {
        return _dest.update(update) > 0;
    }

    public com.medcisive.utility.NoteBuilder getRecentNote(int PatientSID, int ProviderSID) {
        if (PatientSID == -1 || ProviderSID == -1) {
            return new com.medcisive.utility.NoteBuilder();
        }
        String query = "SELECT TOP 1 NoteText \n"
                + "FROM Commend.dbo.CommendProgressNote \n"
                + "WHERE PatientSID = " + PatientSID + " \n"
                + "  AND ProviderSID = " + ProviderSID + " \n"
                + "ORDER BY EncounterDate DESC";
        final java.util.List<com.medcisive.utility.NoteBuilder> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(new com.medcisive.utility.NoteBuilder(rs.getString("NoteText")));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(new com.medcisive.utility.NoteBuilder());
                }
            }
        });
        return result.get(0);
    }

    public com.medcisive.utility.NoteBuilder getDraftNote(String providerSID, String patientSID) {
        String query =
                "SELECT TOP 1 * FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE providerSID = " + DBC.fixString(providerSID) + " \n"
                + "  AND patientSID = " + DBC.fixString(patientSID);
        final java.util.List<com.medcisive.utility.NoteBuilder> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(new com.medcisive.utility.NoteBuilder(rs.getString("NoteText")));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(new com.medcisive.utility.NoteBuilder());
                }
            }
        });
        return result.get(0);
    }

    public boolean isDraftNote(String providerSID, String patientSID) {
        String query =
                "SELECT TOP 1 * FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE providerSID = " + DBC.fixString(providerSID) + " \n"
                + "  AND patientSID = " + DBC.fixString(patientSID);
        final java.util.List<Boolean> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(true);
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(false);
                }
            }
        });
        return result.get(0);
    }

    public boolean deleteDraftNote(String providerSID, String patientSID) {
        String query =
                "DELETE FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE providerSID = " + DBC.fixString(providerSID) + " \n"
                + "  AND patientSID = " + DBC.fixString(patientSID) + " \n";
        return _dest.update(query) > 0;
    }

    public java.util.LinkedHashMap<String, PatientData> getPatients(final CommendWebappManager comManager) {
        final DBC dbc = _dest.clone();
        final java.util.LinkedHashMap<String, PatientData> result = new java.util.LinkedHashMap();
        String query = "select distinct de.Sta3n, de.PatientSID, de.PatientIEN, de.Name, en.SSN, de.DOB, de.Race, de.Sex \n"
                + "from Commend.dbo.CommendProviderClinics cl, \n"
                + "   Commend.dbo.CommendEncounters en, \n"
                + "   Commend.dbo.CommendDemographics de \n"
                + "where cl.DUZ = '" + comManager.providerDUZ + "' \n"
                + "   and en.TrtLocIEN = cl.TrtLocIEN \n"
                + "   and en.SSN = de.SSN \n"
                + "   and cl.disable = 'N' \n"
                + "order by de.name";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                final PatientData pd = new PatientData(comManager, rs);
                String subQuery = "SELECT * \n"
                        + "FROM Commend.dbo.CommendEncSummary \n"
                        + "WHERE SSN = '" + pd.SSN + "'";
                dbc.query(subQuery, new SQLObject() {

                    @Override
                    public void row(ResultSet rs) throws SQLException {
                        pd.totalAppointments = rs.getInt("countTotAppts");
                        pd.noShowAppointments = rs.getInt("countNoShows");
                        pd.nextAppointment = rs.getTimestamp("nextAppt");
                        pd.lastAppointment = rs.getTimestamp("lastAppt");
                    }
                });
                final java.util.ArrayList<PatientSummary> patientSummary = new java.util.ArrayList();
                subQuery = "SELECT * \n"
                        + "FROM Commend.dbo.CommendPatientSummary \n"
                        + "WHERE SSN = '" + pd.SSN + "'";
                dbc.query(subQuery, new SQLObject() {

                    @Override
                    public void row(ResultSet rs) throws SQLException {
                        PatientSummary ps = new PatientSummary(rs, pd);
                        patientSummary.add(ps);
                    }
                });
                pd.patientSummary = patientSummary;
                result.put(pd.patientIEN, pd);
            }
        });
        return result;
    }
    
    public PatientData getPatientExternal(String DFN) {
        final java.util.List<PatientData> result = new java.util.ArrayList();
        String query = 
                "SELECT TOP 1 \n"
                + "       Sta3n \n"
                + "      ,PatientSID \n"
                + "      ,PatientIEN \n"
                + "      ,PatientName AS Name \n"
                + "      ,PatientSSN AS SSN \n"
                + "      ,DateOfBirth AS DOB \n"
                + "      ,Gender AS Sex \n"
                + "FROM VDWWork.SPatient.SPatient \n"
                + "WHERE PatientIEN = '" + DFN + "' \n"
                + "  AND Sta3n = 640";
        _src.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(new PatientDataExternal(rs));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(null);
                }
            }
        });
        return result.get(0);
    }

    public java.util.LinkedHashMap<String, OutcomeData> getScores(PatientData pd) {
        System.out.println("Getting Scores");
        final java.util.LinkedHashMap<String, OutcomeData> scoresList = new java.util.LinkedHashMap();
        String query =
                "SELECT \n"
                + "     d.name, o.value, o.date, d.outcomeTypeID \n"
                + "FROM \n"
                + "     Commend.dbo.CommendOutcomes o, \n"
                + "     Commend.dbo.CommendOutcomeDefn d \n"
                + "WHERE \n"
                + "	d.outcomeID = o.outcomeID \n"
                + " and o.SSN = '" + pd.SSN + "' \n"
                + "ORDER BY \n"
                + "     o.date";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                if (scoresList.containsKey(rs.getString("name"))) {
                    OutcomeData s = scoresList.get(rs.getString("name"));
                    s.put(rs.getTimestamp("date"), rs.getInt("value"));
                } else {
                    OutcomeData s = new OutcomeData();
                    s.name = rs.getString("name");
                    s.type = rs.getString("outcomeTypeID");
                    s.put(rs.getTimestamp("date"), rs.getInt("value"));
                    scoresList.put(s.name, s);
                }
            }
        });
        return scoresList;
    }

    public java.util.LinkedHashMap<java.sql.Timestamp, SideEffectData> getSideEffects(PatientData pd) {
        System.out.println("Getting Side Effects..");
        final java.util.LinkedHashMap<java.sql.Timestamp, SideEffectData> sideEffects = new java.util.LinkedHashMap();
        final java.util.LinkedHashMap<String, String> sideEffectsHash = getSideEffectsHash();
        String query =
                "SELECT	* \n"
                + "FROM	Commend.dbo.CommendSideEffects se \n"
                + "WHERE	SSN = '" + pd.SSN + "' \n"
                + "ORDER BY   se.date";
        
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                String sideEffectsList = rs.getString("listSideEffs");
                String list = createSideEffectsDisplayString(sideEffectsList, sideEffectsHash);
                SideEffectData se = new SideEffectData(rs.getInt("daysPerWeek"), list);
                sideEffects.put(rs.getTimestamp("date"), se);
            }
        });
        return sideEffects;
    }

    public java.util.LinkedHashMap<String, String> getSideEffectsHash() {
        final java.util.LinkedHashMap<String, String> sideEffectsHash = new java.util.LinkedHashMap<String, String>();
        String query = "SELECT SideEffID, name FROM Commend.dbo.CommendSideEffectsDefn";
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                sideEffectsHash.put(rs.getString("SideEffID"), rs.getString("name"));
            }
        });
        return sideEffectsHash;
    }

    public String createSideEffectsDisplayString(String rawStringList, java.util.LinkedHashMap<String, String> hash) {
        String list = rawStringList;
        String finalList = "";
        int index = 0;
        while (list.length() > 0) {
            index = list.indexOf(',');
            if (index > 0) {
                String sNumber = list.substring(0, index);
                if (!sNumber.equalsIgnoreCase("null")) {
                    String sHash = hash.get(sNumber);
                    if (sHash != null) {
                        finalList += sHash + ", ";
                    }
                }
                list = list.substring(index + 1, list.length());
            } else {
                if (!list.equalsIgnoreCase("null")) {
                    String sHash = hash.get(list);
                    if (sHash != null) {
                        finalList += sHash + ", ";
                    }
                }
                list = "";
            }
        }
        index = finalList.lastIndexOf(',');
        if (index > 0) {
            finalList = finalList.substring(0, index);
        } else {
            finalList = "Data not available";
        }
        return finalList;
    }

    public java.util.ArrayList<MedicationData> getMedications(PatientData pd) {
        final java.util.ArrayList<MedicationData> result = new java.util.ArrayList();
        String query =
                "SELECT * \n"
                + "FROM	Commend.dbo.CommendPrescriptions \n"
                + "WHERE \n"
                + "     Sta3n = " + pd.sta3n + " \n"
                + " AND PatientSID = " + pd.patientSID;
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                MedicationData md = new MedicationData(rs);
                result.add(md);
            }
        });
        return result;
    }

    public java.util.ArrayList<java.util.LinkedHashMap<String, Object>> getNoteEncounters(String DFN) {
        final java.util.ArrayList<java.util.LinkedHashMap<String, Object>> result = new java.util.ArrayList();
        String query = "SELECT * FROM Commend.dbo.CommendNoteEncounters "
                + "WHERE DFN = '" + DFN + "' "
                + "ORDER BY EncounterDate DESC";
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                java.util.LinkedHashMap<String, Object> map = new java.util.LinkedHashMap();
                map.put("encounter", rs.getString("EncounterValue"));
                map.put("display", rs.getString("EncounterDisplay"));
                result.add(map);
            }
        });
        return result;
    }

    public String getMedicationManagement(PatientData pd) {
        System.out.println("*Getting Commend Medication Management...");
        String query = "SELECT DISTINCT Sta3n,PatientSID,LocalDrugNameWithDose,Sig,RxStatus,isVAMed \n"
                + "FROM Commend.dbo.CommendMedicationManagement \n"
                + "WHERE PatientSID = " + pd.patientSID + " \n"
                + "  and Sta3n = " + pd.sta3n + " \n"
                + "  and RxStatus != 'Discontinued' "; // filtering unneeded data
        String medMangStr = "";
        com.medcisive.commend.server.MedicationManagement.MedicationManagementBuilder mmb = new com.medcisive.commend.server.MedicationManagement.MedicationManagementBuilder();
        final java.util.ArrayList<com.medcisive.commend.server.MedicationManagement.MedicationManagementNode> VAList = new java.util.ArrayList();
        final java.util.ArrayList<com.medcisive.commend.server.MedicationManagement.MedicationManagementNode> nonList = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                addMedicationManagementObject(rs, VAList, nonList);
            }
        });
        medMangStr = mmb.buildMedicationManagementString(VAList, nonList);
        return medMangStr;
    }

    private void addMedicationManagementObject(ResultSet rs, java.util.ArrayList<com.medcisive.commend.server.MedicationManagement.MedicationManagementNode> VAList, java.util.ArrayList<com.medcisive.commend.server.MedicationManagement.MedicationManagementNode> nonList) throws SQLException {
        com.medcisive.commend.server.MedicationManagement.MedicationManagementNode mm = new com.medcisive.commend.server.MedicationManagement.MedicationManagementNode();
        mm.isVAMed = rs.getBoolean("isVAMed");
        mm.localDrugNameWithDose = rs.getString("LocalDrugNameWithDose");
        mm.sig = rs.getString("Sig");
        mm.rxStatus = rs.getString("RxStatus");
        if (mm.isVAMed) {
            VAList.add(mm);
        } else {
            nonList.add(mm);
        }
    }

    public java.util.HashMap<String, TherapiesData> getTherapies(PatientData pd) {
        final java.util.HashMap<String, TherapiesData> therapiesHash = new java.util.HashMap();
        String query = "SELECT def.name, mode.date \n"
                + "FROM   Commend.dbo.CommendTrtModesDefn def, \n"
                + "       Commend.dbo.CommendTrtModes mode \n"
                + "WHERE  def.modeID = mode.primaryMode \n"
                + "       and mode.SSN = '" + pd.SSN + "' \n"
                + "UNION ALL \n"
                + "SELECT def.name, mode.date  \n"
                + "FROM   Commend.dbo.CommendTrtModesDefn def,  \n"
                + "       Commend.dbo.CommendTrtModes mode \n"
                + "WHERE  def.modeID = mode.secondaryMode \n"
                + "       and mode.secondaryMode != 'null' \n"
                + "       and mode.SSN = '" + pd.SSN + "'";
        
        _dest.query(query, new SQLObject() {
            String name = "";
            TherapiesData td = null;
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                name = rs.getString("name");
                if (therapiesHash.containsKey(name)) {
                    td = therapiesHash.get(name);
                    td.dates.add(rs.getTimestamp("date"));
                } else {
                    td = new TherapiesData();
                    td.name = name;
                    td.dates.add(rs.getTimestamp("date"));
                    therapiesHash.put(name, td);
                }
            }
        });
        return therapiesHash;
    }

    public String getPatientDFN(final String ssn) {
        String query =
                "SELECT DISTINCT PatientIEN \n"
                + "FROM Commend.dbo.CommendDemographics \n"
                + "WHERE SSN = '" + ssn + "'";
        final java.util.List<String> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {
            String name = "";
            TherapiesData td = null;
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("PatientIEN"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(getPatientDFNExternal(ssn));
                }
            }
        });
        return result.get(0);
    }
    
    private String getPatientDFNExternal(String ssn) {
        String query =
                "SELECT DISTINCT PatientIEN \n"
                + "FROM VDWWork.SPatient.SPatient \n"
                + "WHERE PatientSSN = '" + ssn + "'";
        final java.util.List<String> result = new java.util.ArrayList();
        _src.query(query, new SQLObject() {
            String name = "";
            TherapiesData td = null;
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("PatientIEN"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(null);
                }
            }
        });
        return result.get(0);
    }

    public boolean checkCommendAccess(String securityCode) {
        String query = "SELECT * FROM Commend.dbo.CommendAccess WHERE securityCode = '" + securityCode + "'";
        final java.util.List<Boolean> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {
            Boolean status = false;
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                status = true;
            }
            
            @Override
            public void post(){
                result.add(status);
            }
        });
        return result.get(0);
    }

    public String getPatientSSN(String securityCode) {
        if (securityCode == null) {
            return null;
        }        
        
        String query = "SELECT * FROM Commend.dbo.CommendAccess WHERE securityCode = '" + securityCode + "'";
        final java.util.List<String> result = new java.util.ArrayList();
        final java.util.List<String> provider = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {
            
            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("SSN"));
                provider.add(rs.getString("ProviderID"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(null);
                }
            }
        });
        _dest.update("DELETE FROM Commend.dbo.CommendAccess WHERE ProviderID = '" + provider.get(0) + "'");
        return result.get(0);
    }

    public java.util.HashMap<String, Object> getAccess(String securityCode) {
        final java.util.HashMap<String, Object> result = new java.util.HashMap();
        if(securityCode==null || securityCode.isEmpty()){
            return result;
        } else {
            String query = "SELECT * FROM Commend.dbo.CommendAccess WHERE securityCode = '" + securityCode + "'";
            _dest.query(query, new SQLObject() {

                @Override
                public void row(ResultSet rs) throws SQLException {
                    result.put("SSN", rs.getString("SSN"));
                    result.put("providerDUZ", rs.getString("ProviderID"));
                    result.put("time", rs.getTimestamp("DateTimeEntered"));
                    result.put("patientName", rs.getString("PatientName"));
                }
            });
            return result;
        }
    }

    public boolean deleteAccess(String providerDUZ) {
        if(providerDUZ==null) { return false; }
        return _dest.update("DELETE FROM Commend.dbo.CommendAccess WHERE ProviderID = '" + providerDUZ + "'") > 0;
    }

    public int getMaxOutcomeId() {
        String query = "SELECT MAX(CAST(outcomeID AS Int)) As maxId "
                + "FROM Commend.dbo.CommendOutcomeDefn";
        final java.util.List<Integer> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getInt("maxId"));
            }
            
            @Override
            public void post() {
                if(result.isEmpty()) {
                    result.add(-1);
                }
            }
        });
        return result.get(0);
    }

    private int getMaxScaleId() {
        String query = "SELECT MAX(CAST(scaleID AS Int)) As maxId "
                + "FROM Commend.dbo.CommendOutcomeScaleDefn";

        final java.util.List<Integer> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getInt("maxId"));
            }
            
            @Override
            public void post() {
                if(result.isEmpty()) {
                    result.add(-1);
                }
            }
        });
        return result.get(0);
    }

    public java.util.Collection<CustomOutcomeDefinition> getCustomOutcomeDefinition(String providerDUZ) {
        String query = 
                "SELECT def.outcomeID, def.name, def.question, scale.scaleTypeID, scale.goal, scale.freqID, scale.rangeID, scale.SympLimitValue \n"
                + "FROM   Commend.dbo.CommendOutcomeDefn def, \n"
                + "       Commend.dbo.CommendOutcomeScaleDefn scale \n"
                + "WHERE	def.scaleID = scale.scaleID and \n"
                + "           scale.isCustom = 'Y' and \n"
                + "   	def.creatorID = '" + providerDUZ + "' \n"
                + "ORDER BY   def.name ";
        final java.util.Collection<CustomOutcomeDefinition> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                String id = rs.getString("outcomeID");
                String name = rs.getString("name");
                String question = rs.getString("question");
                String scaleTypeID = rs.getString("scaleTypeID");
                String goal = rs.getString("goal");
                String freqID = rs.getString("freqID");
                String rangeID = rs.getString("rangeID");
                String max = rs.getString("SympLimitValue");
                result.add(new CustomOutcomeDefinition(id, name, question, scaleTypeID, goal, max, freqID, rangeID));
            }
        });
        return result;
    }

    public String saveNewOutcome(String name, String question, String scaleId, String goal, String max, boolean isRangeHigher, String freqUnit, String creatorID) {
        int maxId = getMaxOutcomeId();
        maxId++;
        if (maxId < 10000) {
            maxId = 10000;
        }
        String outcomeId = Integer.toString(maxId);
        java.sql.Timestamp today = new java.sql.Timestamp(System.currentTimeMillis());
        String rangeID = "2";
        if (isRangeHigher) {
            rangeID = "1";
        }
        String freqID = null;
        if (freqUnit != null) {
            if (freqUnit.equalsIgnoreCase("Hour")) {
                freqID = "3";
            } else if (freqUnit.equalsIgnoreCase("Day")) {
                freqID = "2";
            } else if (freqUnit.equalsIgnoreCase("Week")) {
                freqID = "1";
            }
        }
        boolean isNewScaleSuccesss = insertNewScaleDeffinition(outcomeId, scaleId, freqID, goal, max, rangeID, creatorID, today);
        String q = "INSERT INTO Commend.dbo.CommendOutcomeDefn (outcomeID,name,question,notes,scaleID,outcomeTypeID,creatorID,createDate,outcStatusID,disabledDate) \n"
                + "VALUES (" + DBC.fixString(outcomeId) + "," + DBC.fixString(name)
                + "," + DBC.fixString(question) + ",null," + DBC.fixString(outcomeId)
                + ",'C'," + DBC.fixString(creatorID) + "," + DBC.fixTimestamp(today) + ",'1',null)";
        boolean isOutcomeDefnSuccesss = _dest.update(q) > 0;
        System.out.println(q + " : " + isOutcomeDefnSuccesss);
        if (isOutcomeDefnSuccesss && isNewScaleSuccesss) {
            return outcomeId;
        }
        deleteOutcome(outcomeId);
        logEvent(null, null, null, null, null, "Custom Outcome save failure. Id: " + outcomeId, "1010");
        return null;
    }

    public boolean updateOutcome(String id, String name, String question) {
        String q = "UPDATE Commend.dbo.CommendOutcomeDefn "
                + "SET name='" + name + "', question='" + question + "' "
                + "WHERE outcomeID='" + id + "'";
        return _dest.update(q) > 0;
    }

    public boolean disableOutcome(String id) {
        String q = "UPDATE Commend.dbo.CommendOutcomeDefn \n"
                + "SET disabledDate=" + DBC.fixTimestamp(new java.sql.Timestamp(new java.util.Date().getTime())) + ", outcStatusID='2' \n"
                + "WHERE outcomeID=" + DBC.fixString(id);
        return _dest.update(q) > 0;
    }

    public boolean deleteOutcome(String id) {
        String q = "DELETE FROM Commend.dbo.CommendOutcomeDefn \n"
                + "WHERE outcomeID=" + DBC.fixString(id) + " \n"
                + "DELETE FROM Commend.dbo.CommendOutcomeScaleDefn \n"
                + "WHERE scaleID=" + DBC.fixString(id);
        return _dest.update(q) > 0;
    }

    public boolean isOutcomeUsed(String id) {
        String query =
                "SELECT * FROM Commend.dbo.CommendOutcomes \n"
                + "WHERE outcomeID=" + DBC.fixString(id);
        final java.util.List<Boolean> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                if(rs.getString("outcomeID")!=null) {
                    result.add(true);
                }
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(false);
                }
            }
        });
        return result.get(0);
    }

    private boolean insertNewScaleDeffinition(String scaleId, String scaleTypeID, String freqID, String goal, String max, String rangeID, String creatorID, java.sql.Timestamp createDate) {
        String q =
                "INSERT INTO Commend.dbo.CommendOutcomeScaleDefn (scaleID,scaleTypeID,freqID,goal,rangeID,SympLimitValue,isCustom,creatorID,createDate,outcStatusID,disabledDate) \n"
                + "VALUES (" + DBC.fixString(scaleId) + "," + DBC.fixString(scaleTypeID)
                + "," + DBC.fixString(freqID) + "," + DBC.fixString(goal)
                + "," + DBC.fixString(rangeID) + "," + DBC.fixString(max)
                + ",'Y'," + DBC.fixString(creatorID) + "," + DBC.fixTimestamp(createDate) + ",'1',null)";
        boolean result = _dest.update(q) > 0;
        System.out.println(q + " : " + result);
        return result;
    }

    private String updateScaleDeffinition(String scaleID, String scaleTypeID, String freqID, String goal, String rangeID, String creatorID, java.sql.Timestamp createDate) {
        int maxId = getMaxScaleId();
        maxId++;
        if (maxId < 10000) {
            maxId = 10000;
        }
        String q = "UPDATE Persons "
                + "SET scaleTypeID='',freqID= ,goal= ,rangeID= ,SympLimitValue= ,isCustom,creatorID,createDate,outcStatusID,disabledDate Address='Nissestien 67', City='Sandnes' "
                + "WHERE scaleID='" + scaleID + "'"
                + "INSERT INTO Commend.dbo.CommendOutcomeScaleDefn"
                + " (scaleID,scaleTypeID,freqID,goal,rangeID,SympLimitValue,isCustom,creatorID,createDate,outcStatusID,disabledDate)"
                + "VALUES ('" + maxId + "','" + scaleTypeID + "'," + freqID + ",'" + goal + "','" + rangeID
                + "',null,'Y','" + creatorID + "','" + createDate + "','1',null)";
        _dest.update(q);
        return Integer.toString(maxId);
    }

    public String getComputerName(String DUZ) {
        String query = "SELECT TOP 1 ComputerName "
                + "FROM Commend.dbo.CommendComputerNames "
                + "WHERE ProviderDUZ = '" + DUZ + "' "
                + "AND ComputerName IS NOT null "
                + "ORDER BY DateEntered DESC";
        final java.util.List<String> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("ComputerName"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add("Unknown");
                }
            }
        });
        return result.get(0);
    }

    public java.util.Map<String,String> getProviderInfo(String DUZ) {
        final java.util.Map<String,String> result = new java.util.HashMap();
        String query = "SELECT * FROM Commend.dbo.CommendProviders WHERE DUZ = '" + DUZ + "'";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.put("name", rs.getString("name"));
                result.put("sta3n", rs.getString("sta3n"));
                result.put("sid", rs.getString("SID"));
                result.put("cosignerSID", rs.getString("cosignerSID"));
                result.put("cosignerDUZ", rs.getString("cosignerDUZ"));
                result.put("cosignerName", rs.getString("cosignerName"));
                result.put("role", rs.getString("role"));
            }
        });
        if(result.isEmpty()) {
            return null;
        }
        return result;
    }

    public String getProviderName(String DUZ) {
        String query = "SELECT * FROM Commend.dbo.CommendProviders WHERE DUZ = '" + DUZ + "'";
        final java.util.List<String> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("name"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add("Unknown");
                }
            }
        });
        return result.get(0);
    }

    public String getProviderSID(String DUZ) {        
        String query = 
                "SELECT DISTINCT TOP 1 SID \n"
                + "FROM Commend.dbo.CommendProviders \n"
                + "WHERE DUZ = "+ DBC.fixString(DUZ);
        final java.util.List<String> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("SID"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(null);
                }
            }
        });
        return result.get(0);
    }

    public String getSta3n(String DUZ) {
        if(DUZ==null) { return null; }        
        String query = 
                "SELECT DISTINCT sta3n \n"
                + "FROM Commend.dbo.CommendProvider \n"
                + "WHERE providerDUZ = " + DBC.fixString(DUZ);
        final java.util.List<String> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("sta3n"));
            }
            
            @Override
            public void post(){
                if(result.isEmpty()) {
                    result.add(null);
                }
            }
        });
        return result.get(0);
    }

    public java.util.Map<String,String> getHistoricNoteTitles(String patientSID, String providerSID) {
        if(patientSID==null || providerSID==null) { return null; }
        final java.util.Map<String,String> result = new java.util.HashMap();
        String query =
                "SELECT TOP 1 \n"
                + "	titleIEN \n"
                + "	,title \n"
                + "FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE patientSID = " + DBC.fixString(patientSID) + " \n"
                + "  AND providerSID = " + DBC.fixString(providerSID);
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.put(rs.getString("titleIEN"), rs.getString("title"));
            }
        });
        if(result.isEmpty()) {
            query =
                    "SELECT DISTINCT TOP 1 \n"
                    + "     n.titleIEN \n"
                    + "     ,n.title \n"
                    + "     ,n.NoteDate \n"
                    + "FROM \n"
                    + "     Commend.dbo.CommendProgressNote n, \n"
                    + "	    Commend.dbo.CommendDemographics d, \n"
                    + "     Commend.dbo.CommendProviders p \n"
                    + "WHERE \n"
                    + "	    d.PatientSID = " + DBC.fixString(patientSID) + " \n"
                    + " AND p.SID = " + DBC.fixString(providerSID) + " \n"
                    + " AND n.PatientSID = d.PatientSID \n"
                    + " AND p.SID = n.ProviderSID \n"
                    + "ORDER BY n.NoteDate desc";
            _dest.query(query, new SQLObject() {

                @Override
                public void row(ResultSet rs) throws SQLException {
                    result.put(rs.getString("titleIEN"), rs.getString("title"));
                }
            });
        }
        return result;
    }

    public boolean logNoteError(String providerSta3n, String providerDUZ, String providerSID, String providerName,
                                String patientSta3n, String patientDFN, String patientSID, String patientName,
                                String titleIEN, String encounterString, String noteText,
                                String cosignerSta3n, String cosignerDUZ, String cosignerSID, String cosignerName,
                                String messageMDWS, String stackTraceMDWS) {
        java.sql.Timestamp errorDate = new java.sql.Timestamp(System.currentTimeMillis());
        String q =
            "INSERT INTO Commend.dbo.CommendProgressNoteErrorLog (providerSta3n,providerDUZ,providerSID,providerName,patientSta3n,patientDFN,patientSID,patientName,titleIEN,encounterString,noteText,errorDate,cosignerSta3n,cosignerDUZ,cosignerSID,cosignerName,messageMDWS,stackTraceMDWS) \n"
            + "VALUES ("  + DBC.fixString(providerSta3n) + "," + DBC.fixString(providerDUZ) + ","
                + DBC.fixString(providerSID) + "," + DBC.fixString(providerName) + ","
                + DBC.fixString(patientSta3n) + "," + DBC.fixString(patientDFN) + ","
                + DBC.fixString(patientSID) + "," + DBC.fixString(patientName) + ","
                + DBC.fixString(titleIEN) + "," + DBC.fixString(encounterString) + ","
                + DBC.fixString(noteText) + "," + DBC.fixTimestamp(errorDate) + ","
                + DBC.fixString(cosignerSta3n) + "," + DBC.fixString(cosignerDUZ) + ","
                + DBC.fixString(cosignerSID) + "," + DBC.fixString(cosignerName) + ","
                + DBC.fixString(messageMDWS) + "," + DBC.fixString(stackTraceMDWS) + ")";

        return _dest.update(q) > 0;
    }

    public void logFeedback(java.sql.Timestamp date, String SSN, String providerDUZ, String feedback, String type) {
        String q = "INSERT INTO Commend.dbo.CommendLogFeedback (logtime,SSN,providerDUZ,feedbacktext,type,action) \n"
                + "VALUES(" + returnFormatedDateTime(date) + "," + returnFormattedString(SSN) + "," + returnFormattedString(providerDUZ) + "," + returnFormattedString(feedback) + "," + returnFormattedString(type) + ",'1');";
        _dest.update(q);
    }

    public void logEvent(java.sql.Timestamp eventtime, java.sql.Timestamp logtime, String patientSSN, String providerDUZ, String clientComputer, String event, String eventId) {
        if (eventtime == null) {
            eventtime = new java.sql.Timestamp(System.currentTimeMillis());
        }
        if (logtime == null) {
            logtime = new java.sql.Timestamp(System.currentTimeMillis());
        }
        if ((clientComputer != null) && (clientComputer.equalsIgnoreCase("null") || clientComputer.equalsIgnoreCase("undefined"))) {
            clientComputer = null;
        }
        String q = "INSERT INTO Commend.dbo.CommendLogTrace (eventtime,logtime,patientSSN,providerDUZ,clientComputer,event,eventID) \n"
                + "VALUES(" + returnFormatedDateTime(eventtime) + "," + returnFormatedDateTime(logtime) + ","
                + returnFormattedString(patientSSN) + "," + returnFormattedString(providerDUZ) + ","
                + returnFormattedString(clientComputer) + "," + returnFormattedString(event) + ","
                + returnFormattedInteger(eventId) + ");";
        _dest.update(q);
    }
    
    public boolean saveDraft(CommendWebappManager manager, java.util.Map map, NoteBuilder note) {
        String query =
                "DELETE FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE providerSID = " + DBC.fixString(manager.providerSID) + " \n"
                + "  AND patientSID = " + DBC.fixString(manager.currentPatient.patientSID) + " \n"
                + "INSERT INTO Commend.dbo.CommendProgressNoteDraft (sta3n,patientDFN,patientSID,patientSSN,providerDUZ,providerSID,dateEncounter,dateNote,noteText,titleIEN,title) \n"
                + "VALUES ("
                + DBC.fixString(manager.providerSta3n) + ","
                + DBC.fixString(manager.currentPatient.patientIEN) + ","
                + DBC.fixString(manager.currentPatient.patientSID) + ","
                + DBC.fixString(manager.currentPatient.SSN) + ","
                + DBC.fixString(manager.providerDUZ) + ","
                + DBC.fixString(manager.providerSID) + ","
                + DBC.fixTimestamp(note.encounterDate) + ","
                + DBC.fixTimestamp(note.noteDate) + ","
                + DBC.fixString(note.toString()) + ","
                + DBC.fixString((String)map.get("titleIEN")) + ","
                + DBC.fixString((String)map.get("title")) + ")";
        return _dest.update(query) > 0;
    }

    public java.util.Map getDraft(String providerSID, String patientSID) {
        final java.util.Map result = new java.util.HashMap();
        String query =
                "SELECT TOP 1 * FROM Commend.dbo.CommendProgressNoteDraft \n"
                + "WHERE providerSID = " + DBC.fixString(providerSID) + " \n"
                + "  AND patientSID = " + DBC.fixString(patientSID);
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.put("sta3n",rs.getString("sta3n"));
                result.put("patientDFN",rs.getString("patientDFN"));
                result.put("patientSID",rs.getString("patientSID"));
                result.put("patientSSN",rs.getString("patientSSN"));
                result.put("providerDUZ",rs.getString("providerDUZ"));
                result.put("providerSID",rs.getString("providerSID"));
                result.put("dateEncounter",rs.getString("dateEncounter"));
                result.put("dateNote",rs.getString("dateNote"));
                result.put("noteText",rs.getString("noteText"));
                result.put("titleIEN",rs.getString("titleIEN"));
                result.put("title",rs.getString("title"));
            }
        });
        return result;
    }
        
    public void logEvent(java.sql.Timestamp eventtime, java.sql.Timestamp logtime, String patientSSN, String providerDUZ, String clientComputer, String event) {
        logEvent(eventtime, logtime, patientSSN, providerDUZ, clientComputer, event, null);
    }

    public String returnFormattedInteger(String str) {
        int i;
        String result;
        try {
            i = Integer.parseInt(str);
        } catch (java.lang.NumberFormatException e) {
            i = Integer.MIN_VALUE;
        }
        if (i != Integer.MIN_VALUE) {
            result = "" + i;
        } else {
            result = null;
        }
        return result;
    }

    public String returnFormattedString(String str) {
        if (str != null) {
            return "'" + addSQLExcapeCharactersForInsert(str) + "'";
        }
        return null;
    }

    public String returnFormatedDateTime(java.sql.Timestamp dateTime) {
        if (dateTime != null) {
            return "'" + dateTime + "'";
        }
        return null;
    }

    private String addSQLExcapeCharactersForInsert(String str) {// exampel: Bob's car.  The "'" will excape SQL and cause errors.
        String curr = str;
        if (str == null) {
            return curr;
        }
        int index = str.indexOf('\'');
        if (index > -1) {
            String start = str.substring(0, index);
            String end = str.substring(index + 1, str.length());
            start = start + "''";
            curr = start + addSQLExcapeCharactersForInsert(end);
        }
        return curr;
    }
}
