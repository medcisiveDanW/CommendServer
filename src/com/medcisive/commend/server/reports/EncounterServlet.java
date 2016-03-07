package com.medcisive.commend.server.reports;

import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLTable;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author vhapalchambj
 */
public class EncounterServlet extends DBCServlet {

    @Override
    public Object process(HttpServletRequest request) {
        Object result = null;
        String option = (String) request.getParameter("option");
        if (option.equalsIgnoreCase("getEncounterStatistics")) {
            result = _getEncounterStatistics(request);
        } else if (option.equalsIgnoreCase("getProviderPatientEncounterBreakdown")) {
            result = _getProviderPatientEncounterBreakdown(request);
        } else if (option.equalsIgnoreCase("getProviderPatientTotalEncounterBreakdown")) {
            result = _getProviderPatientTotalEncounterBreakdown(request);
        }
        return result;
    }

    private Object _getEncounterStatistics(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        String catIdStr = (String) request.getParameter("temporalCatId");
        String offsetStr = (String) request.getParameter("temporalOffset");
        int wgId = Integer.parseInt(wgIdStr);
        int catId = Integer.parseInt(catIdStr);
        int offset = Integer.parseInt(offsetStr);
        return getEncounterStatistics(wgId, catId, offset);
    }
    
    public Object getEncounterStatistics(int wgId, int catId, int offset){
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.putAll(ReportsServlet.getStartEnd(catId, offset));
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
                + "	AND m.wgID = " + wgId + " \n"
                + "     AND s.wgID is NULL \n"
                + "	AND s.offsetType = " + catId + " \n"
                + "	AND s.offset = " + offset + " \n"
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
                + "	s.wgID = " + wgId + " \n"
                + "	AND s.offsetType = " + catId + " \n"
                + "	AND s.offset = " + offset + " \n"
                + "GROUP BY s.staffSID,s.wgID,s.offset,s.offsetType,s.EncInd,s.PatInd,s.EncEva,s.PatEva,s.EncP60,s.PatP60,s.EncP90,s.PatP90,s.EncPMM,s.PatPMM,s.EncCM,s.PatCM,s.EncMM,s.PatMM,s.EncGro,s.PatGro,s.EncTel,s.PatTel,s.EncOth,s.PatOth,s.EncTot,s.PatTot,s.wRVUTot,s.FTE,s.wRVUFilter \n";
        result.put("data", _dest.getTable(query));
        return result;
    }
    
    private Object _getProviderPatientEncounterBreakdown(HttpServletRequest request) {
        String providerSIDStr = (String) request.getParameter("providerSID");
        String catIdStr = (String) request.getParameter("temporalCatId");
        String offsetStr = (String) request.getParameter("temporalOffset");
        int sid = Integer.parseInt(providerSIDStr);
        int catId = Integer.parseInt(catIdStr);
        int offset = Integer.parseInt(offsetStr);
        return getProviderPatientEncounterBreakdown(sid,catId,offset);
    }
    
    public Object getProviderPatientEncounterBreakdown(int sid, int catId, int offset) {
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.putAll(ReportsServlet.getStartEnd(catId, offset));
        java.util.Map<String, java.sql.Timestamp> timestamps = new java.util.HashMap();
        timestamps.putAll(ReportsServlet.getStartEndTimestamp(catId, offset));
        String query
                = "select pt.Sta3n, \n"
                + "       pt.PatientSID, \n"
                + "       pt.PatientName, \n"
                + "       pfe.encounterClass, \n"
                + "       count(*) as numEncounters \n"
                + "from CommendVISNFlatEncounters pfe \n"
                + " join VDWWork.SPatient.SPatient pt on \n"
                + "      pt.sta3n = pfe.sta3n and \n"
                + "      pt.patientSID = pfe.patientSID \n"
                + "where pfe.providerSID = " + sid + " \n"
                + "  and pfe.visitDateTime >= " + DBC.fixTimestamp(timestamps.get("start")) + " \n"
                + "  and pfe.visitDateTime < " + DBC.fixTimestamp(timestamps.get("end")) + " \n"
                + "group by pt.Sta3n, pt.PatientSID, pt.PatientName, pfe.encounterClass \n"
                + "order by pt.PatientSID, pt.PatientName, pfe.encounterClass";
        final SQLTable data = new SQLTable();
        _dest.query(query, new com.medcisive.utility.sql2.SQLObject() {
            int patientSID = -1;
            java.util.LinkedHashMap<String, Object> row = null;

            @Override
            public void row(ResultSet rs) throws SQLException {
                int currentSID = rs.getInt("PatientSID");
                if (currentSID != patientSID) {
                    if (row != null) {
                        data.addRow(row);
                    }
                    patientSID = currentSID;
                    row = new java.util.LinkedHashMap();
                    row.put("Sta3n", rs.getInt("Sta3n"));
                    row.put("PatientSID", rs.getInt("PatientSID"));
                    row.put("PatientName", rs.getString("PatientName"));
                    row.put("EVALUATION", 0);
                    row.put("PSYCHOTHERAPY_60MINUTE", 0);
                    row.put("PSYCHOTHERAPY_90MINUTE", 0);
                    row.put("PSYCHOTHERAPY_WITH_MEDICATION_MANAGEMENT", 0);
                    row.put("CASE_MANAGEMENT", 0);
                    row.put("MEDICATION_MANAGEMENT", 0);
                    row.put("GROUP", 0);
                    row.put("TELEPHONE", 0);
                    row.put("OTHER", 0);
                }
                row.put(rs.getString("encounterClass"), rs.getInt("numEncounters"));
            }

            @Override
            public void post() {
                if (row != null) {
                    data.addRow(row);
                }
                data.applyChanges();
            }
        });
        result.put("data", data);
        return result;
    }    
    
