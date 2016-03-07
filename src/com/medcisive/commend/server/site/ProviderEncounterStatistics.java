package com.medcisive.commend.server.site;

import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.SQLTable;
import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 *
 * @author vhapalchambj
 */
public class ProviderEncounterStatistics extends com.medcisive.utility.sql2.DBCUtil {
    private String _sid;
    private String _sta3n;
    private SQLTable _encounters;
    private static final int _numberOfMonths = 12;
    private static final java.util.Date _todayDate = new java.util.Date();
    private static final java.sql.Timestamp _today = new java.sql.Timestamp(_todayDate.getTime());
    private static final java.util.ArrayList<java.sql.Timestamp> firstOfTheMonth = new java.util.ArrayList();
    private java.util.ArrayList<MonthBucket> buckets = new java.util.ArrayList();
    private static SimpleDateFormat sdf = new SimpleDateFormat("MMMMM yyyy");

    static {
        Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        //c.set(year, month, 1);
        c.set(year, month, 1, 0, 0, 0);
        c.roll(Calendar.MONTH, true);
        for(int i = 0; i < _numberOfMonths; i++) { // starts at month 0 and counts backwards one year.
            firstOfTheMonth.add(new java.sql.Timestamp(c.getTimeInMillis()));
            c.roll(Calendar.MONTH, false);
            if(c.get(Calendar.MONTH)==Calendar.DECEMBER) {
                c.roll(Calendar.YEAR, false);
            }
        }
    }

    public ProviderEncounterStatistics(String sid, String sta3n) {
        _sid = sid;
        _sta3n = sta3n;
        for(int i = 0; i < _numberOfMonths-1; i++) {
            MonthBucket bucket = new MonthBucket(firstOfTheMonth.get(i+1),firstOfTheMonth.get(i));
            buckets.add(bucket);
        }
        _encounters = getEncounterData();
        for (Integer i : _encounters.keySet()) {
            java.util.Map map = _encounters.getRow(i);
            for(MonthBucket bucket : buckets) {
                bucket.roundPegSquarHole(map);
            }
        }
        for(MonthBucket bucket : buckets) {
            bucket.go();
        }
    }

    public java.util.Map get() {
        java.util.Map<Long,java.util.Map<String,String>> result = new java.util.HashMap();
        for(MonthBucket bucket : buckets) {
            java.util.Map<String,String> map = new java.util.HashMap();
            String enc = "" + bucket.getEncounterCount();
            map.put("encounters",enc);
            String pat = "" + bucket.getPatientCount();
            map.put("patients",pat);
            String month = sdf.format(bucket.getMonth());
            map.put("month",month);
            result.put(bucket.getMonth().getTime(), map);
        }
        return result;
    }

    private SQLTable getEncounterData() {
        String query =
                "SELECT DISTINCT \n"
                + "    vprov.visitSID, \n"
                + "    vprov.visitDateTime, \n"
                + "    vprov.patientSID \n"
                + "FROM \n"
                + "    Commend.dbo.CommendVISNProvider cprov, \n"
                + "    Commend.dbo.CommendVISNPatientPanel pan,"
                + "    VDWWork.Outpat.VProvider vprov, \n"
                + "    VDWWork.Outpat.Visit vst, \n"
                + "    VDWWork.SStaff.SStaff stf, \n"
                + "    VDWWork.SPatient.SPatient pt, \n"
                + "    VDWWork.Dim.institution inst \n"
                + "WHERE stf.staffSID = " + DBC.fixString(_sid) + " \n"
                + "  AND vprov.sta3n = " + DBC.fixString(_sta3n) + " \n"
                + "  AND cprov.sta3n = vprov.sta3n \n"
                + "  AND stf.sta3n = cprov.sta3n \n"
                + "  AND pt.sta3n = stf.sta3n \n"
                + "  AND pan.RMFlag = 'Y' \n"
                + "  AND pan.staffSID = cprov.staffSID \n"
                + "  AND vprov.providerSID = cprov.staffSID \n"
                + "  AND stf.staffSID = vprov.providerSID \n"
                + "  AND pt.patientSID = vprov.patientSID \n"
                + "  AND vst.visitSID = vprov.visitSID \n"
                + "  AND inst.institutionSID = vst.InstitutionSID \n"
                + "  AND vprov.visitDateTime > DATEADD(MONTH,-" + _numberOfMonths + ", GETDATE()) \n"
                + "ORDER BY vprov.visitDateTime";
        return _dest.getTable(query);
    }

    class MonthBucket {
        private java.sql.Timestamp _start;
        private java.sql.Timestamp _end;
        private java.util.ArrayList<java.util.Map> _encounters = new java.util.ArrayList();
        private java.util.Map<String,String> _patients = new java.util.HashMap();
        private int _encounterCount = 0;
        private int _patientCount = 0;

        public MonthBucket(java.sql.Timestamp start, java.sql.Timestamp end) {
            _start = start;
            _end = end;
        }

        public void roundPegSquarHole(java.util.Map map) {
            java.sql.Timestamp ts = (java.sql.Timestamp)map.get("visitDateTime");
            if(ts.getTime()>_start.getTime() && ts.getTime()<_end.getTime()) {
                _encounters.add(map);
            }
        }

        public void go() {
            for(java.util.Map map : _encounters) {
                String patientSID = "" + map.get("patientSID");
                _patients.put(patientSID, patientSID);
                _encounterCount++;
            }
            _patientCount = _patients.size();
        }

        public int getEncounterCount() {
            return _encounterCount;
        }

        public int getPatientCount() {
            return _patientCount;
        }

        public java.sql.Timestamp getMonth() {
            return _start;
        }
    }
}
