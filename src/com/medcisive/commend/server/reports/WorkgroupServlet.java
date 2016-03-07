package com.medcisive.commend.server.reports;

import com.medcisive.commend.server.CommendWebappManager;
import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLObject;
import com.medcisive.utility.sql2.SQLTable;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 *
 * @author vhapalchambj
 */
public class WorkgroupServlet extends DBCServlet {

    private CommendWebappManager _manager;
    
    @Override
    public Object process(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        Object result = null;
        String option = (String) request.getParameter("option");
        _manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
        if (option.equalsIgnoreCase("getGroups")) {
            result = _getGroups(request);
        } else if (option.equalsIgnoreCase("getGroup")) {
            result = _getGroup(request);
        } else if (option.equalsIgnoreCase("addSelfWorkgroup")) {
            _addSelfWorkgroup(request);
        } else if (option.equalsIgnoreCase("addGroup")) {
            result = _addGroup(request);
        } else if (option.equalsIgnoreCase("removeGroup")) {
            _removeGroup(request);
        } else if (option.equalsIgnoreCase("setDefaultGroup")) {
            _setDefaultGroup(request);
        } else if (option.equalsIgnoreCase("addProviderToGroup")) {
            result = _addProviderToGroup(request);
        } else if (option.equalsIgnoreCase("removeProviderFromGroup")) {
            _removeProviderFromGroup(request);
        } else if (option.equalsIgnoreCase("getAvailableProviders")) {
            result = _getAvailableProviders(request);
        } else if (option.equalsIgnoreCase("changeProviderRole")) {
            _changeProviderRole(request);
        } else if (option.equalsIgnoreCase("getClinicTimes")) {
            result = _getClinicTimes(request);
        } else if (option.equalsIgnoreCase("setClinicTime")) {
            _setClinicTime(request);
        } else if (option.equalsIgnoreCase("addClinicTime")) {
            _addClinicTime(request);
        } else if (option.equalsIgnoreCase("removeClinicTime")) {
            _removeClinicTime(request);
        } else if (option.equalsIgnoreCase("getClinicTimes")) {
            result = _getClinicTimes(request);
        } else if (option.equalsIgnoreCase("getClinicTimes")) {
            result = _getClinicTimes(request);
        } else if (option.equalsIgnoreCase("getClinicTimes")) {
            result = _getClinicTimes(request);
        }
        
        return result;
    }

    /**************** General Use *******************/
    private Object _getGroups(HttpServletRequest request) {
        int sid = Integer.parseInt(_manager.providerSID);
        return getGroups(sid);
    }

    public Object getGroups(int sid) {
        String query
                = "SELECT \n"
                + "      wgID \n"
                + "      ,wgName \n"
                + "      ,ownerSta3n \n"
                + "      ,ownerDUZ \n"
                + "      ,ownerSID \n"
                + "      ,ownerName \n"
                + "      ,status \n"
                + "      ,isDefaultWg \n"
                + "FROM Commend.dbo.CommendVISNWorkGroups \n"
                + "WHERE ownerSID = " + sid;
        SQLTable result = _dest.getTable(query);
        for (Integer i : result.keySet()) {
            java.util.Map<String, Object> map = result.getRow(i);
            String wgId = "" + map.get("wgID");
            query = "SELECT \n"
                    + " providerSta3n \n"
                    + "	,providerDUZ \n"
                    + "	,providerSID \n"
                    + "	,providerName \n"
                    + "FROM \n"
                    + "	Commend.dbo.CommendVISNWorkGroupMembers \n"
                    + "WHERE wgID = " + DBC.fixString(wgId);
            map.put("providers", _dest.getTable(query).getTable());
        }
        return result;
    }

    private SQLTable _getGroup(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        int wgId = Integer.parseInt(wgIdStr);
        return getGroup(wgId);
    }
    
