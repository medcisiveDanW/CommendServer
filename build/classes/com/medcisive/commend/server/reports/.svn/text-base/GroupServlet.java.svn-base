package com.medcisive.commend.server.reports;

import com.medcisive.utility.sql2.DBCServlet;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author vhapalchambj
 */
public class GroupServlet extends DBCServlet {

    @Override
    public Object process(HttpServletRequest request) {
        Object result = null;
        String option = (String) request.getParameter("option");
        if (option.equalsIgnoreCase("getGroupStatistics")) {
            result = _getGroupStatistics(request);
        }
        return result;
    }
    
    private Object _getGroupStatistics(HttpServletRequest request) {
        String wgIdStr = (String) request.getParameter("wgId");
        String catIdStr = (String) request.getParameter("temporalCatId");
        String offsetStr = (String) request.getParameter("temporalOffset");
        int wgId = Integer.parseInt(wgIdStr);
        int catId = Integer.parseInt(catIdStr);
        int offset = Integer.parseInt(offsetStr);
        return getGroupStatistics(wgId, catId, offset);
    }
    
    public Object getGroupStatistics(int wgId, int catId, int offset) {
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.putAll(ReportsServlet.getStartEnd(catId, offset));
        String query
                = "SELECT * \n"
                + "FROM Commend.dbo.CommendVISNGroupStatistics \n"
                + "WHERE WgID = " + wgId + " \n"
                + "  AND TemporalOffset = " + offset + " \n"
                + "  AND TemporalID = " + catId + " \n"
                + "ORDER BY Name";
        result.put("data", _dest.getTable(query));
        return result;
    }
}
