package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class PatientDataExternal extends PatientData {

    public PatientDataExternal(java.sql.ResultSet rs) {
        try {
            sta3n = rs.getString("Sta3n");
            patientSID = rs.getString("PatientSID");
            patientIEN = rs.getString("PatientIEN");
            patientName = rs.getString("Name");
            SSN = rs.getString("SSN");
            DOB = rs.getTimestamp("DOB");
            sex = rs.getString("Sex");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
