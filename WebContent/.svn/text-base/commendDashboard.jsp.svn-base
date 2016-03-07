<%--
    Document   : CommendDashboard
    Created on : Jul 14, 2010, 11:51:19 AM
    Author     : vhapalchambj
--%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    String key = (String)request.getParameter("key");
    CommendWebappManager manager = (CommendWebappManager)session.getAttribute("CommendWebappManager");
    boolean isTestingEnabled = (Boolean)session.getAttribute("isTestingEnabled");
    boolean isSiteEnabled = (Boolean)session.getAttribute("isSiteEnabled");
    String managerStr = "Old Manager";
    SimpleDateFormat inFormat = new SimpleDateFormat("MMM dd,yyyy");
    SimpleDateFormat outFormat = new SimpleDateFormat("MM/dd/yy");
    if(manager==null) {
    	managerStr = "NULL Manager!";
    }
    if( (manager==null) && (key==null) && (isTestingEnabled==true) ) {
        session.setAttribute("CommendWebappManager", manager = new CommendWebappManager() );
    }
    else if( (manager==null) && (key!=null)  ) {
        managerStr = "New Manager";
        session.setAttribute("CommendWebappManager", manager = new CommendWebappManager(key) );
    }
    else if( (manager!=null) && (key!=null) ) {
        if(manager.reinitializManager(key)) {
            managerStr = "New Manager";
            session.setAttribute("CommendWebappManager", manager = new CommendWebappManager(key) );
        } else {
            manager.isValid = manager.setCurrentPatientByKey(key);
        }
    }
    String lastAppointment = "";
    String age = "";
    String lastTherapyMode = "";
    java.util.List<PatientSummary> patientSummary = null;
    if(manager!=null && manager.getCurrentPatient()!=null && !manager.getCurrentPatient().getLastAppointment().isEmpty()){
        java.util.Date lad = inFormat.parse(manager.getCurrentPatient().getLastAppointment());
        lastAppointment = outFormat.format(lad);
        age = manager.getCurrentPatient().ageInYears;
        lastTherapyMode = manager.getCurrentPatient().getLastTherapyMode();
        patientSummary = manager.getCurrentPatient().patientSummary;
    }
    
    //manager.setCurrentPatientByDFN("7333296");
    boolean isPatientInPanel = false;
    if(manager!=null) {
    	isPatientInPanel = manager.isInPatientPanel;
    }
    System.out.println("managerStr: " + managerStr + " isTesting: " + isTestingEnabled + ", isVISN: " + isSiteEnabled + " key: " + key);
