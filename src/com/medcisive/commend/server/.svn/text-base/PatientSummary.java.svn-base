package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class PatientSummary {

    private String              type = "";
    private String              details = "";
    private java.sql.Timestamp  firstDate = null;
    private String              firstValue = "";
    private java.sql.Timestamp  lastDate = null;
    private String              lastValue = "";
    private PatientData         pd = null;

    public PatientSummary() {}
    public PatientSummary(java.sql.ResultSet rs, PatientData pd) {
        this.pd = pd;
        try {
            type = rs.getString("type");
            details = rs.getString("details");
            firstDate = rs.getTimestamp("firstDate");
            firstValue = rs.getString("firstValue");
            lastDate = rs.getTimestamp("lastDate");
            lastValue = rs.getString("lastValue");
        }
        catch(Exception e) { e.printStackTrace(); }
    }
    public String getType() {
        return type;
    }
    public String getDetails() {
        return details;
    }
    public String getFirstDate() {
        if(firstDate==null) { return ""; }
        return pd.formater.format(firstDate).toString();
    }
    public String getFirstValue() {
        return firstValue;
    }
    public String getLastDate() {
        if(lastDate==null) { return ""; }
        return pd.formater.format(lastDate).toString();
    }
    public String getLastValue() {
        return lastValue;
    }
}
