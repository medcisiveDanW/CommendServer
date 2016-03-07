package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class SideEffectDataManager{
    private java.util.LinkedHashMap<java.sql.Timestamp,SideEffectData> dateValue = null;
    private PatientData pd;

    public SideEffectDataManager(PatientData pd){
        this.pd = pd;
    }
    private boolean setData() {
        if(dateValue==null) {
            CommendDatabaseController dbc = new CommendDatabaseController();
            dateValue = dbc.getSideEffects(pd);
            if( (dateValue!=null) && !dateValue.isEmpty()) { return true; }
        }
        else { return true; }
        return false;
    }
    public String getData() {
        if(!setData()) { return "{ \"No Data\": { label: \"No Data\", data:[[1292449260000,1292449270000]] } }"; }
        String data = " { \"Side Effects\": { label: \"Side Effects\", yaxis:1, data:[";
        for(java.sql.Timestamp date: dateValue.keySet())
        {
            data += "[" + date.getTime() + "," + dateValue.get(date).getValue() + "],";
        }
        data = data.substring(0,data.lastIndexOf(','));
        data += "] } }";
        if(dateValue.keySet().isEmpty()) { data = "{ \"No Data\": { label: \"No Data\", data:[[1292449260000,1292449270000]] } }"; }
        return data;
    }
    public void put(java.sql.Timestamp d, SideEffectData se) { dateValue.put(d, se); }
    public SideEffectData get(java.sql.Timestamp key) { return dateValue.get(key); }
}
