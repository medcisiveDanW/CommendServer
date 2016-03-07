<%--
    Document   : PatientDetail
    Created on : Jul 30, 2010, 12:04:12 PM
    Author     : vhapalchambj
--%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<%@ page import="gov.va.med.Emrsvc.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    CommendWebappManager manager = (CommendWebappManager)session.getAttribute("CommendWebappManager");
    String patientDFN = request.getParameter("patientDFN");
    if( patientDFN!=null && !patientDFN.isEmpty() ) {
        manager.isValid = manager.setCurrentPatientByDFN(patientDFN);
    }
    boolean isDraftNote = manager.isDraftNote();
%>
<%if( (manager!=null) && manager.isValid ) { manager.logMe("Patient Details Selected.", "1004"); %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Patient Detail</title>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <link rel="stylesheet" type="text/css" href="../css/patientDetail.css">
        <link rel="stylesheet" type="text/css" href="../css/newBlue/jquery-ui-1.8.11.custom.css">
        <link rel="stylesheet" type="text/css" href="../css/customGoalTrackingMeasuresPopup.css">
        <link rel="stylesheet" type="text/css" href="../css/therapyModePopup.css">
        <link rel="stylesheet" type="text/css" href="../css/demo_page.css">
        <link rel="stylesheet" type="text/css" href="../css/demo_table.css">
        <link rel="stylesheet" type="text/css" href="../css/demo_table_jui.css">
        <script type="text/javascript" src="../javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="../javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="../javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="../javascript/root/jQueryCustomFunctions.js"></script>
        <script type="text/javascript" src="../javascript/root/AjaxManager.js"></script>
        <script type="text/javascript" src="../javascript/root/FeedbackPopupController.js"></script>
        <script type="text/javascript" src="../javascript/root/Utility.js"></script>
        <script type="text/javascript">
            var ajaxManager = null,
                clientWindowLockPatient = false,
                clientWindowLockSize = false,
                clientWindowLockPosition = false,
                clientWindowWidth = 1200,
                clientWindowHeight = 800;

            function updateNoteAccordionHeight(contentHeight) {
                $('#frameNote').height(contentHeight);
                $('#accordContent').height(contentHeight);
            };
            function returnToHomePage() {
                $('#returnToHomeId').submit();
            };
            $(function(){
                var hidePHI = true;
                $('#removePHIId').tooltip("Click to show/hide Protected Health Information (PHI).");
                $('#removePHIId').click(function() {
                    if(hidePHI) {
                        $('#removePHIId').val('Show PHI');
                        $('.ui-phi').hide();
                    } else {
                        $('#removePHIId').val('Hide PHI');
                        $('.ui-phi').show();
                    }
                    hidePHI = !hidePHI;
                });
                $('button').button();
                ajaxManager = new AjaxManager('<%=manager.getCurrentPatient().SSN%>','<%=manager.providerDUZ%>','<%=manager.computerName%>');

                $("#accordionGraphs").accordion( {
                    autoHeight: false,
                    collapsible: true,
                    change: function(e, ui) {
                        if($(ui.newContent).attr("id")==undefined) { $('#patientDetailGraphsIframeId').attr("src",''); }
                        else { $('#patientDetailGraphsIframeId').attr("src",'graphAPI/commendGraphs.jsp'); }
                    }
                });
                $("#accordionTreatmentMonitoring").accordion( {autoHeight: false, collapsible: true, active: false});
                $("#accordionNotes").accordion( { autoHeight: true, collapsible: true, active: false});

                $("#accordionNotes").click(function() {
                    setTimeout(function() {
                        var thisHeight = $('#frameNote').contents().height();
                        if(thisHeight==null || thisHeight==undefined || thisHeight<300) {
                            thisHeight = 300;
                        }
                        updateNoteAccordionHeight(thisHeight);
                    },300);
                });

                var noteURL = '../noteMHCFollowup.jsp';
                <%if(isDraftNote) {%>
                $('#draftNoteDialogId').dialog({
                    modal: true,
                    autoOpen: true,
                    resizable: false,
                    title: 'Draft Note Found',
                    buttons:{
                                Yes: function() {
                                    $('#frameNote').attr('src',noteURL+'?loadDraft=true');
                                    $('#draftNoteDialogId').dialog("close");
                                },
                                No: function() {
                                    $('#frameNote').attr('src',noteURL);
                                    $('#draftNoteDialogId').dialog("close");
                                }
                            }
                });
                <%}else{%>
                    $('#frameNote').attr('src',noteURL);
                    $('#draftNoteDialogId').hide();
                <%}%>
            });

        </script>
        <style type="text/css">
            .ui-dialog-titlebar-close {
                display: none;
            }
        </style>
    </head>
    <body class="patientDetailBody">
        <form id="returnToHomeId" action="../commendDashboard.jsp"></form>
        <input type="hidden" name="symFunId" value=""/>
        <div id="patientDetial">
            <div id="patientDetailHeader">
                <%@include file="patientDetailHeader.jsp" %>
            </div>
            <div class="patientDetailBody">
                <%@include file="graphs.jsp"%>
                <%@include file="notes.jsp"%>
                <button id="feedbackButtonId">Feedback</button>
            </div>
            <div id="patientDetailFooter">
            </div>
        </div>
        <div id="patientDetialPopups">
            <div id="feedbackDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="draftNoteDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"><span>A note draft for this patient has been found. Would you like to load it?</span></div>
        </div>
    </body>
</html>
<%}else{
    if(manager!=null) { manager.logMe("CommendWebappManager is not valid.", "1008"); }
    response.sendRedirect("../shutdown.jsp");
}%>