    public SQLTable getGroup(int wgId) {
        String query
                = "SELECT \n"
                + "     m.providerSta3n \n"
                + "	,m.providerDUZ \n"
                + "	,m.providerSID \n"
                + "	,m.providerName \n"
                + "     ,p.Role \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNWorkGroupMembers m,"
                + "     Commend.dbo.CommendVISNProviderProperties p \n"
                + "WHERE wgID = " + wgId + " \n"
                + "  AND m.providerSta3n = p.Sta3n \n"
                + "  AND m.providerSID = p.ProviderSID";
        return _dest.getTable(query);
    }
    
    private void _addSelfWorkgroup(HttpServletRequest request) {
        int sta3n = Integer.parseInt(_manager.providerSta3n);
        int sid = Integer.parseInt(_manager.providerSID);
        addSelfWorkgroup(sta3n, sid);
    }

    public void addSelfWorkgroup(int sta3n, int sid) {
        if (sta3n < 0 || sid < 0) {
            return;
        }
        int wgId = addGroup(sta3n, sid, "Example");
        if (wgId == -1) {
            //todo: log error
        } else {
            int insertSelfSuccess = addProviderToGroup(sta3n, sid, wgId, null);
            if (insertSelfSuccess == 0) {
                addProviderToGroup(sta3n, 1347169, wgId, null);
            }
        }
    }
    
