package com.medcisive.commend.server.site;

import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.SQLObject;
import com.medcisive.utility.sql2.SQLTable;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;

/**
 *
 * @author vhapalchambj
 */
public class CommendSiteDatabaseController extends com.medcisive.utility.sql2.DBCUtil {

    private String _sta3n = null;

    public CommendSiteDatabaseController() {
    }

    public CommendSiteDatabaseController(String sta3n) {
        _sta3n = sta3n;
    }

    public java.util.ArrayList<String> getPatients(String duz) {
        if (duz == null) {
            return null;
        }
        final java.util.ArrayList<String> result = new java.util.ArrayList();
        String query
                = "SELECT DISTINCT pat.patientIEN \n"
                + "FROM Commend.dbo.CommendVISNPatientPanel panel, \n"
                + "     Commend.dbo.CommendVISNPatient pat, \n"
                + "     Commend.dbo.CommendVISNEncSummary enc \n"
                + "WHERE pat.patientIEN = panel.patientIEN \n"
                + "  AND enc.patientIEN = pat.patientIEN \n"
                + "  AND panel.providerDUZ = '" + duz + "'";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("patientIEN"));
            }
        });
        return result;
    }

    public SQLTable getOEF4Panel(String sid) {
        if (sid == null) {
            return null;
        }
        String query
                = "SELECT DISTINCT \n"
                + "	enc.patientName \n"
                + "	,enc.sta3n \n"
                + "	,enc.patientIEN \n"
                + "	,enc.patientSID \n"
                + "	,enc.qualify2 \n"
                + "	,enc.status \n"
                + "	,enc.numCompleted \n"
                + "	,enc.deadline \n"
                + "	,enc.windowStart \n"
                + "	,enc.windowEnd \n"
                + "	,enc.measureType \n"
                + "	,pat.OEFOIFService \n"
                + "     ,panel.FYM1Flag \n"
                + "     ,panel.FYM0Flag \n"
                + "     ,app.pcMissedMH \n"
                + "     ,app.totMHOneYear \n"
                + "     ,app.pcMissedNonMH \n"
                + "     ,app.totNonMHOneYear \n"
                + "     ,app.numAppts8weeks \n"
                + "FROM Commend.dbo.CommendVISNPatientPanel panel \n"
                + "     ,Commend.dbo.CommendVISNPatient pat \n"
                + "     ,Commend.dbo.CommendVISNEncSummary enc \n"
                + "     ,Commend.dbo.CommendVISNApptSummary app \n"
                + "WHERE pat.patientSID = panel.patientSID \n"
                + "  AND enc.patientSID = pat.patientSID \n"
                + "  AND app.patientSID = enc.patientSID \n"
                + "  AND panel.staffSID = " + DBC.fixString(sid) + " \n"
                + "  AND pat.sta3n = panel.sta3n \n"
                + "  AND enc.sta3n = pat.sta3n \n"
                + "  AND enc.sta3n = " + DBC.fixString(_sta3n) + " \n"
                + "  AND enc.status != 'NoQualifyingDate' \n"
                + "  AND enc.status != 'Failed' \n"
                + "  AND enc.status != 'Exclude' \n"
                + "  AND enc.measureType != 'RM' \n"
                + "ORDER BY enc.patientName, enc.qualify2";
        return _dest.getTable(query);
    }

    public SQLTable getGraphData(String sid, String type) {
        if (sid == null || type == null) {
            return null;
        }
        String query
                = "SELECT DISTINCT \n"
                + "      data.sta3n \n"
                + "      ,data.ien \n"
                + "      ,data.jsonObject \n"
                + "FROM Commend.dbo.CommendVISNGraphData data, \n"
                + "     Commend.dbo.CommendVISNEncSummary enc, \n"
                + "     Commend.dbo.CommendVISNPatientPanel panel \n"
                + "WHERE enc.patientIEN = data.ien \n"
                + "  AND panel.patientIEN = enc.patientIEN \n"
                + "  AND data.sta3n = enc.sta3n \n"
                + "  AND data.measureType = " + DBC.fixString(type) + " \n"
                + "  AND enc.measureType = data.measureType \n"
                + "  AND panel.staffSID = " + DBC.fixString(sid);
        return _dest.getTable(query);
    }

    public SQLTable getGraphJSON(String ien, String type) {
        if (ien == null || type == null) {
            return null;
        }
        String query
                = "SELECT DISTINCT \n"
                + "      data.jsonObject \n"
                + "FROM Commend.dbo.CommendVISNGraphData data \n"
                + "WHERE data.ien = " + DBC.fixString(ien) + " \n"
                + "  AND data.measureType = " + DBC.fixString(type);
        return _dest.getTable(query);
    }

    public SQLTable getGraphDataWithinRange(java.sql.Timestamp start, java.sql.Timestamp end) {
        if ((start == null) || (end == null)) {
            return null;
        }
        String query
                = "SELECT DISTINCT \n"
                + "     data.sta3n \n"
                + "     ,data.ien \n"
                + "     ,data.jsonObject \n"
                + "FROM Commend.dbo.CommendVISNGraphData data, \n"
                + "     Commend.dbo.CommendVISNEncSummary enc, \n"
                + "     Commend.dbo.CommendVISNPatient pat \n"
                + "WHERE enc.patientIEN = data.ien \n"
                + "  AND pat.patientIEN = enc.patientIEN \n"
                + "  AND enc.sta3n = data.sta3n \n"
                + "  AND pat.sta3n = enc.sta3n \n"
                + "  AND pat.OEFOIFService = 'Y' \n"
                + "  AND enc.measureType != 'RM' \n"
                + "  AND enc.status != 'NoQualifyingDate' \n"
                + "  AND enc.status != 'Exclude' \n"
                + "  AND enc.deadline BETWEEN " + DBC.fixTimestamp(start) + " AND " + DBC.fixTimestamp(end) + " \n";
        return _dest.getTable(query);
    }

    public SQLTable getOEF4DeadlineReportWithinRange(java.sql.Timestamp start, java.sql.Timestamp end) {
        if ((start == null) || (end == null)) {
            return null;
        }
        String query
                = "SELECT \n"
                + "	enc.patientName \n"
                + "     ,inst.institutionName \n"
                + "     ,enc.patientIEN \n"
                + "	,enc.status \n"
                + "	,enc.deadline \n"
                + "	,enc.numCompleted \n"
                + "	,enc.windowStart \n"
                + "	,enc.windowEnd \n"
                + "	,enc.qualify2 \n"
                + "     ,app.pcMissedMH \n"
                + "     ,app.totMHOneYear \n"
                + "     ,app.pcMissedNonMH \n"
                + "     ,app.totNonMHOneYear \n"
                + "     ,app.numAppts8weeks \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNEncSummary enc \n"
                + "	,Commend.dbo.CommendVISNPatient ser \n"
                + "     ,Commend.dbo.CommendVISNPatientInstitution inst \n"
                + "     ,Commend.dbo.CommendVISNApptSummary app \n"
                + "WHERE \n"
                + "     enc.patientSID = ser.PatientSID \n"
                + "AND app.patientSID = enc.patientSID \n"
                + "AND enc.status != 'Exclude' \n"
                + "AND enc.status != 'NoQualifyingDate' \n"
                + "AND enc.deadline BETWEEN " + DBC.fixTimestamp(start) + " AND " + DBC.fixTimestamp(end) + " \n"
                + "AND enc.measureType != 'RM' \n"
                + "AND ser.OEFOIFService = 'Y' \n"
                + "AND ser.patientSID = inst.patientSID \n"
                + "ORDER BY enc.patientName";
        return _dest.getTable(query);
    }

    public SQLTable getOEF4QualifyingReportWithinRange(java.sql.Timestamp start, java.sql.Timestamp end) {
        if ((start == null) || (end == null)) {
            return null;
        }
        String query
                = "SELECT \n"
                + "	enc.patientName \n"
                + "     ,inst.institutionName \n"
                + "     ,enc.patientIEN \n"
                + "	,enc.status \n"
                + "	,enc.deadline \n"
                + "	,enc.numCompleted \n"
                + "	,enc.windowStart \n"
                + "	,enc.windowEnd \n"
                + "	,enc.qualify2 \n"
                + "     ,app.pcMissedMH \n"
                + "     ,app.totMHOneYear \n"
                + "     ,app.pcMissedNonMH \n"
                + "     ,app.totNonMHOneYear \n"
                + "     ,app.numAppts8weeks \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNEncSummary enc \n"
                + "	,Commend.dbo.CommendVISNPatient ser \n"
                + "     ,Commend.dbo.CommendVISNPatientInstitution inst \n"
                + "     ,Commend.dbo.CommendVISNApptSummary app \n"
                + "WHERE \n"
                + "     enc.patientSID = ser.PatientSID \n"
                + "AND app.patientSID = enc.patientSID \n"
                + "AND enc.status != 'Exclude' \n"
                + "AND enc.status != 'NoQualifyingDate' \n"
                + "AND enc.qualify2 BETWEEN " + DBC.fixTimestamp(start) + " AND " + DBC.fixTimestamp(end) + " \n"
                + "AND enc.measureType != 'RM' \n"
                + "AND ser.OEFOIFService = 'Y' \n"
                + "AND ser.patientSID = inst.patientSID \n"
                + "ORDER BY enc.patientName";
        return _dest.getTable(query);
    }

    public SQLTable getProviders() {
        String query
                = "SELECT DUZ \n"
                + "     ,name \n"
                + "FROM Commend.dbo.CommendProviders \n"
                + "WHERE name not in ('CHAMBERS,JUSTIN G','BARBER,HARLEY M JR','WANG,DAN Y') \n"
                + "ORDER BY name";
        return _dest.getTable(query);
    }

    public SQLTable getAvailableProviders(java.util.List list) {
        String query
                = "SELECT prov.sta3n         AS providerSta3n \n"
                + "     ,prov.staffSID     AS providerSID \n"
                + "     ,prov.providerDUZ  AS providerDUZ \n"
                + "     ,prov.providerName AS providerName \n"
                + "     ,prop.Role         AS Role \n"
                + "FROM Commend.dbo.CommendVISNProvider prov \n"
                + "     LEFT JOIN Commend.dbo.CommendVISNProviderProperties prop \n"
                + "     ON prov.sta3n = prop.Sta3n \n"
                + "     AND prov.staffSID = prop.ProviderSID \n"
                + "WHERE \n"
                + "	prov.staffSID not in " + DBC.javaListToSQLList(list);
        return _dest.getTable(query);
    }

    public SQLTable getEncounterStatistics(String wgId, String offset, String catId) {
        String query
                = "SELECT DISTINCT \n"
                + "     m.providerName AS name \n"
                + "	,s.staffSID \n"
                + "	,s.wgID \n"
                + "	,s.offset \n"
                + "	,s.offsetType \n"
                + "	,s.EncInd \n"
                + "	,s.PatInd \n"
                + "     ,s.EncEva \n"
                + "     ,s.PatEva \n"
                + "     ,s.EncP60 \n"
                + "     ,s.PatP60 \n"
                + "     ,s.EncP90 \n"
                + "     ,s.PatP90 \n"
                + "     ,s.EncPMM \n"
                + "     ,s.PatPMM \n"
                + "     ,s.EncCM \n"
                + "     ,s.PatCM \n"
                + "     ,s.EncMM \n"
                + "     ,s.PatMM \n"
                + "	,s.EncGro \n"
                + "	,s.PatGro \n"
                + "	,s.EncTel \n"
                + "	,s.PatTel \n"
                + "	,s.EncOth \n"
                + "	,s.PatOth \n"
                + "	,s.EncTot \n"
                + "	,s.PatTot \n"
                + "	,s.wRVUTot \n"
                + "	,s.FTE \n"
                + "	,s.wRVUFilter \n"
                + "     ,p.Role \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNProviderStatistics s, \n"
                + "	Commend.dbo.CommendVISNWorkGroupMembers m, \n"
                + "     Commend.dbo.CommendVISNProviderProperties p \n"
                + "WHERE \n"
                + "	m.providerSID = s.staffSID \n"
                + "     AND p.ProviderSID = m.providerSID \n"
                + "	AND m.wgID = " + DBC.fixString(wgId) + " \n"
                + "     AND s.wgID is NULL \n"
                + "	AND s.offsetType = " + DBC.fixString(catId) + " \n"
                + "	AND s.offset = " + DBC.fixString(offset) + " \n"
                + "GROUP BY m.providerName, s.staffSID,s.wgID,s.offset,s.offsetType,s.EncInd,s.PatInd,s.EncEva,s.PatEva,s.EncP60,s.PatP60,s.EncP90,s.PatP90,s.EncPMM,s.PatPMM,s.EncCM,s.PatCM,s.EncMM,s.PatMM,s.EncGro,s.PatGro,s.EncTel,s.PatTel,s.EncOth,s.PatOth,s.EncTot,s.PatTot,s.wRVUTot,s.FTE,s.wRVUFilter,p.Role \n"
                + "UNION \n"
                + "SELECT DISTINCT \n"
                + "     'TOTAL' AS name \n"
                + "	,s.staffSID \n"
                + "	,s.wgID \n"
                + "	,s.offset \n"
                + "	,s.offsetType \n"
                + "	,s.EncInd \n"
                + "	,s.PatInd \n"
                + "     ,s.EncEva \n"
                + "     ,s.PatEva \n"
                + "     ,s.EncP60 \n"
                + "     ,s.PatP60 \n"
                + "     ,s.EncP90 \n"
                + "     ,s.PatP90 \n"
                + "     ,s.EncPMM \n"
                + "     ,s.PatPMM \n"
                + "     ,s.EncCM \n"
                + "     ,s.PatCM \n"
                + "     ,s.EncMM \n"
                + "     ,s.PatMM \n"
                + "	,s.EncGro \n"
                + "	,s.PatGro \n"
                + "	,s.EncTel \n"
                + "	,s.PatTel \n"
                + "	,s.EncOth \n"
                + "	,s.PatOth \n"
                + "	,s.EncTot \n"
                + "	,s.PatTot \n"
                + "	,s.wRVUTot \n"
                + "	,s.FTE \n"
                + "	,s.wRVUFilter \n"
                + "     ,'--' AS Role \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNProviderStatistics s \n"
                + "WHERE \n"
                + "	s.wgID = " + DBC.fixString(wgId) + " \n"
                + "	AND s.offsetType = " + DBC.fixString(catId) + " \n"
                + "	AND s.offset = " + DBC.fixString(offset) + " \n"
                + "GROUP BY s.staffSID,s.wgID,s.offset,s.offsetType,s.EncInd,s.PatInd,s.EncEva,s.PatEva,s.EncP60,s.PatP60,s.EncP90,s.PatP90,s.EncPMM,s.PatPMM,s.EncCM,s.PatCM,s.EncMM,s.PatMM,s.EncGro,s.PatGro,s.EncTel,s.PatTel,s.EncOth,s.PatOth,s.EncTot,s.PatTot,s.wRVUTot,s.FTE,s.wRVUFilter \n";
        SQLTable result = _dest.getTable(query);
        return result;
    }

    public String getSSNbyIEN(String ien) {
        if (ien == null) {
            return null;
        }
        final java.util.List<String> result = new java.util.ArrayList();
        String query = "SELECT DISTINCT patientSSN \n"
                + "FROM Commend.dbo.CommendVISNPatient \n"
                + "WHERE patientIEN = '" + ien + "'";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("patientSSN"));
            }
        });
        return result.get(0);
    }

    public java.util.ArrayList<java.util.Map<String, Object>> getPatientEncounterFlatten(String ssn) {
        if (ssn == null) {
            return null;
        }
        final java.util.ArrayList<java.util.Map<String, Object>> result = new java.util.ArrayList();
        String query = "SELECT * \n"
                + "FROM Commend.dbo.CommendVISNEncounterFlatten \n"
                + "WHERE SSN = '" + ssn + "' \n"
                + "ORDER BY encounterDate DESC";
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                java.util.Map<String, Object> map = new java.util.HashMap();
                map.put("SSN", rs.getString("SSN"));
                map.put("sta3n", rs.getString("sta3n"));
                map.put("encounterDate", rs.getTimestamp("encounterDate"));
                map.put("cssClass", rs.getString("cssClass"));
                map.put("procedureType", rs.getString("procedureType"));
                map.put("cptCodes", rs.getString("cptCodes"));
                map.put("primaryDiagnosis", rs.getString("primaryDiagnosis"));
                map.put("secondaryDiagnosis", rs.getString("secondaryDiagnosis"));
                result.add(map);
            }
        });
        return result;
    }

    public int addGroup(int sta3n, int sid, String wgName) {
        String query
                = "INSERT INTO Commend.dbo.CommendVISNWorkGroups (wgID,wgName,wgDescription,ownerSta3n,ownerDUZ,ownerSID,ownerName,status,createDate,lastModified,isDefaultWG) \n"
                + "SELECT DISTINCT \n"
                + "     (SELECT max(wgID)+1 FROM Commend.dbo.CommendVISNWorkGroups) AS wgID \n"
                + "     ," + DBC.fixString(wgName) + " AS wgName \n"
                + "     ," + DBC.fixString(wgName) + " AS wgDescription \n"
                + "     ,sta3n AS ownerSta3n \n"
                + "     ,DUZ AS ownerDUZ \n"
                + "     ,SID AS ownerSID \n"
                + "     ,name AS ownerName \n"
                + "     ,'A' AS status \n"
                + "     ,GETDATE() AS createDate \n"
                + "     ,GETDATE() AS lastModified \n"
                + "     ,'N' AS isDefaultWG \n"
                + "FROM Commend.dbo.CommendProviders \n"
                + "WHERE \n"
                + "     sta3n=" + sta3n + " \n"
                + " AND SID=" + sid;
        _dest.update(query);
        query
                = "SELECT DISTINCT wgID \n"
                + "FROM Commend.dbo.CommendVISNWorkGroups \n"
                + "WHERE wgName = " + DBC.fixString(wgName) + " \n"
                + "  AND ownerSID = " + sid;
        final java.util.List<Integer> result = new java.util.ArrayList();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getInt("wgID"));
            }
        });
        if (result.isEmpty()) {
            result.add(-1);
        }
        return result.get(0);
    }

    public String addAllGroup(int sta3n, int sid) {
        if (sid < 0) {
            return null;
        }
        String result = null;
        int wgId = addGroup(sta3n, sid, "All");
        String query
                = "INSERT INTO Commend.dbo.CommendVISNWorkGroupMembers (providerSta3n,providerDUZ,providerSID,providerName,wgID,status,createDate,lastModified) \n"
                + "SELECT DISTINCT \n"
                + "	sta3n AS providerSta3n \n"
                + "     ,providerDUZ AS providerDUZ \n"
                + "     ,staffSID AS providerSID \n"
                + "     ,providerName AS providerName \n"
                + "     ," + wgId + " AS wgID \n"
                + "     ,'A' AS status \n"
                + "     ,GETDATE() AS createDate \n"
                + "     ,GETDATE() AS lastModified \n"
                + "FROM Commend.dbo.CommendVISNProvider \n";
        _dest.update(query);
        return result;
    }

    public SQLTable getGroupStatistics(int wgId, int offset, int id) {
        String query
                = "SELECT * \n"
                + "FROM Commend.dbo.CommendVISNGroupStatistics \n"
                + "WHERE WgID = " + wgId + " \n"
                + "  AND TemporalOffset = " + offset + " \n"
                + "  AND TemporalID = " + id + " \n"
                + "ORDER BY Name";
        SQLTable result = _dest.getTable(query);
        return result;
    }

    public SQLTable getOEF4StatisticsData(java.sql.Timestamp start, java.sql.Timestamp end, String list) {
        String query
                = "SELECT \n"
                + "	providerSID \n"
                + "	,SUM(complete) AS complete \n"
                + "	,SUM(incomplete) AS incomplete \n"
                + "	,SUM(qualified) AS qualified \n"
                + "FROM Commend.dbo.CommendVISNOEF4Counts \n"
                + "WHERE spanStart < " + DBC.fixTimestamp(end) + "  -- end date \n"
                + "AND spanEnd > " + DBC.fixTimestamp(start) + " -- start date \n"
                + "AND providerSID in (" + list + ") \n"
                + "GROUP BY providerSID";
        return _dest.getTable(query);
    }
}
