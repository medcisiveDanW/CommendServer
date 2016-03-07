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
        <title>Group Note</title>
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        
        <link rel="stylesheet" type="text/css" href="css/outcomeNote.css">
        <link rel="stylesheet" type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css">
        <link rel="stylesheet" type="text/css" href="css/therapyModePopup.css">
        <link rel="stylesheet" type="text/css" href="css/demo_page.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table_jui.css">
        <link rel="stylesheet" type="text/css" href="javascript/root/jquery.mb.menu-2.9.6/css/menu_red.css" media="screen" />
        
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="javascript/root/jQueryCustomFunctions.js"></script>
        <script type="text/javascript" src="javascript/root/GroupNote.js"></script>
        <script type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <script type="text/javascript" src="javascript/patientData/PatientData.js"></script>
        <script type="text/javascript" src="javascript/patientData/TherapyMode.js"></script>
        <script type="text/javascript" src="javascript/patientData/SymptomFunctioningScale.js"></script>
        <script type="text/javascript" src="javascript/patientData/GoalTrackingMeasures.js"></script>
        <script type="text/javascript" src="javascript/patientData/SideEffects.js"></script>
        <script type="text/javascript" src="javascript/patientData/CustomGoal.js"></script>
        <script type="text/javascript" src="javascript/root/TherapyModePopupController.js"></script>
        <script type="text/javascript" src="javascript/root/FeedbackPopupController.js"></script>
        <script type="text/javascript" src="javascript/root/Utility.js"></script>

        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.metadata.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/mbMenu.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.hoverIntent.js"></script>
        
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
                $('body').data('patData',patData);
                $('#therapyModeDialogId').dynamicDialog(therapyModePopupController);
                $('#feedbackDialogId').dynamicDialog(new FeedbackPopupController('.', ajaxManager));
                $('#outcomeNoteDivId').tabs();
                var groupNote = new GroupNote('<%=manager.getCurrentPatient().sta3n%>','<%=manager.getCurrentPatient().patientSID%>');
                groupNote.init();
                $('#patientDetailHeaderName').tooltip('Click to view <%=manager.getCurrentPatient().patientName %> details page');
                
                var titleSelector = new NoteTitle('<%=manager.getCurrentPatient().patientIEN%>');
                titleSelector.init();
            });
        </script>
        <style type="text/css">
            .ui-dialog-titlebar-close {
                display: none;
            }
                        
            .ui-button-text {
                padding: 0.0em 0.5em !important;
            }
            
        </style>
    </head>
    <body class="patientDetailBody">
        <div id="saveingOverlayId" class="savingOverlay">
            <div class="savingOverlayBottom"></div>
            <div class="savingOverlayTop">
                <img src="images/loading.gif" alt=""/>
                <span>Saving Notes In Progress</span>
                <div id="groupMembersSavedSoFarDivId"></div>
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
                        <li><a href="#outcomeNoteTab-1"><span>Group Note</span></a></li>
                    </ul>
                    <div id="outcomeNoteTab-1" style="">
                        <table style="width: 100%;">
                            <tr>
                                <td><span>Select Note Title</span></td>
                                <td>
                                    <input id="noteTitleSearchTextId" type="text" value="Enter Desired Title" style="width:120px; float: left;"/>
                                    <button id="noteTitleSearchId" class="button-class" style="float: left; margin: 0; padding: 0;">Search Note Title</button>
                                </td>
                            </tr>
                            <tr>
                                <td><span>Note Title</span></td>
                                <td><select id="noteTitleSelectorOptionId" style="width:520px;"></select></td>
                            </tr>
                            <tr>
                                <td><span>Select Encounter</span></td>
                                <td><select id="encounterSelectId" name="encounter" title="Encounter Selection" style="width:520px;"></select></td>
                            </tr>
                        </table>
                        <div style="width: 100%; height: 510px; float: left;">
                            <div style="width: 29%; float: left;  border: inset 2px;">
                                <div id="groupMembersDivId" style="width: 100%; float: left;"></div>
                            </div>
                            <div style="width: 70%; height: 500px; float: left;">
                                <div style="width: 98%; height: 500px; float: right;">
                                    <div style="width: 100%; height: 34px;">
                                        <div style="float: left"><button id="therapyModeButtonId">Enter Group Session Procedure</button></div>
                                        <div id="noteHeaderInfoDivId" style="float: left"></div>
                                        <div style="float: right"><button id="saveButtonId">Save</button></div>
                                    </div>
                                    <div style="width: 100%; height: 25px;">
                                        <div style="float: left"><span style="font-size: 1.2em; font-weight: bold;">Group Session:</span></div>
                                    </div>
                                    <textarea id="groupNoteTextareaId" style="width: 100%; height: 190px;"></textarea>
                                    <div style="width: 100%; height: 25px;">
                                        <div style="float: left"><span style="font-size: 1.2em; font-weight: bold;">Participation:</span></div>
                                        <div id="currentMemberDivId" style="float: left; padding-left: 10px; font-size: 1.2em; font-weight: bold;"></div>
                                    </div>
                                    <textarea id="patientNoteTextareaId" style="width: 100%; height: 190px;"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button id="feedbackButtonId">Feedback</button>
            </div>
            <div id="patientDetailFooter">
            </div>
        </div>
        <div id="patientDetialPopups">
            <div id="therapyModeDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="feedbackDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
        </div>
    </body>
</html>
<%}else{
    if(manager!=null) { manager.logMe("CommendWebappManager is not valid.", "1008"); }
    response.sendRedirect("shutdown.jsp");
}%>