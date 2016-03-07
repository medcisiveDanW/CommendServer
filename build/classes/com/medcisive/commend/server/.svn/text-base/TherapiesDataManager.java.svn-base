package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class TherapiesDataManager {
    private PatientData                                 pd;
    private java.util.HashMap<String, TherapiesData>    therapiesData = null;
    public TherapiesDataManager(PatientData p) { this.pd = p; }
    private boolean setTherapies() {
        if(therapiesData==null) {
            CommendDatabaseController dbc = new CommendDatabaseController();
            therapiesData = dbc.getTherapies(pd);
            return true;
        }
        else if(!therapiesData.isEmpty()) { return true; }
        return false;
    }
    public String getTherapiesData() {
        String data = "";
        int counter = 0;
        if(setTherapies()) {
            data = "{ ";
            for(TherapiesData td: therapiesData.values()) {
                data += td.getData() + ",";
                counter++;
            }
            if(counter>0) {
                data = data.substring(0,data.lastIndexOf(','));
                data += "}";
            }
        }
        if(counter==0) {
            data = "{ \"No Therapies\": { label: \"No Therapies\", data:[[1292449260000,1292449270000]] } }";
        }
        return data;
    }
}
