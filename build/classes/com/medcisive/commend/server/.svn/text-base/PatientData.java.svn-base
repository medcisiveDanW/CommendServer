package com.medcisive.commend.server;

/**
 *
 * @author vhapalchambj
 */
public class PatientData {

    public String sta3n;
    public String patientSID;
    public String patientIEN;
    public String patientName;
    public String SSN;
    private String lastFour = null;
    public String sex;
    public String race;
    public String ageInYears;
    public String dateOfBirth;
    public java.sql.Timestamp DOB;
    public java.sql.Timestamp AppointmentDateTime;
    public java.sql.Timestamp nextAppointment;
    public java.sql.Timestamp lastAppointment;
    public int totalAppointments;
    public int noShowAppointments;
    public CommendWebappManager comManager;
    public java.util.ArrayList<PatientSummary> patientSummary;
    public java.text.SimpleDateFormat formater;
    private OutcomeDataManager odm = null;
    private SideEffectDataManager sedm = null;
    private MedicationDataManager mdm = null;
    private TherapiesDataManager tdm = null;
    private com.medcisive.utility.NoteBuilder note = null;

    public PatientData(){}
    
    public PatientData(CommendWebappManager wam) {
        comManager = wam;
    }

    public PatientData(CommendWebappManager comManager, java.sql.ResultSet rs) {
        this(comManager);
        try {
            sta3n = rs.getString("Sta3n");
            patientSID = rs.getString("PatientSID");
            patientIEN = rs.getString("PatientIEN");
            patientName = rs.getString("Name");
            SSN = rs.getString("SSN");
            DOB = rs.getTimestamp("DOB");
            race = rs.getString("Race");
            sex = rs.getString("Sex");
        } catch (Exception e) {
            e.printStackTrace();
        }
        formater = comManager.formater;
        try {
            if (DOB != null) {
                dateOfBirth = formater.format(DOB).toString();
                java.util.Calendar birth = new java.util.GregorianCalendar();
                java.util.Calendar today = new java.util.GregorianCalendar();
                int age = 0;
                int factor = 0; //to correctly calculate age when birthday has not been yet celebrated
                java.util.Date birthDate = formater.parse(dateOfBirth);
                java.util.Date currentDate = comManager.today;//current date

                birth.setTime(birthDate);
                today.setTime(currentDate);

                // check if birthday has been celebrated this year
                if (today.get(java.util.Calendar.DAY_OF_YEAR) < birth.get(java.util.Calendar.DAY_OF_YEAR)) {
                    factor = -1; //birthday not celebrated
                }
                age = today.get(java.util.Calendar.YEAR) - birth.get(java.util.Calendar.YEAR) + factor;
                ageInYears = "" + age;
            } else {
                ageInYears = "Unknown";
                dateOfBirth = "Unknown";
                System.out.println("Error: Patient " + patientName + " dose not have a date of birth.");
            }
        } catch (java.text.ParseException e) {
            ageInYears = "Unknown";
            dateOfBirth = "Unknown";
            System.out.println("Given date: " + DOB.toString() + " not in expected format (Please enter a MM-DD-YYYY date)");
        }
    }

    public com.medcisive.utility.NoteBuilder getNote() {
        if (note == null) {
            com.medcisive.commend.server.CommendDatabaseController dbc = new com.medcisive.commend.server.CommendDatabaseController();
            Integer patSID = Integer.parseInt(patientSID);
            Integer proSID = Integer.parseInt(comManager.providerSID);
            note = dbc.getRecentNote(patSID, proSID);
        }
        return note;
    }

    public String getNextAppointment() {
        if (nextAppointment == null) {
            return "";
        }
        return formater.format(nextAppointment).toString();
    }

    public String getLastAppointment() {
        if (lastAppointment == null) {
            return "";
        }
        return formater.format(lastAppointment).toString();
    }

    public String getPercentMissed() {
        float precentMissed = ((float) noShowAppointments / (float) totalAppointments) * 100.0f;
        String temp = precentMissed + "";
        int index = temp.indexOf('.');
        if (index > 0) {
            temp = temp + "0000";
            temp = temp.substring(0, index + 2);
            return temp;
        }
        return "";
    }

    public String getLastTherapyMode() {
        com.medcisive.commend.server.PatientSummary ps = null;
        for (com.medcisive.commend.server.PatientSummary sum : patientSummary) {
            if (sum.getDetails().equalsIgnoreCase("Therapy Modes")) {
                ps = sum;
            }
        }
        if (ps != null) {
            String therapy = ps.getLastValue();
            if (therapy != null) {
                return therapy;
            }
        }
        return "N/A";
    }

    public String getLastFour() {
        if (lastFour == null) {
            lastFour = SSN.substring(5, SSN.length());
        }
        return lastFour;
    }

    public String getSideEffectsString() {
        com.medcisive.commend.server.PatientSummary ps = null;
        for (com.medcisive.commend.server.PatientSummary sum : patientSummary) {
            if (sum.getType().equalsIgnoreCase("S")) {
                ps = sum;
            }
        }
        if (ps != null) {
            String sideEffectsListString = ps.getDetails();
            com.medcisive.commend.server.CommendDatabaseController dbc = new com.medcisive.commend.server.CommendDatabaseController();
            java.util.HashMap<String, String> sideEffectsHash = dbc.getSideEffectsHash();
            return parseSideEffectsListString(sideEffectsListString, sideEffectsHash);
        }
        return "N/A";
    }

    private String parseSideEffectsListString(String list, java.util.HashMap<String, String> sideEffectsHash) {
        String head = getHeadSideEffect(list);
        head = sideEffectsHash.get(head);
        if ((head != null) && (!head.equalsIgnoreCase(""))) {
            int index = list.indexOf(',');
            if (index > -1) {
                list = list.substring(index + 1, list.length());
                String body = parseSideEffectsListString(list, sideEffectsHash);
                if (!body.equalsIgnoreCase("")) {
                    head = head + ", " + body;
                }
            }
        } else {
            head = "";
        }
        return head;
    }

    private String getHeadSideEffect(String str) {
        int index = str.indexOf(',');
        String head = "";
        if (index > -1) {
            head = str.substring(0, index);
        } else {
            head = str;
        }
        return head;
    }

    public String getSideEffectsData() {
        //if(sedm==null) { //allow updates
        sedm = new SideEffectDataManager(this);
        //}
        return sedm.getData();
    }

    public String getOutcomeData(String type) {
        //if(odm==null) { //allow updates
        odm = new OutcomeDataManager(this);
        //}
        return odm.getOutcomeData(type);
    }

    public String getMedicationData() {
        //if(mdm==null) { //allow updates
        mdm = new MedicationDataManager(this);
        //}
        return mdm.getMedicationData();
    }

    public String getTherapiesData() {
        //if(tdm==null) { //allow updates
        tdm = new TherapiesDataManager(this);
        //}
        return tdm.getTherapiesData();
    }

    public java.util.ArrayList<java.util.LinkedHashMap<String, Object>> getNoteEncounters() {
        com.medcisive.commend.server.CommendDatabaseController dbc = new com.medcisive.commend.server.CommendDatabaseController();
        return dbc.getNoteEncounters(patientIEN);
    }

    public String getHeShe() {
        if (this.sex.equalsIgnoreCase("M")) {
            return "he";
        }
        return "she";
    }

    public String getMaleFemale() {
        if (this.sex.equalsIgnoreCase("M")) {
            return "MALE";
        }
        return "FEMALE";
    }

    public void print() {
        String out = "Name: " + patientName + " DFN: " + patientIEN + " SSN: " + SSN;
        System.out.println(out);
    }
}
