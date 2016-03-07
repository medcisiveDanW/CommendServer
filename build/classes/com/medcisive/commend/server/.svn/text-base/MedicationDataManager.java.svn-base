package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class MedicationDataManager {
    private java.util.ArrayList<MedicationData>         medList = null;
    private java.util.HashMap<String, MedicationGroup>  medGroup = null;
    private PatientData                                 pd;

    public MedicationDataManager(PatientData pd) {
        this.pd  = pd;
    }
    private boolean setMedications() {
        if(medGroup==null) {
            CommendDatabaseController dbc = new CommendDatabaseController();
            if(medList==null)
            { medList = dbc.getMedications(pd); }
            if(!medList.isEmpty()) {
                medGroup = new java.util.HashMap();
            }
            else { return false; }
            while(!medList.isEmpty()) {
                MedicationData md = medList.get(0);
                medList.remove(md);
                if(medGroup.containsKey(md.localDrugNameWithDose)) {
                    MedicationGroup mg = medGroup.get(md.localDrugNameWithDose);
                    mg.add(md);
                    if(md.isRecent.equalsIgnoreCase("T")) {
                        mg.isRecent = true;
                    }
                }
                else {
                    MedicationGroup mg = new MedicationGroup();
                    mg.add(md);
                    if(!mg.isActive) {
                        if(md.isActive.equalsIgnoreCase("T"))
                            mg.isActive = true;
                    }
                    if(!mg.isRecent) {
                        if(md.isRecent.equalsIgnoreCase("T"))
                            mg.isRecent = true;
                    }
                    mg.classCode = md.primaryDrugClassCode;
                    mg.drugNameWithoutDose = md.drugNameWithoutDose;
                    mg.localDrugSID = md.localDrugSID;
                    mg.localDrugNameWithDose = md.localDrugNameWithDose;
                    medGroup.put(mg.localDrugNameWithDose, mg);
                }
            }
            if(!medGroup.isEmpty()) { return true; }
        }
        else { return true; }
        return false;
    }
    //public java.util.ArrayList<MedicationData> getMedications() { return medList; }
    public String getMedicationData() {
        String data = "";
        int counter = 0;
        if(setMedications()) {
            data = "{ ";
            for(MedicationGroup mg: medGroup.values()) {
                if(mg.isRecent && mg.classCode.contains("CN")) {
                    data += mg.getData() + ",";
                    counter++;
                }
            }
            if(counter>0) {
                data = data.substring(0,data.lastIndexOf(','));
                data += "}";
            }
        }
        if(counter==0) {
            data = "{ \"No Medications\": { label: \"No Medications\", data:[[1292449260000,1292449270000, '']] } }";
        }
        return data;
    }
}
