<%--
    Document   : outcomeNote
    Created on : Feb 5, 2013, 1:47:11 PM
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
    java.util.ArrayList<com.medcisive.commend.server.CustomOutcomeDefinition> outcomeArray = (java.util.ArrayList<com.medcisive.commend.server.CustomOutcomeDefinition>)manager.getCustomOutcomes();
    if( patientDFN!=null && !patientDFN.isEmpty() ) {
        manager.isValid = manager.setCurrentPatientByDFN(patientDFN);
    }
%>
<%if( (manager!=null) && manager.isValid ) { manager.logMe("Patient Details Selected.", "1004"); %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Outcome Note</title>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <link rel="stylesheet" type="text/css" href="css/outcomeNote.css">
        <link rel="stylesheet" type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css">
        <link rel="stylesheet" type="text/css" href="css/customGoalTrackingMeasuresPopup.css">
        <link rel="stylesheet" type="text/css" href="css/therapyModePopup.css">
        <link rel="stylesheet" type="text/css" href="css/demo_page.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table_jui.css">
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="javascript/root/jQueryCustomFunctions.js"></script>
        <script type="text/javascript" src="javascript/root/OutcomeNote.js"></script>
        <script type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <script type="text/javascript" src="javascript/patientData/PatientData.js"></script>
        <script type="text/javascript" src="javascript/patientData/TherapyMode.js"></script>
        <script type="text/javascript" src="javascript/patientData/SymptomFunctioningScale.js"></script>
        <script type="text/javascript" src="javascript/patientData/GoalTrackingMeasures.js"></script>
        <script type="text/javascript" src="javascript/patientData/SideEffects.js"></script>
        <script type="text/javascript" src="javascript/patientData/CustomGoal.js"></script>
        <script type="text/javascript" src="javascript/root/TherapyModePopupController.js"></script>
        <script type="text/javascript" src="javascript/root/SymptomFunctioningScalePopupController.js"></script>
        <script type="text/javascript" src="javascript/root/GoalTrackingMeasuresPopupController.js"></script>
        <script type="text/javascript" src="javascript/root/CustomGoalTrackingMeasuresPopupController.js"></script>
        <script type="text/javascript" src="javascript/root/CustomGoalTrackingMeasuresPopupManager.js"></script>
        <script type="text/javascript" src="javascript/root/SideEffectsPopupController.js"></script>
        <script type="text/javascript" src="javascript/root/FeedbackPopupController.js"></script>
        <script type="text/javascript" src="javascript/root/Utility.js"></script>


        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.metadata.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/mbMenu.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.hoverIntent.js"></script>
        <link rel="stylesheet" type="text/css" href="javascript/root/jquery.mb.menu-2.9.6/css/menu_red.css" media="screen" />


        <script type="text/javascript">
            var therapyModePopupController = null,
                symptomFunctioningScalePopupController = null,
                goalTrackingMeasuresPopupController = null,
                customGoalTrackingMeasuresPopupController = null,
                sideEffectsPopupController = null,
                ajaxManager = null,
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
                $('button').button();
                var customGoals = [];
                <%for(com.medcisive.commend.server.CustomOutcomeDefinition custom : outcomeArray) {%>
                    customGoals.push( new CustomGoal(<%=custom.id%>,'<%=custom.name%>','<%=custom.question%>',<%=custom.scaleId%>,<%=custom.goal%>,<%=custom.max%>,null,<%=custom.range%>,<%=custom.freqUnit%>,false));
                <%}%>
                var patData = new PatientData();
                patData.customGoals = customGoals;
                ajaxManager = new AjaxManager('<%=manager.getCurrentPatient().SSN%>','<%=manager.providerDUZ%>','<%=manager.computerName%>');

                therapyModePopupController = new TherapyModePopupController('./', patData, ajaxManager);
                symptomFunctioningScalePopupController = new SymptomFunctioningScalePopupController('./', patData,ajaxManager);
                goalTrackingMeasuresPopupController = new GoalTrackingMeasuresPopupController('./', patData, ajaxManager);
                var customGoalTrackingMeasuresPopupManager = new CustomGoalTrackingMeasuresPopupManager('./', patData, ajaxManager);
                customGoalTrackingMeasuresPopupController = new CustomGoalTrackingMeasuresPopupController(customGoalTrackingMeasuresPopupManager);
                sideEffectsPopupController = new SideEffectsPopupController('./', patData, ajaxManager);
                $('body').data('patData',patData);
                $('#therapyModeDialogId').dynamicDialog(therapyModePopupController);
                $('#symptomFunctioningDialogId').dynamicDialog(symptomFunctioningScalePopupController);
                $('#goalTrackingMeasuresDialogId').dynamicDialog(goalTrackingMeasuresPopupController);
                $('#customGoalTrackingMeasuresDialogId').dynamicDialog(customGoalTrackingMeasuresPopupController);
                $('#sideEffectsDialogId').dynamicDialog(sideEffectsPopupController);
                $('#feedbackDialogId').dynamicDialog(new FeedbackPopupController('.', ajaxManager));
                $('#outcomeNoteDivId').tabs();
                var outcomeNote = new OutcomeNote('<%=manager.getCurrentPatient().patientIEN%>');
                outcomeNote.init();
                $('#saveNoteButtonId').click(function() {
                    outcomeNote.save();
                });
                $('#patientDetailHeaderName').tooltip('Click to view <%=manager.getCurrentPatient().patientName %> details page');
            });
        </script>
        <style type="text/css">
            .ui-dialog-titlebar-close {
                display: none;
            }
        </style>
    </head>
    <body class="patientDetailBody">
        <div id="saveingOverlayId" class="savingOverlay">
            <div class="savingOverlayBottom"></div>
            <div class="savingOverlayTop">
                <img src="images/loading.gif" alt=""/>
                <span>Saving Note In Progress</span>
            </div>
        </div>
        <form id="returnToHomeId" action="commendDashboard.jsp"></form>
        <input type="hidden" name="symFunId" value=""/>
        <div id="patientDetial">
            <div id="patientDetailHeader">
                <div class="patientDetailHeaderContainer ui-state-default">
                    <div id="patientDetailLogoVA">
                        <img align="left" src="images/VAlogo.gif" alt="VAlogo" style="width: 50px; height: 50px;">
                    </div>
                    <div id="patientDetailHeaderTextContainer">
                        <div id="patientDetailHeaderTitle">
                            PTSD Treatment Monitoring
                        </div>
                        <div id="patientDetailHeaderName" class="patientDetailTextFormt">
                            <a href="PatientDetail/patientDetail.jsp?patientDFN=<%=manager.getCurrentPatient().patientIEN%>"><%=manager.getCurrentPatient().patientName%></a>
                        </div>
                        <div id="patientDetailHeaderSSN" class="patientDetailTextFormt">
                            <span class="ui-phi">SSN: <%=manager.getCurrentPatient().SSN%></span>
                        </div>
                    </div>
                    <div id="patientDetailLogoCommend">
                        <img align="right" src="images/COMMENDlogo.gif" alt="COMMENDlogo" style="width: 215px; height: 50px;">
                    </div>
                    <div id="patientDetialHeaderProvider" class="patientDetailTextFormt">
                        <span class="ui-phi">Provider: <%=manager.providerName%></span>
                    </div>
                </div>
            </div>
            <div class="patientDetailBody">
                <div id="outcomeNoteDivId">
                    <ul>
                        <li><a href="#outcomeNoteTab-1"><span>Outcome Data Note</span></a></li>
                    </ul>
                    <div id="outcomeNoteTab-1" style="">
                        <table class="header-table header" style="font-size:1.2em; font-weight:1.4; width: 100%;">
                            <tr>
                                <td style="width: 160px;">Select Encounter</td>
                                <td colspan="2"><select id="encounterSelectId" name="encounter" title="Encounter Selection" style="width:520px;"></select></td>
                            </tr>
                        </table>
                        <div style="width: 100%; height: 34px;">
                            <div style="float: left"><button id="therapyModeButtonId">Procedure</button></div>
                            <div style="float: left"><button id="symptomFunctioiningScaleButtonId">Symptom/Function Scale</button></div>
                            <div style="float: left"><button id="goalTrackingMeasuresButtonId">Goal Tracking Measures</button></div>
                            <div style="float: left"><button id="customGoalTrackingButtonId">Customized Goal Tracking</button></div>
                            <div style="float: left"><button id="sideEffectsButtonId">Side Effects</button></div>
                            <div style="float: right"><button id="saveNoteButtonId">Save Note</button></div>
                        </div>
                        <div style="width: 100%; height: 25px;">
                            <div style="float: left"><span style="font-size: 1.3em; font-weight: bold;">OUTCOME NOTE:</span></div>
                        </div>
                        <textarea id="outcomeNoteTextareaId" style="width: 100%; height: 480px;"></textarea>
                    </div>
                </div>
                <button id="feedbackButtonId">Feedback</button>
            </div>
            <div id="patientDetailFooter">
            </div>
        </div>
        <div id="patientDetialPopups">
            <div id="therapyModeDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="symptomFunctioningDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="goalTrackingMeasuresDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="customGoalTrackingMeasuresDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="sideEffectsDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="feedbackDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
        </div>
    </body>
</html>
<%}else{
    if(manager!=null) { manager.logMe("CommendWebappManager is not valid.", "1008"); }
    response.sendRedirect("shutdown.jsp");
}%>