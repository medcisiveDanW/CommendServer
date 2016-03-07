package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class OutcomeDataManager {

    private java.util.LinkedHashMap<String,OutcomeData>  outcomeTable = null;
    private PatientData pd;

    public OutcomeDataManager(PatientData pd) {
        this.pd = pd;
    }
    private boolean setOutcomeData() {
        if(outcomeTable==null) {
            CommendDatabaseController dbc = new CommendDatabaseController();
            outcomeTable = dbc.getScores(pd);
        }
        if(!outcomeTable.isEmpty()) { return true; }
        return false;
    }
    public OutcomeData getOutcomeDataObject(String key) {
        if(setOutcomeData()) {
            return outcomeTable.get(key);
        }
        return null;
    }
    public String getOutcomeData(String type) {
        boolean isValid = true;
        String data = "";
        int counter = 0;
        java.util.LinkedHashMap<String,String> types = new java.util.LinkedHashMap();
        types.put("S", "Symptom Function");
        types.put("C", "Custom Measures");
        types.put("G", "Goal Tracking Measures");
        String noDataStr = "{ \"No Data\": { label: \"No Data\", data:[[1200000000000,0],[1200000000001,10]] } }";

        if( (type==null) || (type.equalsIgnoreCase(""))) { isValid = false; }
        if(setOutcomeData()) {
            data = "{ ";
            for(OutcomeData score: outcomeTable.values()) {
                if(score.type.equalsIgnoreCase(type)) {
                    data += score.getData() + ",";
                    counter++;
                }
            }
            if(counter>0) {
                data = data.substring(0,data.lastIndexOf(','));
                data += "}";
            }
            else { isValid = false; }
        }
        else { isValid = false; }
        if(!isValid) { return noDataStr; }
        return data;
    }
}
