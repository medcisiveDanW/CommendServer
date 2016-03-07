<%--
    Document   : MHCFollowupNote
    Created on : Jan 13, 2011, 1:55:04 PM
    Author     : vhapalchambj
--%>
<%@page import="com.medcisive.utility.LogUtility"%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.utility.NoteBuilder"%>
<%@ page import="gov.va.med.Emrsvc.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
    CommendWebappManager manager  = (CommendWebappManager)session.getAttribute("CommendWebappManager");
    java.util.ArrayList<com.medcisive.commend.server.CustomOutcomeDefinition> outcomeArray = (java.util.ArrayList<com.medcisive.commend.server.CustomOutcomeDefinition>)manager.getCustomOutcomes();
    String loadDraft = request.getParameter("loadDraft");
    NoteBuilder nb = null;
    NoteBuilder lastSavedNote = manager.getRecentNote();
    boolean isDraftNote = false;
    if(loadDraft!=null && loadDraft.equalsIgnoreCase("true")) {
        nb = manager.getDraftNote();
        isDraftNote = true;
    } else { nb = lastSavedNote; }
    String treatmentCorrdinator = nb.getBlock("Mental Health Treatment Coordinator:").trim();
    if(treatmentCorrdinator==null) { treatmentCorrdinator = nb.getBlock("Principal Mental Health Provider:").trim(); }
    if(treatmentCorrdinator!=null) {
        int index = treatmentCorrdinator.indexOf("Time in Session:");
        if(index>0) {
            treatmentCorrdinator = treatmentCorrdinator.substring(0,index).trim();
        } else { treatmentCorrdinator = ""; }
    }

    String sessionFocused = nb.getBlock("Session focused on the client's concerns including:").trim();

    String patInfo = "";
    try { patInfo = nb.getBlock("INFORMATION:").trim(); }
    catch (java.lang.Exception e) { patInfo = ""; LogUtility.error(e); }
    if(patInfo==null||patInfo.isEmpty()) {
        patInfo = manager.getCurrentPatient().ageInYears + " Y/O, " + manager.getCurrentPatient().race + ", " + manager.getCurrentPatient().getMaleFemale() + " veteran returns to MHC for a follow-up appointment.";
    } else if(patInfo.contains("Veteran's chart")) {
        int index = patInfo.indexOf("Veteran's chart");
        try { patInfo = patInfo.substring(0, index).trim(); }
        catch (java.lang.Exception e) { patInfo = ""; LogUtility.error(e); }
    }
    String plan = nb.getBlock("PLAN:");
    if(!plan.isEmpty()) {
        String regex = "(\\d*)([/]*)(Click Here)*";
        plan = plan.replaceAll(regex, "").replace("Client is scheduled for a follow-up appt at the MHC on .\n", "");
        plan = plan.replace("Client is scheduled for a follow-up appt at the MHC on \n", ""); // this is for old notes.
        plan = plan.trim();
    }

    String sessionNumberStr = nb.getBlock("Mental Health Treatment Coordinator:");
    if(sessionNumberStr.isEmpty()) {
        sessionNumberStr = nb.getBlock("Principal Mental Health Provider:");
    }
    sessionNumberStr = nb.clipHead("Session Number:",sessionNumberStr).trim();
    if(sessionNumberStr.isEmpty() || sessionNumberStr==null) {
        sessionNumberStr = "-1";
    }
    int sessionNumber = -1;
    try {
        sessionNumber = Integer.parseInt(sessionNumberStr);
    } catch(NumberFormatException e) { sessionNumber = -1; LogUtility.error(e); }
    if(sessionNumber<0) {
        sessionNumber = 1;
    } else {
        if(!isDraftNote) {
            sessionNumber++;
        }
    }

    String weightStr = (String)nb.getBlock("WEIGHT:").trim();

    weightStr = weightStr.replace("Lbs.", "");
    weightStr = weightStr.trim();
    int weight = 0;
    try { weight = Integer.parseInt(weightStr); }
    catch(NumberFormatException e) { weight = 0; LogUtility.error(e); }
    if(weight>0) { weightStr = "" + weight; }
    else { weightStr = ""; }

    String hurtingSelf = nb.getBlock("SUICIDAL/HOMICIDAL RISK:");
    if(hurtingSelf!=null && hurtingSelf.contains("Actions taken include:")) {
        hurtingSelf = nb.clipHead("Actions taken include:",hurtingSelf).trim();
        hurtingSelf = hurtingSelf.replaceAll("\n", " ");
    } else {
        hurtingSelf = "";
    }

    String ien = manager.getCurrentPatient().patientIEN;

    String currentSubstanceUse = nb.getBlock("CURRENT SUBSTANCE USE:").trim();
    if(currentSubstanceUse==null) { currentSubstanceUse = ""; }
    String medicationManagement = nb.getBlock("MEDICATION MANAGEMENT:").trim();
    if(medicationManagement==null) { medicationManagement = ""; }
    String activeProblemList = nb.getBlock("ACTIVE PROBLEM LIST:").trim();
    if(activeProblemList==null) { activeProblemList = ""; }
    String sideEffects = nb.getBlock("SIDE EFFECTS:").trim();
    if(sideEffects==null) { sideEffects = ""; }
    String labs = nb.getBlock("LABS:").trim();
    if(labs==null) { labs = ""; }
    //weightStr;
    if(weightStr==null) { weightStr = ""; }
    String mentalStatusExam = nb.getBlock("MENTAL STATUS EXAM:").trim();
    if(mentalStatusExam==null) { mentalStatusExam = ""; }
    String impression = nb.getBlock("IMPRESSION:").trim();
    if(impression==null) { impression = ""; }
    String tobacco = nb.getBlockSubSection("TOBACCO SCREEN:", "been completed.", 0, "[*]", 0).trim();
    if(tobacco==null) { tobacco = ""; }
    String clientStatesThat = nb.getBlock("Client states that");
    if(clientStatesThat!=null && clientStatesThat.contains("Comments:")) {
        clientStatesThat = nb.clipHead("Comments:",clientStatesThat).trim();
        clientStatesThat = clientStatesThat.replaceAll("\n", " ");
    } else {
        clientStatesThat = "";
    }
    String medicationRefills = nb.getBlock("Medication refills");
    if(medicationRefills!=null && medicationRefills.contains("not discussed because:")) {
        medicationRefills = nb.clipHead("not discussed because:",medicationRefills).trim();
        medicationRefills = medicationRefills.replaceAll("\n", " ");
    } else {
        medicationRefills = "";
    }
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css" />
        <link type="text/css" rel="stylesheet" href="css/MHCFollowupNote.css" />
        <link rel="stylesheet" type="text/css" href="css/customGoalTrackingMeasuresPopup.css">
        <link rel="stylesheet" type="text/css" href="css/therapyModePopup.css">
        <link rel="stylesheet" type="text/css" href="css/demo_page.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table.css">
        <link rel="stylesheet" type="text/css" href="css/demo_table_jui.css">
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="javascript/root/MHCFollowupNote.js"></script>
        <!--script type="text/javascript" src="javascript/MHCFollowupNoteStartup.js"></script-->
        <script type="text/javascript" src="javascript/root/NoteTitleSelector.js"></script>
        <script type="text/javascript" src="javascript/root/Utility.js"></script>
        <script type="text/javascript" src="javascript/root/jQueryCustomFunctions.js"></script>
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

        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.metadata.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/mbMenu.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.mb.menu-2.9.6/inc/jquery.hoverIntent.js"></script>
        <link rel="stylesheet" type="text/css" href="javascript/root/jquery.mb.menu-2.9.6/css/menu_red.css" media="screen" />

        <script type="text/javascript">
            $(function() {
                var autoOpenHash = [];
                autoOpenHash['substanceUseTextId'] = <%=!currentSubstanceUse.isEmpty()%>;
                autoOpenHash['suicidalRiskTextId'] = <%=!hurtingSelf.isEmpty()%>;
                autoOpenHash['medicationManagmentTextId'] = <%=!medicationManagement.isEmpty()%>;
                autoOpenHash['activeProblemListTextId'] = <%=!activeProblemList.isEmpty()%>;
                autoOpenHash['sideEffectsTextId'] = <%=!sideEffects.isEmpty()%>;
                autoOpenHash['labsTextId'] = <%=!labs.isEmpty()%>;
                autoOpenHash['weightTextId'] = <%=!weightStr.isEmpty()%>;
                autoOpenHash['mentalStatusExamTextId'] = <%=!mentalStatusExam.isEmpty()%>;
                autoOpenHash['impressionTextId'] = <%=!impression.isEmpty()%>;
                autoOpenHash['clientStatesThatTextId'] = false;
                autoOpenHash['medicationRefillsTextId'] = false;
                autoOpenHash['tobaccoScreenTextId'] = <%=!tobacco.isEmpty()%>;
                $('.noteButtonClass').button();
                var note = new MHCFollowupNote('<%=ien%>',autoOpenHash,<%=nb.toJSON()%>);
                $('#sessionNumberSelectId option[value=<%=sessionNumber%>]').attr('selected', 'selected');
                var customGoals = [];
                <%for(com.medcisive.commend.server.CustomOutcomeDefinition custom : outcomeArray) {%>
                    customGoals.push( new CustomGoal(<%=custom.id%>,'<%=custom.name%>','<%=custom.question%>',<%=custom.scaleId%>,<%=custom.goal%>,<%=custom.max%>,null,<%=custom.range%>,<%=custom.freqUnit%>,false));
                <%}%>
                note.patData.customGoals = customGoals;
                note.ajaxManager = new AjaxManager('<%=manager.getCurrentPatient().SSN%>','<%=manager.providerDUZ%>','<%=manager.computerName%>');
                note.init();
            });
        </script>
    </head>
    <body class="ui-widget-content" style="border: 0px;">
        <div style="width: 700px; margin: 0 auto;">
            <div id="saveingOverlayId" class="savingOverlay">
                <div class="savingOverlayBottom"></div>
                <div class="savingOverlayTop">
                    <img src="images/loading.gif" alt=""/>
                    <span>Saving Note In Progress</span>
                </div>
            </div>
            <div class="outterBlock" style="height: 30px;">
                <div class="innerBlockLeft">
                    <input class="saveDraftButtonClass noteButtonClass" type="button" value="Save Note Draft"/>
                </div>
                <div class="innerBlockLeft" style="float: right;">
                    <input class="noteSaveButtonClass" type="button" value="Save Note in CPRS"/>
                </div>
            </div>
