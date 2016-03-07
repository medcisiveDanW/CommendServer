package com.medcisive.commend.client;

import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLObject;
import com.medcisive.utility.sql2.SQLTable;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author vhapalchambj
 */
public class ClientServlet extends DBCServlet {

    @Override
    public Object process(HttpServletRequest request) {
        Object result = null;
        String option = (String) request.getParameter("option");
        if(option==null) {
        	result = "Invalid Option";
        } else if (option.equalsIgnoreCase("getApplicationProperties")) {
            result = _getApplicationProperties(request);
        } else if (option.equalsIgnoreCase("getRestartDate")) {
            result = _getRestartDate(request);
        } else if (option.equalsIgnoreCase("getShutdownDate")) {
            result = _getShutdownDate(request);
        } else if (option.equalsIgnoreCase("getClientBat")) {
            result = _getClientBat(request);
        } else if (option.equalsIgnoreCase("checkPatientIdentity")) {
            result = _checkPatientIdentity(request);
        } else if (option.equalsIgnoreCase("checkProviderIdentity")) {
            result = _checkProviderIdentity(request);
        } else if (option.equalsIgnoreCase("logEvent")) {
            result = _logEvent(request);
        }
        return result;
    }
    
    private Object _getApplicationProperties(HttpServletRequest request) {
        return getApplicationProperties();
    }
    
    public SQLTable getApplicationProperties() {
        String query =
            "SELECT Name \n" +
            "      ,Value \n" +
            "      ,DateModified \n" +
            "FROM Commend.dbo.ApplicationProperties";
        SQLTable result = _dest.getTable(query);
        return result;
    }
    
    private Object _getRestartDate(HttpServletRequest request) {
        return getRestartDate();
    }
    