%>
<%if( (manager!=null) && manager.isValid ) { manager.logMe("Commend Dashboard Selected.","1002"); %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <title>COMMEND Dashboard</title>
        <link type="text/css" rel="stylesheet" href="css/dashboard.css"/>
        <link type="text/css" rel="stylesheet" href="css/newBlue/jquery-ui-1.8.11.custom.css">
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jQueryCustomFunctions.js"></script>
        <script type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <script type="text/javascript">
            var clientWindowLockPatient = false;
            var clientWindowLockSize = true;
            var clientWindowLockPosition = true;
            var clientWindowWidth = 700;
            var clientWindowHeight = 200;
            var images;
            function changeScreenSize(w,h)
            { window.resizeTo( w,h ); }
            function submitForm(myFormID)
            { document.forms[myFormID].submit(); }
            function bgSwap(elem,att)
            { elem.style.backgroundImage = 'url('+elem.getAttribute(att)+')'; }
            $(function(){
                <%if(isPatientInPanel) {%>
                $('#outcomeNoteDivId').click(function() {
                    submitForm('outcomeNoteFormId');
                });
                $('#outcomeNoteDivId').tooltip('Write a Quick Note');
                $('#patientDetailsDivId').click(function() {
                    submitForm('patientSubmit');
                });
                $('#patientDetailsDivId').tooltip('View Patients Details and Write Template Note');
                <%}else{%>
                $('#patientDetailsDivId').tooltip('Patients Details are not available.');
                <%}%>
                $('#patientPanelDivId').tooltip('View Your Patient Pannel');
                $('#reportsDivId').tooltip('View Administrative Reports');
                
                $('#groupNoteDivId').click(function() {
                    submitForm('groupNoteFormId');
                });
                $('#groupNoteDivId').tooltip('Write a Group Note');
            });
        </script>
    </head>
    <body>
        <form id="outcomeNoteFormId" action="outcomeNote.jsp" method="post" style="margin: 0px; padding: 0px;"></form>
        <form id="groupNoteFormId" action="groupNote.jsp" method="post" style="margin: 0px; padding: 0px;"></form>
        <form id="patientSubmit" action="PatientDetail/patientDetail.jsp" method="post" style="margin: 0px; padding: 0px;"></form>
        <div class="dashboard">
            <div class="comTop">
                <div class="provider">
                    <span><%=manager.providerName%></span>
                </div>
            </div>
            <div style="width: 689px; height: 30px; display: block;">
                <div class="comBottemLeft"></div>
                <div class="comBottemCen"
                    <%if(isPatientInPanel) {%>
                        regbg="images/testdashboard2_03.gif"
                        overbg="images/testdashboard2selected_03.gif"
                        onmouseover="javascript:bgSwap(this,'overbg')"
                        onmouseout="javascript:bgSwap(this,'regbg')"
                    <%}else {%>
                        style="background-image: url(images/testdashboard2_03_2.gif)"
                    <%}%>
                    >
                    <div class="textArea">
                        <div id="patientDetailsDivId" class="nameClass"><%=manager.getCurrentPatient().patientName%></div>
                        <%if(isPatientInPanel) {%>
                        <div id="outcomeNoteDivId" style="width:25px; float: left; margin-top: -2px; margin-left: 8px;"><img src="images/lit3.png" style="width: 25px; height: 25px;" ></div>
                        <%}%>
                        <div id="groupNoteDivId" style="width:25px; float: left; margin-top: -2px; margin-left: 8px;"><img src="images/G3.png" style="width: 25px; height: 25px;" ></div>
                    </div>
                </div>
                <div class="comBottemRight" regbg="images/testdashboard2_04.gif" overbg="images/testdashboard2selected_04.gif"
                    onmouseover="javascript:bgSwap(this,'overbg')"
                    onmouseout="javascript:bgSwap(this,'regbg')"
                    onmousedown="submitForm('panelSubmit')" >
                    <form id="panelSubmit" action="patientPanel.jsp" method="post" style="margin: 0px; padding: 0px;"></form>
                    <div class="textArea">
                        <div id="patientPanelDivId" class="nameClass">Panel Review</div>
                    </div>
                </div>
                <div class="comBottemRightRight"
                    <%if(isSiteEnabled) {%>
                        regbg="images/testdashboard2_04.gif"
                        overbg="images/testdashboard2selected_04.gif"
                        onmouseover="javascript:bgSwap(this,'overbg')"
                        onmouseout="javascript:bgSwap(this,'regbg')"
                        onmousedown="submitForm('siteSubmit')"
                    <%}else {%>
                        style="background-image: url(images/testdashboard2_04Gray.gif)"
                    <%}%>
                     >
                    <%if(isSiteEnabled) {%>
                    <form id="siteSubmit" action="reports/reports.html?name=<%=manager.providerName%>" method="post"></form>
                    <%}%>
                    <div class="textArea">
                        <div id="reportsDivId" class="nameClass">Reports</div>
                    </div>
                </div>
            </div>
            <div style="height: 78px;">
                <div class="ui-widget-content" style="float: left; height: 77px; width:49%;">
                    <table>
                        <tr>
                            <td class="ui-state-default">
                                Last Visit
                            </td>
                            <td>
                                <span class="ui-phi"><%=lastAppointment%></span>
                            </td>
                        </tr>
                        <tr>
                            <td class="ui-state-default">
                                Age
                            </td>
                            <td>
                                <span class="ui-phi"><%=age%></span>
                            </td>
                        </tr>
                        <tr>
                            <td class="ui-state-default">
                                Last Therapy Mode
                            </td>
                            <td>
                                <span class="ui-phi"><%=lastTherapyMode%></span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="ui-widget-content" style="float: left; height: 77px; width:50%; overflow-y: scroll;">
                    <%
                        boolean hashOutcomes = false;
                        if(patientSummary!=null){
                            for(com.medcisive.commend.server.PatientSummary ps : patientSummary) {
                                if(ps.getType().equalsIgnoreCase("O")){
                                    hashOutcomes = true;
                                }
                            }
                        }
                        if(hashOutcomes) {
                    %>
                    <table>
                        <thead>
                            <tr class="ui-state-default">
                                <th style="width: 120px;">
                                    Outcomes
                                </th>
                                <th style="width: 100px;">
                                    Last
                                </th>
                                <th style="width: 100px;">
                                    Baseline
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <%  for(com.medcisive.commend.server.PatientSummary ps : patientSummary) {
                                    if(ps.getType().equalsIgnoreCase("O")){
                                        int last = (int)Float.parseFloat(ps.getLastValue());
                                        int first = (int)Float.parseFloat(ps.getFirstValue());
                                        java.util.Date ld = inFormat.parse(ps.getLastDate());
                                        java.util.Date fd = inFormat.parse(ps.getFirstDate());
                            %>
                            <tr>
                                <td class="Outcome">
                                    <%=ps.getDetails()%>
                                </td>
                                <td class="Last" align="center">
                                    <span style="font-weight: bold; "><%=last%></span> <%=outFormat.format(ld)%>
                                </td>
                                <td class="Baseline" align="center">
                                    <span style="font-weight: bold; "><%=first%></span> <%=outFormat.format(fd)%>
                                </td>
                            </tr>
                            <%
                                    }
                                }
                            }
                            %>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
<%}else{
    if(manager!=null) { System.out.println("CommendWebappManager is not valid."); manager.logMe("CommendWebappManager is not valid.", "1008"); manager = null; }
    response.sendRedirect("shutdown.jsp");
}%>