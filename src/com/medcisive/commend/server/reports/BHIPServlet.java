package com.medcisive.commend.server.reports;

import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLTable;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author vhapalchambj
 */
public class BHIPServlet extends DBCServlet {

    @Override
    public Object process(HttpServletRequest request) {
        Object result = null;
        String option = (String) request.getParameter("option");
        if (option.equalsIgnoreCase("getBHIPTeam")) {
            result = _getBHIPTeam(request);
        } else if (option.equalsIgnoreCase("getBHIPTeams")) {
            result = _getBHIPTeams(request);
        } else if (option.equalsIgnoreCase("getBHIPPatient")) {
            result = _getBHIPPatient(request);
        }        
        return result;
    }
    
    private Object _getBHIPTeams(HttpServletRequest request) {
        return getBHIPTeams();
    }
    
    public Object getBHIPTeams() {
        String query =
            "SELECT DISTINCT team \n" +
            "FROM Commend.dbo.CommendVISNBHIPTeams";
        SQLTable result = _dest.getTable(query);
        return result;
    }
    
    private Object _getBHIPTeam(HttpServletRequest request) {
        String team = (String) request.getParameter("team");
        return getBHIPTeam(team);
    }
    
    public Object getBHIPTeam(String teamName) {
        String query =
            "select \n" +
            "      team.Sta3n \n" +
            "      ,team.PatientSID \n" +
            "      ,team.PatientName \n" +
            "      ,RIGHT(team.patientSSN,4) AS Last4 \n" +
            "      ,CAST(team.Age AS VARCHAR) AS Age \n" +
            "      ,team.ProviderName \n" +
            "      ,panel.NextAppointmentDatetime \n" +
            "      ,panel.NextAppointmentLocation \n" +
            "from  Commend.dbo.CommendVISNBHIPTeams team \n" +
            " join Commend.dbo.CommendVISNBHIPPatientPanel panel on \n" +
            "     panel.sta3n = team.sta3n and \n" +
            "     panel.patientSID = team.patientSID \n" +
            " where panel.nextAppointmentDatetime < dateadd(dayofyear, 5, convert(date,getDate())) \n" +
            " and team = " + DBC.fixString(teamName) + " \n" +
            "order by team.patientName";
        SQLTable result = _dest.getTable(query);
        return result;
    }
    
    private Object _getBHIPPatient(HttpServletRequest request) {
        String sta3nStr = (String) request.getParameter("sta3n");
        String sidStr = (String) request.getParameter("sid");
        String team = (String) request.getParameter("team");
        int sta3n = Integer.parseInt(sta3nStr);
        int sid = Integer.parseInt(sidStr);
        return getBHIPPatient(sta3n, sid, team);
    }
    
    public Object getBHIPPatient(int sta3n, int sid, String teamName) {
        String query =
            "SELECT DISTINCT enc.visitDateTime \n" +
            "      ,enc.primaryICDCodeDescription \n" +
            "      ,enc.encounterClass \n" +
            "      ,enc.ProviderName \n" +
            "FROM Commend.dbo.CommendVISNFlatEncounters enc, \n" +
            "     Commend.dbo.CommendVISNBHIPTeams team \n" +
            "WHERE enc.Sta3n = " + sta3n + " \n" +
            "  AND enc.PatientSID = " + sid + " \n" +
            "  AND enc.ProviderSID = team.ProviderSID \n" +
            "  AND team.Team = " + DBC.fixString(teamName) + " \n" +
            "ORDER BY enc.visitDateTime desc";
        SQLTable result = _dest.getTable(query);
        return result;
    }
}
