<%--
    Document   : CommendGraphs
    Created on : Oct 12, 2010, 2:16:50 PM
    Author     : vhapalchambj
--%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    CommendWebappManager manager = (CommendWebappManager)session.getAttribute("CommendWebappManager");
%>
<%if( (manager!=null) && manager.isValid ) {%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <link rel="stylesheet" type="text/css" href="css/commendGraphs.css" />
        <link rel="stylesheet" type="text/css" href="../../css/newBlue/jquery-ui-1.8.11.custom.css" />
        <script language="javascript" type="text/javascript" src="../../javascript/root/jquery-1.5.1.min.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/flot/excanvas.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/flot/jquery.flot.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/flot/jquery.flot.navigate_GraphAPI.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/flot/jquery.flot.symbol.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/flot/jquery.flot.resize.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/jroot/query.wresize.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/GeneralUtil.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/GFXUtil.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/MedUtil.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ScoreGraphAPI.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/MedGraphAPI.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/date.format.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/PatientEncounterGraph.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/AjaxManager.js"></script>
        <script language="javascript" type="text/javascript" src="../../javascript/root/Utility.js"></script>
        <script type="text/javascript">
            $(function() {
                var scoreGraph, spanGraph, encounterGraph, dateSpan,
                    scoreHash = {
                        "choiceSympFunc": { data: <%=manager.getCurrentPatient().getOutcomeData("S")%> },
                        "choiceGoalTracking": { data: <%=manager.getCurrentPatient().getOutcomeData("G")%> },
                        "choiceCustom": { data: <%=manager.getCurrentPatient().getOutcomeData("C")%> },
                        "choiceSideEffects": { data: <%=manager.getCurrentPatient().getSideEffectsData()%> }
                    },
                    spanHash = {
                        "choiceMeds": { data: <%=manager.getCurrentPatient().getMedicationData()%> },
                        "choiceTherapys": { data: <%=manager.getCurrentPatient().getTherapiesData()%> }
                    };

                function changeDateSpan(monthsBack) {
                    scoreGraph.options.xaxis.min = scoreGraph.dateSpan.end - scoreGraph.oneMonth*monthsBack,
                    scoreGraph.options.xaxis.max = scoreGraph.dateSpan.end;
                    scoreGraph.draw();
                    spanGraph.options.xaxis.min = scoreGraph.dateSpan.end - scoreGraph.oneMonth*monthsBack,
                    spanGraph.options.xaxis.max = scoreGraph.dateSpan.end;
                    spanGraph.draw();
                    encounterGraph.options.xaxis.min = scoreGraph.dateSpan.end - scoreGraph.oneMonth*monthsBack,
                    encounterGraph.options.xaxis.max = scoreGraph.dateSpan.end;
                    encounterGraph.draw();
                };
                var ajaxManager = new AjaxManager('<%=manager.getCurrentPatient().SSN%>','<%=manager.providerDUZ%>','<%=manager.computerName%>');
                $("button").button();
                dateSpan = { start: <%=manager.today.getTime()-(manager.oneDay*30*6) %>, end: <%=manager.today.getTime()%> };
                scoreGraph = new ScoreGraphAPI("canvasScores", scoreHash, dateSpan, ajaxManager);
                spanGraph = new MedGraphAPI("canvasSpans", spanHash, dateSpan, ajaxManager);
                encounterGraph = new PatientEncounterGraph("encounterGraphDivId");
		$("#commendGraphsMeasures").accordion( {collapsible: true, active: false, autoHeight: true });
                $("#commendGraphsMedTherapy").accordion( {collapsible: true, active: false, autoHeight: true });

                $(".subBodyX4").height($("#commendGraphsMesuresOptionContainer").height());
                $(".subBodyX2").height($("#commendGraphsMedicationOptionContainer").height());
                $('#sixMonthSpanButtonId').click(function() { changeDateSpan(6); });
                $('#oneYearSpanButtonId').click(function() { changeDateSpan(12); });
                $('#twoYearSpanButtonId').click(function() { changeDateSpan(24); });
                $('#threeYearSpanButtonId').click(function() { changeDateSpan(36); });
                $('#commendGraphsMedTherapy').resize(function() { spanGraph.draw(); });

            });
        </script>
    </head>
    <body class="ui-widget-content" style="padding: 0px; margin: 0px; width: 100%; height: 450px; border: 0px;">
        <div id="strLenghtDiv" style="position:absolute;visibility:hidden"></div>
        <div style="width: 100%; height: 28px;">
            <button id="sixMonthSpanButtonId">6 Months</button>
            <button id="oneYearSpanButtonId">1 Year</button>
            <button id="twoYearSpanButtonId">2 Years</button>
            <button id="threeYearSpanButtonId">3 Years</button>
        </div>
        <div id="commendGraphsBody">
            <div id="commendGraphsMeasures">
                <h3><a href="#">Measures</a></h3>
                <div id="commendGraphsMesuresOptionContainer">
                    <%@include file="mesures.jsp"%>
                </div>
            </div>
            <div style="position: relative; top: 25px; padding: 10px;">
                <div id="canvasScores" style="width:100%;height:180px;"></div>
                <div id="encounterGraphDivId" style="width:100%;height:40px;"></div>
                <div id="canvasSpans" style="width:100%;height:180px;margin:0px;"></div>
            </div>
            <div id="commendGraphsMedTherapy">
                <h3><a href="#">Medication and Therapy</a></h3>
                <div id="commendGraphsMedicationOptionContainer">
                    <%@include file="medicationTherapy.jsp"%>
                </div>
            </div>
        </div>
    </body>
</html>
<%}else{ response.sendRedirect("http://localhost:7167/COMMEND/shutdown.jsp"); }%>
