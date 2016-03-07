package com.medcisive.commend.server.MedicationManagement;

/**
 *
 * @author vhapalchambj
 */
public class MedicationManagementTest {

    public static void main(String[] args) {
        java.util.ArrayList<MedicationManagementData> mmArr = new java.util.ArrayList();
        MedicationManagementData mmd = new MedicationManagementData();
        mmd.med = "Some medication information with dosage";
        mmd.instruction = "Some information about how to take the medication prescribed";
        mmd.status = "ACTIVE";
        mmd.isVAMed = true;
        mmArr.add(mmd);
        mmd = new MedicationManagementData();
        mmd.med = "Some medasdfasdfasdf asd asdf with dosage";
        mmd.instruction = "Some information abouf asdf afsdn prescribed";
        mmd.status = "HOLD";
        mmd.isVAMed = false;
        mmArr.add(mmd);
        mmd = new MedicationManagementData();
        mmd.med = "Somewith dosage medication information ";
        mmd.instruction = "Some prescribed information";
        mmd.status = "ACTIVE";
        mmd.isVAMed = false;
        mmArr.add(mmd);
        mmd = new MedicationManagementData();
        mmd.med = "Some medicn with dosageation informatio";
        mmd.instruction = "Some information prescribed";
        mmd.status = "PENDING";
        mmd.isVAMed = true;
        mmArr.add(mmd);
        mmd = new MedicationManagementData();
        mmd.med = "Bob medasdfasdfasdf asd asdf with dosage";
        mmd.instruction = "Some information abouf asdf afsdn prescribed";
        mmd.status = "HOLD";
        mmd.isVAMed = true;
        mmArr.add(mmd);

        System.out.println(MedicationManagement.get(mmArr));
    }
}