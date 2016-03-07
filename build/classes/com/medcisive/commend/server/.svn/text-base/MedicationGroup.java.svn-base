package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class MedicationGroup
{
    public String drugNameWithoutDose;
    public String localDrugNameWithDose;
    public boolean isActive;
    public boolean isRecent;
    public String classCode;
    public String localDrugSID;
    private java.util.ArrayList<MedicationData> medList;

    public MedicationGroup() {
        medList = new java.util.ArrayList<MedicationData>();
    }
    public void add(MedicationData md) { medList.add(md); }
    public String getData() {
        String data = "\"" + drugNameWithoutDose + "\": { label: \"" + drugNameWithoutDose + "\", data:[";
        for(MedicationData md: medList)
        {
            long start = 0;
            long end = 0;
            String str = "";
            String units = "";

            if(md.fillDateTime!=null)
            {
                start = md.fillDateTime.getTime();
            }
            if(md.endDateTime!=null)
            {
                end = md.endDateTime.getTime();
            }
            if(md.dailyDose!=null)
            {
                str = md.dailyDose.toString();
            }
            if(md.dailyDoseUnits!=null)
            {
                units = md.dailyDoseUnits.toString();
            }

            if( (md.fillDateTime!=null) && (md.endDateTime!=null) )
            {
                data += "[" + start + "," + end + ",'" + str + "'],";
            }
            else
            {
                data += "[0,1],";
            }
        }
        data = data.substring(0,data.lastIndexOf(','));
        data += "] }";
        return data;
    }
    public void print() {
        System.out.println("Medication Group: " + drugNameWithoutDose);
        for(MedicationData md: medList)
        {
            md.print();
        }
    }
}