    public java.sql.Timestamp getRestartDate() {
        final java.util.List<java.sql.Timestamp> result = new java.util.ArrayList();
        String query =
            "SELECT DateModified \n" +
            "FROM Commend.dbo.ApplicationProperties \n" +
            "WHERE Name = 'Restart'";
        
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getTimestamp("DateModified"));
            }
        });
        if(result.isEmpty()) {
            result.add(new java.sql.Timestamp(System.currentTimeMillis()));
        }
        return result.get(0);
    }
    
    private java.sql.Timestamp _getShutdownDate(HttpServletRequest request) {
        return getShutdownDate();
    }

    public java.sql.Timestamp getShutdownDate() {
        final java.util.List<java.sql.Timestamp> result = new java.util.ArrayList();
        String query =
            "SELECT DateModified \n" +
            "FROM Commend.dbo.ApplicationProperties \n" +
            "WHERE Name = 'Shutdown'";
        
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getTimestamp("DateModified"));
            }
        });
        if(result.isEmpty()) {
            result.add(new java.sql.Timestamp(System.currentTimeMillis()));
        }
        return result.get(0);
    }
    
    private String _getClientBat(HttpServletRequest request) {
        return getClientBat();
    }
    
    public String getClientBat() {
        final java.util.List<String> result = new java.util.ArrayList();
        String query =
            "SELECT Value \n" +
            "FROM Commend.dbo.ApplicationProperties \n" +
            "WHERE Name = 'ClientBat'";
        
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                result.add(rs.getString("Value"));
            }
        });
        if(result.isEmpty()) {
            result.add("Client Bat URL not Defined.");
        }
        return result.get(0);
    }

    private Object _checkPatientIdentity(HttpServletRequest request) {
        String patientSSN = (String) request.getParameter("patientSSN");
        String providerDUZ = (String) request.getParameter("providerDUZ");
        String securityCode = (String) request.getParameter("securityCode");
        return checkPatientIdentity(patientSSN, providerDUZ, securityCode);
    }
    
    public Object checkPatientIdentity(String patientSSN, String providerDUZ, String securityCode) {
        boolean result = false;
        if(checkPatient(patientSSN, providerDUZ, securityCode)) {
            result = true;
            System.out.println("Patient check was successfull and access has been granted.");
        }
        else { System.out.println("Patient is not supported!"); }
        return result;
    }
    
    private Object _checkProviderIdentity(HttpServletRequest request) {
        String providerDUZ = (String) request.getParameter("providerDUZ");
        String clientComputer = (String) request.getParameter("clientComputer");
        return checkProviderIdentity(providerDUZ, clientComputer);
    }
    
    public Object checkProviderIdentity(String providerDUZ, String clientComputer) {
        boolean result = false;
        if(checkProvider(providerDUZ)) {
            saveComputerName(providerDUZ, clientComputer);
            result = true;
        }
        return result;
    }
    
    private Object _logEvent(HttpServletRequest request) {
        String clientComputer = (String) request.getParameter("clientComputer");
        String patientSSN = (String) request.getParameter("patientSSN");
        String patientDFN = (String) request.getParameter("patientDFN");
        String prvdDUZ = (String) request.getParameter("prvdDUZ");
        String event = (String) request.getParameter("event");
        String eventCategory = (String) request.getParameter("eventCategory");
        return logEvent(clientComputer, patientSSN, patientDFN, prvdDUZ, event, eventCategory);
    }
    
    public Object logEvent(String clientComputer, String patientSSN, String patientDFN, String providerDUZ, String event, String eventCategory) {
        boolean result = false;
        return result;
    }
    
    public boolean checkProvider(String providerDUZ) {
        String q = "SELECT * FROM Commend.dbo.CommendProviders \n"
                + "WHERE DUZ = " + DBC.fixString(providerDUZ);
        SQLTable result = _dest.getTable(q);
        return !result.isEmpty();
    }

    public boolean checkPatient(String patientSSN, String providerDUZ, String securityCode) {
        String q = "SELECT * FROM Commend.dbo.CommendDemographics "
                + "WHERE SSN = " + DBC.fixString(patientSSN);
        SQLTable table = _dest.getTable(q);
        boolean result = !table.isEmpty();
        if(result) {
            String PatientName = (String)table.getRow(0).get("name");
            java.sql.Timestamp date = new java.sql.Timestamp(System.currentTimeMillis());
            q = "INSERT INTO Commend.dbo.CommendAccess (SSN,ProviderID,securityCode,DateTimeEntered,PatientName) \n"
              + "VALUES ('" + patientSSN + "','" + providerDUZ + "','" + securityCode + "','" + date + "','" + PatientName + "')";
            _dest.update(q);
        }
        return result;
    }

    public void saveComputerName(String providerDUZ, String clientComputer) {
        String q = "DELETE FROM Commend.dbo.CommendComputerNames \n"
                 + "WHERE ProviderDUZ = '" + providerDUZ + "'";
        _dest.update(q);
        java.util.Date todayDate = new java.util.Date();
        java.sql.Timestamp today = new java.sql.Timestamp(todayDate.getTime());
        q = "INSERT INTO Commend.dbo.CommendComputerNames (ProviderDUZ,ComputerName,DateEntered)"
          + "VALUES ('" + providerDUZ + "','" + clientComputer + "','" + today + "')";
        _dest.update(q);
    }

    public void logEvent(String patientSSN, String providerDUZ, String clientComputer, String event) {
        java.sql.Timestamp eventtime = new java.sql.Timestamp(System.currentTimeMillis());
        String q = "INSERT INTO Commend.dbo.CommendLogTrace (eventtime,logtime,patientSSN,providerDUZ,clientComputer,event) \n"
                + "VALUES(" + DBC.fixTimestamp(eventtime) + "," + DBC.fixTimestamp(eventtime) + ","
                + DBC.fixString(patientSSN) + "," + DBC.fixString(providerDUZ) + ","
                + DBC.fixString(clientComputer) + "," + DBC.fixString(event) + ")";
        _dest.update(q);
    }
}