    /**************** Workgroup Use******************/
    private int _addGroup(HttpServletRequest request){
        String wgName = (String) request.getParameter("wgName");
        int sta3n = Integer.parseInt(_manager.providerSta3n);
        int sid = Integer.parseInt(_manager.providerSID);
        return addGroup(sta3n, sid, wgName);
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

    private void _removeGroup(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        int wgId = Integer.parseInt(wgIdStr);
        removeGroup(wgId);
    }
    
    public void removeGroup(int wgId ) {
        String query
                = "DELETE FROM Commend.dbo.CommendVISNWorkGroups \n"
                + "WHERE wgID = " + wgId;
        _dest.update(query);
        query
                = "DELETE FROM Commend.dbo.CommendVISNWorkGroupMembers \n"
                + "WHERE wgID = " + wgId;
        _dest.update(query);
    }
    
    private void _setDefaultGroup(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        int wgId = Integer.parseInt(wgIdStr);
        int sid = Integer.parseInt(_manager.providerSID);
        setDefaultGroup(sid, wgId);
    }
    
    public void setDefaultGroup(int sid, int wgId) {
        String query
                = "UPDATE Commend.dbo.CommendVISNWorkGroups \n"
                + "SET isDefaultWG = 'N' \n"
                + "WHERE ownerSID = " + sid + " \n"
                + " \n"
                + "UPDATE Commend.dbo.CommendVISNWorkGroups \n"
                + "SET isDefaultWG = 'Y' \n"
                + "WHERE wgID = " + wgId;
        _dest.update(query);
    }
    
    /**************** Workgroup Edit Use*************/
    private int _addProviderToGroup(HttpServletRequest request) {
        String sta3nStr = (String) request.getParameter("sta3n");
        String sidStr = (String) request.getParameter("sid");
        String wgIdStr = (String) request.getParameter("wgId");
        String role = (String) request.getParameter("role");
        int sta3n = Integer.parseInt(sta3nStr);
        int sid = Integer.parseInt(sidStr);
        int wgId = Integer.parseInt(wgIdStr);
        return addProviderToGroup(sta3n, sid, wgId, role);
    }
    
    public int addProviderToGroup(int sta3n, int sid, int wgId, String role) {
        if (role == null || role.isEmpty()) {
            role = "PSYCHOLOGIST";
        }
        String query
                = "INSERT INTO Commend.dbo.CommendVISNWorkGroupMembers (providerSta3n,providerDUZ,providerSID,providerName,wgID,status,createDate,lastModified) \n"
                + "SELECT DISTINCT \n"
                + "     sta3n AS providerSta3n \n"
                + "     ,providerDUZ AS providerDUZ \n"
                + "     ,staffSID AS providerSID \n"
                + "     ,providerName AS providerName \n"
                + "     ," + wgId + " AS wgID \n"
                + "     ,'A' AS status \n"
                + "     ,GETDATE() AS createDate \n"
                + "     ,GETDATE() AS lastModified \n"
                + "FROM Commend.dbo.CommendVISNProvider \n"
                + "WHERE \n"
                + "     sta3n = " + sta3n + " \n"
                + " AND staffSID = " + sid;
        int result = _dest.update(query);
        SQLTable t = _dest.getTable("SELECT * FROM Commend.dbo.CommendVISNProviderProperties WHERE Sta3n=" + sta3n + " AND ProviderSID=" + sid);
        if (t.isEmpty()) {
            addProviderProperty(640, sid);
            setProviderProperty(640, sid, role);
            getClinicTimes(640, sid);
        }
        return result;
    }
    
    private void _removeProviderFromGroup(HttpServletRequest request) {
        String sta3nStr = (String) request.getParameter("sta3n");
        String sidStr = (String) request.getParameter("sid");
        String wgIdStr = (String) request.getParameter("wgId");
        int sta3n = Integer.parseInt(sta3nStr);
        int sid = Integer.parseInt(sidStr);
        int wgId = Integer.parseInt(wgIdStr);
        removeProviderFromGroup(sta3n, sid, wgId);
    }
    
    public void removeProviderFromGroup(int sta3n, int sid, int wgId) {
        String query
                = "DELETE FROM Commend.dbo.CommendVISNWorkGroupMembers \n"
                + "WHERE \n"
                + "     providerSta3n = " + sta3n + " \n"
                + " AND providerSID = " + sid + " \n"
                + " AND wgID = " + wgId;
        _dest.update(query);
    }
    
    private SQLTable _getAvailableProviders(HttpServletRequest request) {
        java.util.List<String> excludeList = new java.util.ArrayList();
        String list = (String) request.getParameter("list");
        String curr = "";
        for (int i = 0; i < list.length(); i++) {
            if (list.charAt(i) == ',') {
                excludeList.add(curr);
                curr = "";
            } else {
                curr += list.charAt(i);
            }
        }
        excludeList.add(curr);

        return getAvailableProviders(excludeList);
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
    
    private void _changeProviderRole(HttpServletRequest request) {
        String sta3nString = (String) request.getParameter("sta3n");
        String sidString = (String) request.getParameter("sid");
        String roleString = (String) request.getParameter("role");
        int sta3n = Integer.parseInt(sta3nString);
        int sid = Integer.parseInt(sidString);
        setProviderProperty(sta3n, sid, roleString);
    }
    
    /**************** Workgroup clinic Use***********/
    private Object _getClinicTimes(HttpServletRequest request) {
        String sidStr = (String) request.getParameter("sid");
        int sid = Integer.parseInt(sidStr);
        return getClinicTimes(640,sid);
    }
    
    public SQLTable getClinicTimes(int sta3n, int sid) {
        String query
                = "SELECT * \n"
                + "FROM Commend.dbo.CommendVISNProviderClinicTime \n"
                + "WHERE Sta3n = " + sta3n + " \n"
                + "  AND ProviderSID = " + sid + " \n"
                + "ORDER BY Start ASC";
        SQLTable result = _dest.getTable(query);
        if (result.isEmpty()) {
            Calendar cal = Calendar.getInstance();
            cal.set(2012, 0, 1, 0, 0, 0);
            addClinicTime(sta3n, sid, 1.0f, new java.sql.Timestamp(cal.getTimeInMillis()));
            result = getClinicTimes(sta3n, sid);
        }
        return result;
    }
    
    private void _setClinicTime(HttpServletRequest request) {
            String idString = (String) request.getParameter("id");
            String startString = (String) request.getParameter("start");
            String timeString = (String) request.getParameter("time");
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("MM/dd/yyyy");
            int id = Integer.parseInt(idString);
            java.sql.Timestamp start = null;
            try { start = new java.sql.Timestamp(sdf.parse(startString).getTime()); } catch (ParseException ex) {}
            float time = Float.parseFloat(timeString);
            time /= 100.0;
            setClinicTime(id, time, start);
    }
    
    public void setClinicTime(int id, float clinicTime, java.sql.Timestamp start) {
        String insert
                = "UPDATE Commend.dbo.CommendVISNProviderClinicTime \n"
                + "SET ClinicTimeRate=" + clinicTime + ",Start=" + DBC.fixTimestamp(start) + " \n"
                + "WHERE ID=" + id;
        _dest.update(insert);
    }
    
    private void _addClinicTime(HttpServletRequest request) {
        String sidString = (String) request.getParameter("sid");
        String sta3nString = (String) request.getParameter("sta3n");
        String startString = (String) request.getParameter("start");
        String timeString = (String) request.getParameter("time");
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("MM/dd/yyyy");
        int sid = Integer.parseInt(sidString);
        int sta3n = Integer.parseInt(sta3nString);
        java.sql.Timestamp start = null;
        try { start = new java.sql.Timestamp(sdf.parse(startString).getTime()); } catch (ParseException ex) {}
        float time = Float.parseFloat(timeString);
        time /= 100.0;
        addClinicTime(sta3n, sid, time, start);
    }
    
    public void addClinicTime(int sta3n, int sid, float clinicTime, java.sql.Timestamp start) {
        String insert
                = "INSERT INTO Commend.dbo.CommendVISNProviderClinicTime (Sta3n,ProviderSID,ClinicTimeRate,Start) \n"
                + "VALUES ("
                + sta3n + ","
                + sid + ","
                + clinicTime + ","
                + DBC.fixTimestamp(start) + ")";
        _dest.update(insert);
    }
    
    private void _removeClinicTime(HttpServletRequest request) {
        String idString = (String) request.getParameter("id");
        int id = Integer.parseInt(idString);
        removeClinicTime(id);
    }
    
    public void removeClinicTime(int id) {
        String delete
                = "DELETE FROM Commend.dbo.CommendVISNProviderClinicTime \n"
                + "WHERE ID=" + id;
        _dest.update(delete);
    }
    
    /**************** Internal Use ******************/    
    private void setProviderProperty(int sta3n, int sid, String role) {
        String insert
                = "UPDATE Commend.dbo.CommendVISNProviderProperties \n"
                + "SET Role=" + DBC.fixString(role) + " \n"
                + "WHERE Sta3n = " + sta3n + " \n"
                + "  AND ProviderSID = " + sid + " \n";
        _dest.update(insert);
    }

    private SQLTable getProviderProperty(int sta3n, int sid) {
        String query
                = "SELECT * \n"
                + "FROM Commend.dbo.CommendVISNProviderProperties \n"
                + "WHERE Sta3n = 640 \n"
                + "  AND ProviderSID = " + sid + " \n"
                + "ORDER BY Start ASC";
        return _dest.getTable(query);
    }

    private void addProviderProperty(int sta3n, int sid) {
        String insert
                = "INSERT INTO Commend.dbo.CommendVISNProviderProperties (Sta3n,ProviderSID,Role) \n"
                + "VALUES ("
                + sta3n + ","
                + sid + ",'PSYCHOLOGIST')";
        _dest.update(insert);
    }

    private void removeProviderProperty(int sta3n, int sid) {
        String delete
                = "DELETE FROM Commend.dbo.CommendVISNProviderProperties \n"
                + "WHERE Sta3n = " + sta3n + " \n"
                + "  AND ProviderSID = " + sid + " \n";
        _dest.update(delete);
    }
}
