<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<%@ page import="gov.va.med.Emrsvc.*" %>
<%
    CommendWebappManager comManager = (CommendWebappManager)session.getAttribute("CommendWebappManager");
    CommendDatabaseController dbc = new CommendDatabaseController();

    String idStr = request.getParameter("id");
    String nameStr = request.getParameter("name");
    String questionStr = request.getParameter("question");
    String scaleId = request.getParameter("scaleId");
    String goalStr = request.getParameter("goal");
    String valueStr = request.getParameter("value");
    String isRangeHigherStr = request.getParameter("isRangeHigher");
    String freqUnitStr = request.getParameter("freqUnit");
    String statusStr = request.getParameter("status");
    String isCheckedStr = request.getParameter("isChecked");
    String min = request.getParameter("min");
    String max = request.getParameter("max");


    String outcomeId = "";
    if(statusStr.equalsIgnoreCase("new")) {
        outcomeId = dbc.saveNewOutcome(nameStr, questionStr, scaleId, goalStr, max, isRangeHigherStr.equalsIgnoreCase("true"), freqUnitStr, comManager.providerDUZ);
    }
    else if(statusStr.equalsIgnoreCase("update")&&(idStr!=null)) {
        outcomeId = dbc.updateOutcome(idStr, nameStr, questionStr);
    }
    else if(statusStr.equalsIgnoreCase("delete")&&(idStr!=null)) {
        if(dbc.isOutcomeUsed(idStr)) {
            dbc.disableOutcome(idStr);
        } else {
            dbc.deleteOutcome(idStr);
        }
    }
    if(outcomeId.isEmpty()) {
        outcomeId = idStr;
    }

    System.out.println("Cutsome outcome: " + nameStr);
    System.out.println("idStr " + idStr);
    System.out.println("outcomeId " + outcomeId);
    System.out.println("questionStr " + questionStr);
    System.out.println("scaleId " + scaleId);
    System.out.println("goalStr " + goalStr);
    System.out.println("valueStr " + valueStr);
    System.out.println("isRangeHigherStr " + isRangeHigherStr);
    System.out.println("freqUnitStr " + freqUnitStr);
    System.out.println("statusStr " + statusStr);
    System.out.println("isCheckedStr " + isCheckedStr);

    out.println(outcomeId);
%>