package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class OutcomeData
{
    public String                                               name;
    public String                                               type;
    private java.util.LinkedHashMap<java.sql.Timestamp,Integer> dateValue;
    private java.sql.Timestamp                                  firstDate = null;
    private Integer                                             firstScore = null;
    private java.sql.Timestamp                                  lastDate = null;
    private Integer                                             lastScore = null;
    private boolean                                             hasFirstLastBeenSetup = false;
    public java.text.SimpleDateFormat                           sdf;
    public OutcomeData() {
        dateValue = new java.util.LinkedHashMap();
        sdf = new java.text.SimpleDateFormat("MMM dd, yyyy");
    }
    public void sort() {
        java.util.Vector<java.sql.Timestamp> v = new java.util.Vector(dateValue.keySet());
        java.util.Collections.sort(v);
    }
    public String getData() {
        String data = "\"" + name + "\": { label: \"" + name + "\", yaxis:1, data:[";
        for(java.sql.Timestamp date: dateValue.keySet()) {
            data += "[" + date.getTime() + "," + dateValue.get(date) + "],";
        }
        data = data.substring(0,data.lastIndexOf(','));
        data += "] }";
        return data;
    }
    public String getFirstDate() {
        setupFirstLastData();
        if(firstDate!=null) { return sdf.format(firstDate).toString(); }
        return null;
    }
    public String getFirstScore() {
        setupFirstLastData();
        if(firstScore!=null) { return firstScore.toString(); }
        return null;
    }
    public String getLastDate() {
        setupFirstLastData();
        if(lastDate!=null) { return sdf.format(lastDate).toString(); }
        return null;
    }
    public String getLastScore() {
        setupFirstLastData();
        if(lastScore!=null) { return lastScore.toString(); }
        return null;
    }
    private void setupFirstLastData() {
        if(!hasFirstLastBeenSetup) {
            int size = dateValue.size();
            int pos = 0;
            for(java.sql.Timestamp key : dateValue.keySet()) {
                System.out.println(key);
                if(firstDate==null) { firstDate = key; }
                System.out.println("firstDate " + firstDate);
                if(pos==size-1) { lastDate = key; }
                pos++;
            }
            firstScore = dateValue.get(firstDate);
            lastScore = dateValue.get(lastDate);
            hasFirstLastBeenSetup = true;
        }
    }
    public void put(java.sql.Timestamp d, Integer v) { dateValue.put(d, v); }
    public Integer get(java.sql.Timestamp key) { return dateValue.get(key); }
}