<!--            <div>-->
                <table class="base-table" style="width: 100%;">
                    <tr>
                        <td>
                            <table class="header-table" style="width: 100%;">
                                <tr>
                                    <td style="width: 160px;"><span>Select Encounter</span></td>
                                    <td colspan="2"><select id="encounterSelectId" name="encounter" title="Encounter Selection" style="width:520px;"></select></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colspan="2">
                                        <input id="noteTitleSearchId" class="noteButtonClass" type="button" style="float: right;" value="Search Note Title" />
                                        <input id="noteTitleSearchTextId" type="text" value="Enter Desired Title" style="width:120px; float: right;"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>Note Title</span></td>
                                    <td colspan="2"><select id="noteTitleSelectorOptionId" style="width:520px;"></select></td>
                                </tr>
                                <tr>
                                    <td><span>Mental Health Treatment Coordinator:</span></td>
                                    <td style="padding-top: 12px;"><input id="principalmMentalHealthProviderTextId" type="text" value="<%=treatmentCorrdinator%>"/></td>
                                    <td><input id="therapyModeButtonId" class="noteButtonClass" type="button" style="float: right;" value="Procedure" /></td>
                                </tr>
                                <tr>
                                    <td><span>Time in Session:</span></td>
                                    <td>
                                        <input id="timeInSessionTextId" type="text" style="width:20px;"/><span>minutes</span>
                                    </td>
                                    <td>
                                        <select id="sessionNumberSelectId" title="Session Number Selection" style="float: right;">
                                            <option value="1" selected>1</option>
                                            <%for(int i = 2; i <= 40; i++) { %>
                                            <option value="<%=i%>"><%=i%></option>
                                            <%}%>
                                        </select>
                                        <span style="float: right;">Session Number:</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft header">
                                    INFORMATION:
                                </div>
                            </div>
                            <div class="outterBlock" style="height: 60px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="informationTextareaId" rows="3" cols="80" class="noteTextAreaFocusClass"><%=patInfo%></textarea>
                                </div>
                            </div>
                            <div class="outterBlock">
                                <div class="innerBlockLeft content shiftRight">
                                    Era of Service:<select id="eraOfServiceSelectId" title="Era of Service Selection">
                                                        <option value="" selected>Select</option>
                                                        <option value="NON-COMBAT">NON-COMBAT</option>
                                                        <option value="OEF/OIF/OND">OEF/OIF/OND</option>
                                                        <option value="PERSIAN GULF">PERSIAN GULF</option>
                                                        <option value="KOREAN CONFLICT">KOREAN CONFLICT</option>
                                                        <option value="POST VIETNAM">POST VIETNAM</option>
                                                        <option value="VIETNAM">VIETNAM</option>
                                                        <option value="WORLD WAR II">WORLD WAR II</option>
                                                    </select>
                                </div>
                            </div>
                            <div class="outterBlock" style="padding-top: 2px;">
                                <div class="innerBlockLeft content shiftRight">
                                    Veteran's chart <input id="veteranChartButtonId" type="button" value="was"/> reviewed.
                                </div>
                            </div>
                            <div class="outterBlock" style="padding-top: 2px;">
                                <div class="innerBlockLeft content shiftRight">
                                    <span id="sessionFocusedSpanId">Session focused on the client's concerns including:</span>
                                </div>
                            </div>
                            <div id="sessionFucusedDivId" class="outterBlock" style="height: 80px;">
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <textarea id="sessionFucusedTextId" rows="4" cols="80" class="noteTextAreaFocusClass"><%=sessionFocused%></textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="outterBlock">
                                <div class="innerBlockLeft content shiftRight">
                                    <input id="telehealthInputId" class="" type="checkbox">Telehealth Consent
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="substanceUseId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="substanceUseSpanId">CURRENT SUBSTANCE USE:</span>
                                </div>
                            </div>
                            <div id="substanceUseExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="substanceUseTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=currentSubstanceUse%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock" style="height: 110px;">
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft suicidalConfirm header">
                                        <span id="suicidalHomicidalRiskSpanId">SUICIDAL/HOMICIDAL RISK:</span>
                                    </div>
                                    <div class="innerBlockLeft content" style=" padding-left: 5px; padding-top: 3px;">
                                        Client *
                                    </div>
                                </div>
                                <div class="outterInnerBlock content shiftRight">
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="suicidalDeniedId" class="suicidalConfirm" type="checkbox"> denied current suicidal or homicidal thoughts.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="suicidalStableMoodId" class="suicidalConfirm" type="checkbox"> reports stable mood, no evidence of SI or HI.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="suicidalAcknowledgeId" class="suicidalConfirm" type="checkbox"> acknowledged suicidal/homicidal thoughts, but denied plan or intent.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft"></div>
                                        <div class="innerBlockLeft">
                                            <div id="suicidalId"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                        </div>
                                        <div class="innerBlockLeft">
                                            <span id="suicidalSpanId">is at high risk for hurting self or someone else. Actions taken include:</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="suicidalExpandId" class="outterInnerBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="suicidalRiskTextId" rows="5" cols="80" class="noteTextAreaFocusClass suicidalConfirm"><%=hurtingSelf%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="medicationManagmentId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="medicationManagmentSpanId">MEDICATION MANAGEMENT:</span>
                                </div>
                            </div>
                            <div id="medicationManagmentExpandId" class="outterBlock" style="height: 200px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="medicationManagmentTextId" rows="12" cols="80" class="noteTextAreaFocusClass"><%=manager.getMedicationManagement().trim()%> </textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="activeProblemListId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="activeProblemListSpanId">ACTIVE PROBLEM LIST:</span>
                                </div>
                            </div>
                            <div id="activeProblemListExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="activeProblemListTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=activeProblemList%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="sideEffectsId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="sideEffectsSpanId">SIDE EFFECTS:</span>
                                </div>
                                <div class="innerBlockRight" >
                                    <input id="sideEffectsButtonId" class="noteButtonClass" type="button" value="Side Effects"/>
                                </div>
                            </div>
                            <div id="sideEffectsExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="sideEffectsTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=nb.getBlock("SIDE EFFECTS:").trim()%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="labsId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="labsSpanId">LABS:</span>
                                </div>
                            </div>
                            <div id="labsExpandId" class="outterBlock " style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="labsTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=labs%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="weightId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="weightSpanId">WEIGHT:</span>
                                </div>
                            </div>
                            <div id="weightExpandId" class="outterBlock" style="height: 25px;">
                                <div class="innerBlockLeft shiftRight" style="padding-left: 20px;">
                                    <input type="text" id="weightTextId" class="noteTextAreaFocusClass" style="width: 40px;" value="<%=weightStr%>" />
                                </div>
                                <div class="innerBlockLeft" style="font-weight: bold;padding-left: 5px;" >Lbs.</div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="mentalStatusExamId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="mentalStatusExamSpanId">MENTAL STATUS EXAM:</span>
                                </div>
                                <div class="innerBlockRight">
                                    <input id="customGoalTrackingButtonId" class="noteButtonClass" type="button" value="Custom"/>
                                </div>
                                <div class="innerBlockRight">
                                    <input id="goalTrackingMeasuresButtonId" class="noteButtonClass" type="button" value="Goals/Symptoms"/>
                                </div>
                                <div class="innerBlockRight">
                                    <input id="symptomFunctioiningScaleButtonId" class="noteButtonClass" type="button" value="Standard"/>
                                </div>
                                <div class="innerBlockRight header">
                                    Measures:
                                </div>
                            </div>
                            <div id="mentalStatusExamExpandId" class="outterBlock" style="height: 200px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="mentalStatusExamTextId" rows="12" cols="80" class="noteTextAreaFocusClass">
