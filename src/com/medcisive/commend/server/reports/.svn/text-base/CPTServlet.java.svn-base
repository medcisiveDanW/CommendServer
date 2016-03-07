package com.medcisive.commend.server.reports;

import com.medcisive.utility.sql2.DBCServlet;
import com.medcisive.utility.sql2.SQLTable;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author vhapalchambj
 */
public class CPTServlet extends DBCServlet {

    @Override
    public Object process(HttpServletRequest request) {
        Object result = null;
        String option = (String) request.getParameter("option");
        if (option.equalsIgnoreCase("getCPTPatterns")) {
            result = _getCPTPatterns(request);
        }
        return result;
    }

    private Object _getCPTPatterns(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        String catIdStr = (String) request.getParameter("temporalCatId");
        String offsetStr = (String) request.getParameter("temporalOffset");
        int wgId = Integer.parseInt(wgIdStr);
        int catId = Integer.parseInt(catIdStr);
        int offset = Integer.parseInt(offsetStr);
        return getCPTPatterns(wgId, catId, offset);
    }
    
    public Object getCPTPatterns(int wgId, int catId, int offset) {
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.putAll(ReportsServlet.getStartEnd(catId, offset));
        String query
                = "SELECT DISTINCT \n"
                + "     m.providerName AS name \n"
                + "     ,p.staffSID \n"
                + "     ,p.wgID \n"
                + "     ,p.offset \n"
                + "     ,p.offsetType \n"
                + "     ,p.EncTot \n"
                + "     ,p.TooManyEM \n"
                + "     ,p.Prescribing \n"
                + "     ,p.Intake \n"
                + "     ,p.AddOnWithEM \n"
                + "     ,p.AddOnOnly \n"
                + "     ,p.Crisis \n"
                + "     ,p.HighComplexity \n"
                + "     ,p.MediumComplexity \n"
                + "     ,p.LowComplexity \n"
                + "     ,p.GroupTherapy \n"
                + "     ,p.ProlongedService \n"
                + "     ,p.InteractiveComplexity \n"
                + "FROM Commend.dbo.CommendVISNProviderCPTPatterns p, \n"
                + "	Commend.dbo.CommendVISNWorkGroupMembers m \n"
                + "WHERE \n"
                + "	m.providerSID = p.staffSID \n"
                + "	AND m.wgID = " + wgId + " \n"
                + "     AND p.wgID is NULL \n"
                + "	AND p.offsetType = " + catId + " \n"
                + "	AND p.offset = " + offset + " \n"
                + "GROUP BY m.providerName,p.staffSID,p.wgID,p.offset,p.offsetType,p.EncTot,p.TooManyEM,p.Prescribing,p.Intake,p.AddOnWithEM,p.AddOnOnly,p.Crisis,p.HighComplexity,p.MediumComplexity,p.LowComplexity,p.GroupTherapy,p.ProlongedService,p.InteractiveComplexity \n";
        SQLTable data = _dest.getTable(query);
        result.put("data", data);
        return result;
    }
}
