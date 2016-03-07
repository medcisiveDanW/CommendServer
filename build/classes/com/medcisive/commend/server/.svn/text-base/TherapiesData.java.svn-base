package com.medcisive.commend.server;

import java.util.ArrayList;

/**
 *
 * @author vhapalchambj
 */
public class TherapiesData {
    public String       name;
    public java.util.ArrayList<java.sql.Timestamp> dates;

    public TherapiesData() {
        dates = new java.util.ArrayList();
    }
    public String getData() {
        String data = "\"" + name + "\": { label: \"" + name + "\", data:[";
        long oneDay = 1 * 24 * 60 * 60 * 1000;
        for(int i = 0; i<dates.size(); i++) {
            long start = dates.get(i).getTime();
            long end = dates.get(i).getTime() + oneDay*4;
            data += "[" + start + "," + end + "],";
        }
        data = data.substring(0,data.lastIndexOf(','));
        data += "] }";
        return data;
    }
}