Appearance and Behavior: appropriately dressed/groomed, good eye contact, responded well to redirection, cooperative, polite.
Motor Activity: No PMA/PMR, no abnormal movements
Speech: RRR, normal prosody and tone
Mood:
Affect: mood congruent, non-labile, reactive
Thought Process: linear
Thought Content: The patient denies suicidal/homicidal ideation.  Denies paranoia. Denies thought insertion/thought withdrawal/thought broadcasting.
Perception: Denies auditory/visual hallucinations.
Cognition: Alert and oriented to time, person and place.
Insight/Judgment: limited/limited</textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="impressionId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="impressionSpanId">IMPRESSION:</span>
                                </div>
                            </div>
                            <div id="impressionExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="impressionTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=impression%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft header">
                                    <span>ASSESSMENT:</span>
                                </div>
                            </div>
                            <div id="assessmentExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="assessmentTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=nb.getBlock("ASSESSMENT:").trim()%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft header">
                                    DIAGNOSIS:
                                </div>
                            </div>
                            <div id="diagnosisExpandId" class="outterBlock" style="height: 90px;">
                                <div class="innerBlockLeft shiftRight">
                                    <textarea id="diagnosisTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=nb.getBlock("DIAGNOSIS:").trim()%></textarea>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft header">
                                    <span id="planSpanId">PLAN:</span>
                                </div>
                            </div>
                            <div id="planExpandId" class="outterBlock" style="height: 140px;">
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft content shiftRight">
                                        Client is scheduled for a follow-up appt at the MHC on:
                                    </div>
                                </div>
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <input type="text" id="datepicker" value="Click Here">
                                    </div>
                                    <div class="innerBlockLeft shiftRight">
                                        <input type="text" id="alternate" size="25" disabled/>
                                    </div>
                                </div>
                                <div class="outterInnerBlock" style="padding-top: 5px;">
                                    <div class="innerBlockLeft shiftRight">
                                        <textarea id="TAplanTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=plan%></textarea>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="seenByAttendingPhysicianId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="seenByAttendingPhysicianSpanId">SEEN BY ATTENDING PHYSICIAN:</span>
                                </div>
                            </div>
                            <div id="seenByAttendingPhysicianExpandId" class="outterBlock" style="height: 115px;">
                                <div class="outterInnerBlock content shiftRight">
                                    <div class="innerBlockLeft">
                                        <input class="seenByAttendingPhysicianRadio" type="radio" name="seenByAttendingPhysicianGroup" value="Patient was seen and discussed in detail with Dr. <%=manager.providerName%>, Attending Physician, who agrees with the assessment, treatment and plan of care." checked> SEEN
                                    </div>
                                    <div class="innerBlockLeft">
                                        <input class="seenByAttendingPhysicianRadio" type="radio" name="seenByAttendingPhysicianGroup" value="Patient was discussed in detail with Dr. <%=manager.providerName%>, Attending Physician, who agrees with the assessment, treatment and plan of care."> NOT SEEN
                                    </div>
                                </div>
                                <div class="outterInnerBlock shiftRight">
                                    <div class="innerBlockLeft">
                                        <textarea id="seenByAttendingPhysicianTextareaId" rows="5" cols="80" class="noteTextAreaFocusClass"></textarea>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="LPSConservedId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="LPSConservedSpanId">LPS CONSERVED:</span>
                                </div>
                            </div>
                            <div id="LPSConservedExpandId" class="outterBlock" style="height: 115px;">
                                <div class="outterInnerBlock content shiftRight">
                                    <div class="innerBlockLeft">
                                        <input class="LPSConservedRadio" type="radio" name="LPSConservedGroup" value="Client/conservator knows how to reach case manager between appointments and knows the phone number for Telephone Care Program (1-800-455-0057).
    Patient is LPS conserved.  Treatment plan has been discussed with the conservator who has expressed understanding of the treatment options and benefits, side effects, and risks of treatment.
    Plan has been discussed and appropriate education done with conservator/patient, who understood and agreed." checked> WAS
                                    </div>
                                    <div class="innerBlockLeft">
                                        <input class="LPSConservedRadio" type="radio" name="LPSConservedGroup" value="Client knows how to reach case manager between appointments and knows the phone number for Telephone Care Program (1-800-455-0057).
    Treatment plan was discussed with the patient who expressed understanding of the treatment options and benefits, side effects, and risks of treatment. By my exam, the patient gives informed consent to the treatment suggested.  The patient has the capacity to enter into the above agreements.
    The patient agrees to contact the clinic, go to ER, or call 911 if a problem develops or if SI/HI develops.  The patient does not meet LPS criteria for 5150 at this time.
    Plan discussed and appropriate education done with patient, who understood and agreed."> WAS NOT
                                    </div>
                                </div>
                                <div class="outterInnerBlock shiftRight">
                                    <div class="innerBlockLeft">
                                        <textarea id="LPSConservedTextareaId" rows="5" cols="80" class="noteTextAreaFocusClass"></textarea>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock">
                                <div class="innerBlockLeft">
                                    <div id="clientStatesThatId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                </div>
                                <div class="innerBlockLeft header">
                                    <span id="clientStatesThatSpanId">PSYCH MEDS COMPLIANCE:</span>
                                </div>
                            </div>
                            <div id="clientStatesThatExpandId" class="outterBlock content" style="height: 200px;">
                                <div class="innerBlockLeft">
                                    <div class="innerBlockLeft shiftRight">
                                        Client states that
                                    </div>
                                    <div id="clientStatesThatHeSheDivId" class="innerBlockLeft" style="padding-left: 6px;">
                                        <%=manager.getCurrentPatient().getHeShe()%>
                                    </div>
                                </div>
                                <div class="innerBlockLeft" style="height: 90px;">
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="clientStatesThatTakingMedsId" type="checkbox" class="clientStatesCheckboxClass">
                                        </div>
                                        <div class="innerBlockLeft">
                                            is taking psych meds as prescribed.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="clientStatesThatNotTakingMedsId" type="checkbox" class="clientStatesCheckboxClass">
                                        </div>
                                        <div class="innerBlockLeft">
                                            is not taking psych meds as prescribed.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="clientStatesThatLikeChangeMedsId" type="checkbox" class="clientStatesCheckboxClass">
                                        </div>
                                        <div class="innerBlockLeft">
                                            would like a change in psych meds.
                                        </div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft">
                                            <input id="clientStatesThatNotInterestedMedsId" type="checkbox" class="clientStatesCheckboxClass">
                                        </div>
                                        <div class="innerBlockLeft">
                                            is not interested in psych meds now.
                                        </div>
                                    </div>
                                </div>
                                <div class="outterBlock" style="height: 115px;">
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft shiftRight">Comments:</div>
                                    </div>
                                    <div class="outterInnerBlock">
                                        <div class="innerBlockLeft shiftRight">
                                            <textarea id="clientStatesThatTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=clientStatesThat%></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft">
                                        <div id="medicationRefillsId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                    </div>
                                    <div class="innerBlockLeft header">
                                        <span id="medicationRefillsSpanId">MEDICATION REFILLS:</span>
                                    </div>
                                </div>
                            </div>
                            <div id="medicationRefillsExpandId" class="outterBlock content" style="height: 115px;">
                                <div class="outterInnerBlock shiftRight">
                                    <div class="innerBlockLeft">
                                        <span>Medication refills</span>
                                    </div>
                                    <div class="innerBlockLeft">
                                        <input id="medicationRefillsButtonId" type="button" value="were"/>
                                    </div>
                                    <div class="innerBlockLeft">
                                        <span>discussed and reviewed. It appears that</span>
                                    </div>
                                </div>
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <input class="medicationRefillsRadio" type="radio" name="medicationRefillsGroup" value="0"/>client is taking meds as prescribed.
                                    </div>
                                </div>
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <input class="medicationRefillsRadio" type="radio" name="medicationRefillsGroup" value="1"/>client is NOT taking meds as prescribed.
                                    </div>
                                </div>
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <input id="medRefillsNotDiscussedId" class="medicationRefillsRadio" type="radio" name="medicationRefillsGroup" value="2"/>med refills were not discussed because:
                                    </div>
                                </div>
                                <div id="medRefillsNotDiscussedExpandId" class="outterInnerBlock">
                                    <div class="innerBlockLeft shiftRight">
                                        <input id="medicationRefillsTextId" type="text" size="80" value="<%=medicationRefills%>"/>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="outterBlock" style=" padding-top: 5px;">
                                <div class="innerBlockLeft header">
                                    <span>EDUCATION/HOMEWORK:</span>
                                </div>
                            </div>
                            <div id="educationExpandId" class="outterBlock content" style="height: 200px;">
                                <div class="outterInnerBlock shiftRight" style="height: 90px;">
                                    <div class="innerBlockLeft">
                                        <textarea id="educationTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=nb.getBlockSubSection("EDUCATION:", "", 0, "Client has been educated on how to reach case manager between", 0).trim()%></textarea>
                                    </div>
                                </div>
                                <div class="outterInnerBlock" style="height: 40px;">
                                    <div id="educationDivId" class="innerBlockLeft shiftRight" style="width: 500px;">Client has been educated on how to reach case manager between appointments and knows the phone number for Telecare: (1-800-455-0067).</div>
                                </div>
                                <div class="outterInnerBlock shiftRight" style="height: 60px; padding-top: 2px;">
                                        <span style=""><u>Homework Completion:</u></span><br>
                                        The veteran completed   <select id="veteranCompletedSelectId">
                                                                    <option value="N/A" selected>N/A</option>
                                                                    <option value="none (0%)">none (0%)</option>
                                                                    <option value="some (25%)">some (25%)</option>
                                                                    <option value="about half (50%)">about half (50%)</option>
                                                                    <option value="most (75%)">most (75%)</option>
                                                                    <option value="all or nearly all (100%)">all or nearly all (100%)</option>
                                                                </select> of the homework assigned. <br>
                                        Veteran appeared to be  <select id="veteranAppearedSelectId">
                                                                    <option value="N/A" selected>N/A</option>
                                                                    <option value="minimally">minimally</option>
                                                                    <option value="somewhat">somewhat</option>
                                                                    <option value="moderately">moderately</option>
                                                                    <option value="highly">highly</option>
                                                                </select> engaged in working on his/her homework assignment.
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr class="shadeBackground">
                        <td>
                            <div class="outterBlock">
                                <div class="outterInnerBlock">
                                    <div class="innerBlockLeft">
                                        <div id="tobaccoScreenId" class="noteTextAreaToggleClass"><img src="images/ButtonImages/oneRightArrow.png" alt="Expansion Button"/></div>
                                    </div>
                                    <div class="innerBlockLeft header">
                                        <span id="tobaccoScreenSpanId">TOBACCO SCREEN:</span>
                                    </div>
                                </div>
                            </div>
                            <div id="tobaccoScreenExpandId" class="outterBlock content" style="height: 130px;">
                                <div class="outterInnerBlock shiftRight">
                                    <div class="innerBlockLeft">
                                        Tobacco screen/counseling <input id="tobaccoScreenCompletedButtonId" type="button" value="has"/> been completed.
                                    </div>
                                </div>
                                <div class="outterInnerBlock shiftRight">
                                    <div class="innerBlockLeft">
                                        <textarea id="tobaccoScreenTextId" rows="5" cols="80" class="noteTextAreaFocusClass"><%=nb.getBlockSubSection("TOBACCO SCREEN:", "been completed.", 0, "[*]", 0).trim()%></textarea>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
<!--            </div>-->
            <div class="outterBlock" style="height: 30px;">
                <div class="innerBlockLeft">
                    <input class="saveDraftButtonClass noteButtonClass" type="button" value="Save Note Draft"/>
                </div>
                <div class="innerBlockLeft" style="float: right;">
                    <input class="noteSaveButtonClass" type="button" value="Save Note in CPRS"/>
                </div>
            </div>
        </div>
        <div id="notePopups">
            <div id="therapyModeDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="symptomFunctioningDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="goalTrackingMeasuresDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="customGoalTrackingMeasuresDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
            <div id="sideEffectsDialogId" style="padding: 5px; margin: 0px; overflow: hidden;"></div>
        </div>
    </body>
</html>