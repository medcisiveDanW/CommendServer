package com.medcisive.commend.server;

import com.medcisive.utility.LogUtility;
import com.medcisive.utility.sql2.DBC;
import com.medcisive.utility.sql2.SQLObject;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author vhapalchambj
 */
public class PatientDBC extends com.medcisive.utility.sql2.DBCUtil {
    private CommendWebappManager _manager;

    public PatientDBC(CommendWebappManager manager) { _manager = manager; }

    public java.util.Map getPatientEncounterData() {
//        [{
//            color: "#063",
//            fillColor: "",
//            data: [[1333043200000, 0], [1356194800000, 0], [1388335600000, 0], [self.today.getTime(),0]],
//            points: { symbol:"circle" }
//        }];
        final java.util.List data = new java.util.ArrayList();
        String query =
                "SELECT Sta3n \n"
                + "     ,PatientSID \n"
                + "     ,EncounterDate \n"
                + "     ,Symbol \n"
                + "     ,Color \n"
                + "     ,Type \n"
                + "FROM Commend.dbo.CommendPatientEncounterGraph \n"
                + "WHERE PatientSID = " + DBC.fixString(_manager.getCurrentPatient().patientSID) + " \n"
                + "  AND Sta3n = " + _manager.providerSta3n + " \n"
                + "ORDER BY Symbol, Color, EncounterDate";

        _dest.query(query, new SQLObject() {
            String symbol = null;
            String color = null;
            Flot flot = null;
            java.util.List pair;
        
            @Override
            public void row(ResultSet rs) throws SQLException {
                if(symbol==null || !symbol.equalsIgnoreCase(rs.getString("Symbol")) || !color.equalsIgnoreCase(rs.getString("Color"))) {
                    flot = new Flot();
                    flot.points.symbol = symbol = rs.getString("Symbol");
                    flot.color = color = rs.getString("Color");
                    flot.type = rs.getString("Type");
                    data.add(flot);
                }
                pair = new java.util.ArrayList();
                pair.add(rs.getTimestamp("EncounterDate").getTime());
                pair.add(0);
                flot.data.add(pair);
            }
        });
        query =
                "SELECT \n"
                + "      flat.encounterDate \n"
                + "      ,flat.cptCodes \n"
                + "      ,flat.primaryDiagnosis \n"
                + "      ,flat.secondaryDiagnosis \n"
                + "FROM \n"
                + "	Commend.dbo.CommendVISNEncounterFlatten flat, \n"
                + "	Commend.dbo.CommendDemographics demo \n"
                + "WHERE \n"
                + "	flat.SSN = demo.SSN \n"
                + " AND demo.patientSID = " + com.medcisive.utility.sql2.DBC.fixString(_manager.getCurrentPatient().patientSID) + " \n"
                + "ORDER BY flat.encounterDate";
        final java.util.Map info = new java.util.HashMap();
        _dest.query(query, new SQLObject() {

            @Override
            public void row(ResultSet rs) throws SQLException {
                long key = rs.getTimestamp("EncounterDate").getTime();
                java.util.Map subInfo = new java.util.HashMap();
                subInfo.put("cptCodes", rs.getString("cptCodes"));
                subInfo.put("primaryDiagnosis", rs.getString("primaryDiagnosis"));
                subInfo.put("secondaryDiagnosis", rs.getString("secondaryDiagnosis"));
                info.put(key, subInfo);
            }
        });
        java.util.Map result = new java.util.HashMap();
        result.put("flot", data);
        result.put("info", info);
        return result;
    }

    public class Symbol {
        public String symbol;
    }
    public class Flot {
        public String color = "";
        public String fillColor = "";
        public String type = "";
        public java.util.List data = new java.util.ArrayList();
        public Symbol points = new Symbol();
    }
}
