package com.medcisive.commend.server;

import java.sql.*;
/**
 *
 * @author vhapalchambj
 */
public class MedicationData
{
    public String sta3n;
    public String patientSID;
    public String localDrugSID;
    public String localDrugNameWithDose;

    public String drugNameWithoutDose;
    public String nationalFormularyFlag;
    public String nationalFormularyName;

    public Timestamp issueDate;
    public Timestamp fillDateTime;
    public Timestamp releaseDateTime;
    public Timestamp expirationDate;
    public Timestamp endDateTime;

    public String qty;
    public int daysSupply;

    public String units;
    public String dosageForm;
    public String strength;
    public String dailyDose;
    public String dailyDoseUnits;

    public String primaryDrugClassSID;
    public String primaryDrugClassCode;

    public String isActive;
    public String isRecent;

    public MedicationData(ResultSet rs)
    {
        try
        {
            sta3n                   = rs.getString("Sta3n");
            patientSID              = rs.getString("PatientSID");
            localDrugSID            = rs.getString("LocalDrugSID");
            localDrugNameWithDose   = rs.getString("LocalDrugNameWithDose");

            drugNameWithoutDose     = rs.getString("DrugNameWithoutDose");
            nationalFormularyFlag   = rs.getString("NationalFormularyFlag");
            nationalFormularyName   = rs.getString("NationalFormularyName");
            endDateTime             = rs.getTimestamp("EndDateTime");
            issueDate               = rs.getTimestamp("IssueDate");

            fillDateTime            = rs.getTimestamp("FillDateTime");
            releaseDateTime         = rs.getTimestamp("ReleaseDateTime");

            expirationDate          = rs.getTimestamp("ExpirationDate");
            qty                     = rs.getString("Qty");
            daysSupply              = rs.getInt("DaysSupply");

            units                   = rs.getString("Units");
            dosageForm              = rs.getString("DosageForm");
            strength                = rs.getString("Strength");
            dailyDose               = rs.getString("DailyDose");
            if(dailyDose.indexOf('.')>0) {
                dailyDose = dailyDose.substring(0,dailyDose.indexOf('.')+2);
            }
            dailyDoseUnits          = rs.getString("DailyDoseUnits");

            primaryDrugClassSID     = rs.getString("PrimaryDrugClassSID");
            primaryDrugClassCode    = rs.getString("PrimaryDrugClassCode");

            isActive                = rs.getString("isActive");
            isRecent                = rs.getString("isRecent");
        }
        catch(Exception e) { e.printStackTrace(); }
    }

    public void print()
    {
        String out =    sta3n + " , " + patientSID + " , " + localDrugSID + " , " + localDrugNameWithDose + "\n" +
                        drugNameWithoutDose + " , " + nationalFormularyFlag + " , " + nationalFormularyName + "\n" +
                        issueDate + " , " + fillDateTime + " , " + releaseDateTime + " , " + expirationDate + "\n" +
                        endDateTime + " , " + qty + " , " + daysSupply + " , " + units + " , " + dosageForm + "\n" +
                        strength + " , " + primaryDrugClassSID + " , " + primaryDrugClassCode + " , " + isActive + " , " + isRecent  + "\n";
        System.out.println("Med: " + out);
    }
}
