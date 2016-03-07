package com.medcisive.commend.server;

import com.medcisive.utility.LogUtility;

/**
 *
 * @author vhapalchambj
 */
public class CustomOutcomeDefinition {
    public String id;
    public String name;
    public String question;
    public String goal;
    public boolean range;
    public String freqUnit;
    public String status;
    public boolean isChecked;
    public String min;
    public String max;
    /*
        scaleTypeID name
        1           Frequency
        2           Likert
        3           MultipleLikert
        4           CustomRange
     */
    public int scaleId;

    public CustomOutcomeDefinition(String id, String name, String question, String scaleTypeId, String goal, String max, String freqId, String rangeId) {
        this.id = id;
        this.name = name;
        this.question = question;
        this.min = goal;
        this.max = max;
        scaleId = -1;
        try {
            scaleId = Integer.parseInt(scaleTypeId);
        } catch (java.lang.NumberFormatException e) { LogUtility.error(e); }

        this.goal = goal;
        freqUnit = null;
        if(freqId!=null) {
            freqUnit = "'Week'";
            if(freqId.equalsIgnoreCase("2")) {
                freqUnit = "'Day'";
            }
            if(freqId.equalsIgnoreCase("3")) {
                freqUnit = "'Hour'";
            }
        }

        range = true;
        if(rangeId.equalsIgnoreCase("2")) {
            range = false;
        }
        isChecked = false;
    }
}
