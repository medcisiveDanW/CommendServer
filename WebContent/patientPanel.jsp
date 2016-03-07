<%--
    Document   : patientPanel
    Created on : Jul 22, 2010, 12:47:30 PM
    Author     : vhapalchambj
--%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    CommendWebappManager manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
%>
<%if ((manager!=null) && manager.isValid) { manager.logMe("Patient Panel Selected.","1003"); %>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Patient Panel</title>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <link type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_page.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table_jui.css" rel="stylesheet" />
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.wresize.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="javascript/root/dataTables.dateSort.js"></script>
        <script type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <style type="text/css">
            body{
                background-image:url('images/background.jpg');
                margin: 0px;
                padding: 0px;
            }
            #tables{
                height: 100%;
                width: 100%;
                margin: 0px;
                border: 0px;
                padding: 0px;
            }
            span.titleProvider{
                font-size: 15pt;
                font-weight: bolder;
                font-family: arial;
                color:rgb(235,235,235)
            }
            span.titleDate{
                font-size: 12pt;
                font-weight: bolder;
                font-family: arial;
                color:rgb(235,235,235)
            }
        </style>
        <script type="text/javascript">
            var clientWindowLockSize = false;
            var clientWindowLockPosition = false;
            var clientWindowWidth = 1200;
            var clientWindowHeight = 820;
            $(function() {
                var table = $('#patientPanelId').dataTable({
                    "iDisplayLength": 25,
                    "aLengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "aoColumnDefs": [ { "asSorting": [ "asc", "desc" ], "aTargets": [ 0 ] } ],
                    "aoColumnDefs": [ { "asSorting": [ "desc", "asc" ], "aTargets": [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] } ],
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers"
                });
                $('#patientPanelContainerDivId').height( $(window).height()-70 );
                $(window).wresize(function() {
                    $('#patientPanelContainerDivId').height( $(window).height()-70 );
                    table.fnDraw();
                });
            });
        </script>
    </head>
    <body>
        <table id="headerTableId" width="100%" border="0">
            <tr>
                <td>
                    <table class="ui-state-default" width="100%" border="0">
                        <tr>
                            <td width="33%">
                                <img align="left" src="images/VAlogo.gif" style="width: 50px; height: 50px;" alt="VAlogo">
                            </td>
                            <td width="34%" align="center">
                                <span class="titleProvider">
                                    <a><%=manager.providerName%></a>
                                </span>
                                <br>
                                <span class="titleDate">
                                    <a><%=manager.todayStr%></a>
                                </span>
                            </td>
                            <td width="33%">
                                <img align="right" src="images/COMMENDlogo.gif" style="width: 215px; height: 50px;" alt="COMMENDlogo">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <div id="patientPanelContainerDivId" style="width: 100%; height: 500px; overflow-y: auto; position: relative; top: 0px; left: 0px;">
            <table id="patientPanelId" cellpadding="0" cellspacing="0" border="0" class="display">
                <thead>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            SSN
                        </th>
                        <th>
                            Age
                        </th>
                        <th>
                            Last PCL
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            1st PCL
                        </th>
                        <th>
                            Date
                        </th>
                        <th>
                            Last appt.
                        </th>
                        <th>
                            % missed
                        </th>
                        <th>
                            Next appt.
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <%for (String DFN : manager.patients.keySet()) {
                            com.medcisive.commend.server.PatientData pd = manager.patients.get(DFN);
                            com.medcisive.commend.server.PatientSummary ps = new com.medcisive.commend.server.PatientSummary();
                            for (com.medcisive.commend.server.PatientSummary sum : manager.patients.get(DFN).patientSummary) {
                                if (sum.getDetails().equalsIgnoreCase("PCL-C")) {
                                    ps = sum;
                                }
                            }
                    %>
                    <tr class="gradeC">
                        <td>
                            <div style="float: left;"><a href="PatientDetail/patientDetail.jsp?patientDFN=<%=DFN%>"><%=manager.patients.get(DFN).patientName%></a></div>
                            <div id="outcomeNoteDivId" style="width:25px; float: left; margin-top: -2px; margin-left: 8px;"><a href="outcomeNote.jsp?patientDFN=<%=DFN%>"><img src="images/lit3.png" style="width: 25px; height: 25px; border: 0px;" ></a></div>
                        </td>
                        <td align="center">
                            <%=pd.getLastFour()%>
                        </td>
                        <td align="center">
                            <%=pd.ageInYears%>
                        </td>
                        <td align="center">
                            <%=ps.getLastValue()%>
                        </td>
                        <td align="center">
                            <%=ps.getLastDate()%>
                        </td>
                        <td align="center">
                            <%=ps.getFirstValue()%>
                        </td>
                        <td align="center">
                            <%=ps.getFirstDate()%>
                        </td>
                        <td align="center">
                            <%=pd.getLastAppointment()%>
                        </td>
                        <td align="center">
                            <%=pd.getPercentMissed()%>
                        </td>
                        <td align="center">
                            <%=pd.getNextAppointment()%>
                        </td>
                    </tr>
                    <%}%>
                </tbody>
            </table>
        </div>
    </body>
</html>
<%} else {
    response.sendRedirect("shutdown.jsp");
}%>