    private Object _getProviderPatientTotalEncounterBreakdown(HttpServletRequest request) {
        String providerSIDStr = (String) request.getParameter("providerSID");
        String catIdStr = (String) request.getParameter("temporalCatId");
        String offsetStr = (String) request.getParameter("temporalOffset");
        int sid = Integer.parseInt(providerSIDStr);
        int catId = Integer.parseInt(catIdStr);
        int offset = Integer.parseInt(offsetStr);
        return getProviderPatientTotalEncounterBreakdown(sid,catId,offset);
    }
    
    public Object getProviderPatientTotalEncounterBreakdown(int sid, int catId, int offset) {
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.putAll(ReportsServlet.getStartEnd(catId, offset));
        java.util.Map<String, java.sql.Timestamp> timestamps = new java.util.HashMap();
        timestamps.putAll(ReportsServlet.getStartEndTimestamp(catId, offset));
        String query =
                "SELECT DISTINCT sta3n, patientSID \n" +
                "FROM Commend.dbo.CommendVISNFlatEncounters \n" +
                "WHERE visitDateTime >= " + DBC.fixTimestamp(timestamps.get("start")) + " \n" +
                "  AND visitDateTime < " + DBC.fixTimestamp(timestamps.get("end")) + " \n" +
                "  AND providerSID = " + sid;
        final java.util.List<Integer> patientSIDs = new java.util.ArrayList();
        _dest.query(query, new com.medcisive.utility.sql2.SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                patientSIDs.add(rs.getInt("patientSID"));
            }
        });
        query   = "select pt.Sta3n, \n"
                + "       pt.PatientSID, \n"
                + "       pt.PatientName, \n"
                + "       pfe.encounterClass, \n"
                + "       count(*) as numEncounters \n"
                + "from CommendVISNFlatEncounters pfe \n"
                + " join VDWWork.SPatient.SPatient pt on \n"
                + "      pt.sta3n = pfe.sta3n and \n"
                + "      pt.patientSID = pfe.patientSID \n"
                + "where pfe.patientSID in " + DBC.javaListToSQLList(patientSIDs) + " \n"
                + "  and pfe.visitDateTime >= " + DBC.fixTimestamp(timestamps.get("start")) + " \n"
                + "  and pfe.visitDateTime < " + DBC.fixTimestamp(timestamps.get("end")) + " \n"
                + "group by pt.Sta3n, pt.PatientSID, pt.PatientName, pfe.encounterClass \n"
                + "order by pt.PatientSID, pt.PatientName, pfe.encounterClass";
        final SQLTable data = new SQLTable();
        _dest.query(query, new com.medcisive.utility.sql2.SQLObject() {
            int patientSID = -1;
            java.util.LinkedHashMap<String, Object> row = null;

            @Override
            public void row(ResultSet rs) throws SQLException {
                int currentSID = rs.getInt("PatientSID");
                if (currentSID != patientSID) {
                    if (row != null) {
                        data.addRow(row);
                    }
                    patientSID = currentSID;
                    row = new java.util.LinkedHashMap();
                    row.put("Sta3n", rs.getInt("Sta3n"));
                    row.put("PatientSID", rs.getInt("PatientSID"));
                    row.put("PatientName", rs.getString("PatientName"));
                    row.put("EVALUATION", 0);
                    row.put("PSYCHOTHERAPY_60MINUTE", 0);
                    row.put("PSYCHOTHERAPY_90MINUTE", 0);
                    row.put("PSYCHOTHERAPY_WITH_MEDICATION_MANAGEMENT", 0);
                    row.put("CASE_MANAGEMENT", 0);
                    row.put("MEDICATION_MANAGEMENT", 0);
                    row.put("GROUP", 0);
                    row.put("TELEPHONE", 0);
                    row.put("OTHER", 0);
                }
                row.put(rs.getString("encounterClass"), rs.getInt("numEncounters"));
            }

            @Override
            public void post() {
                if (row != null) {
                    data.addRow(row);
                }
                data.applyChanges();
            }
        });
        
        result.put("data", data);
        return result;
    }
}
