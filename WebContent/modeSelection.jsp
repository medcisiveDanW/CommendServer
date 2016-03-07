<%--
    Document   : ModeSelection
    Created on : Jan 20, 2011, 9:43:19 AM
    Author     : vhapalchambj
--%>

<style type="text/css">
#modeSelectionBodyDiv {
    width: 100%;
    height: 330px;
    padding: 0px;
    margin: 0px;
    position: relative;
    top: 0px;
    left: 0px;
    overflow-y: scroll;
    overflow-x: hidden;
}
#modeSelectionAcordDiv {
    display: block;
    margin: 0px;
    padding: 0px;
    padding-left: 15px;
    padding-right: 3px;
}
.modeSelectionLeafDiv {
    position: relative;
    top: 0px;
    right: 0px;
    margin-top: 2px;
    margin-bottom: 2px;
    background-color: #A0A2FF;
    border-style: solid;
    border-color: black;
    border-width: 1px;
    clear: both;
    width: 99%;
    height: 25px;
}
.modeSelectionLeafDiv a {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 1.0em;
    font-weight: bold;
    text-decoration: none;
    color: white !important;
    padding-left: 10px;
}
</style>
<div id="modeSelectionBodyDiv">
    <div style="position: relative; top: 0px; right: 0px;">
        <a style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 1.3em; font-weight: bold;">Therapy Mode Selection</a>
    </div>
    <div id="therapyModeCareManagementId">
        <h3><a href="#">Care Management</a></h3>
        <div id="modeSelectionAcordDiv">
            <div class="modeSelectionLeafDiv"><a>Treatment Planning</a></div>
            <div class="modeSelectionLeafDiv"><a>Supportive Therapy</a></div>
            <div class="modeSelectionLeafDiv"><a>Crisis Intervention</a></div>
        </div>
    </div>
    <div class="modeSelectionLeafDiv"><a>Psychopharmacology</a></div>
    <div class="modeSelectionLeafDiv"><a>Motivational Interviewing</a></div>
    <div id="therapyModeCognitiveBehavorialTherapyId">
        <h3><a href="#">Cognitive Behavioral Therapy</a></h3>
        <div id="modeSelectionAcordDiv">
            <div class="modeSelectionLeafDiv"><a>CBT (Generic)</a></div>
            <div class="modeSelectionLeafDiv"><a>CBT (Depression)</a></div>
            <div class="modeSelectionLeafDiv"><a>CBT (Anxiety)</a></div>
            <div class="modeSelectionLeafDiv"><a>CBT (Insomnia)</a></div>
            <div class="modeSelectionLeafDiv"><a>CBT (Other)</a><input type="text" class="modeSelectionOtherInput" style="height: 14px; margin-top: 2px;"/></div>
        </div>
    </div>
    <div class="modeSelectionLeafDiv"><a>Acceptance Commitment Therapy</a></div>
    <div id="therapyModeTraumaFocusedId">
        <h3><a href="#">Trauma-Focused</a></h3>
        <div id="modeSelectionAcordDiv">
            <div class="modeSelectionLeafDiv"><a>Prolonged Exposure</a></div>
            <div class="modeSelectionLeafDiv"><a>Cognitive Processing Therapy</a></div>
            <div class="modeSelectionLeafDiv"><a>EMDR</a></div>
            <div class="modeSelectionLeafDiv"><a>Trauma-focused (Other)</a><input type="text" class="modeSelectionOtherInput" style="height: 14px; margin-top: 2px;"/></div>
        </div>
    </div>
    <div id="therapyModeProblemSpecificId">
        <h3><a href="#">Problem Specific</a></h3>
        <div id="modeSelectionAcordDiv">
            <div class="modeSelectionLeafDiv"><a>Anger</a></div>
            <div class="modeSelectionLeafDiv"><a>Pain</a></div>
            <div class="modeSelectionLeafDiv"><a>Stress Inoculation</a></div>
            <div class="modeSelectionLeafDiv"><a>Behavioral Activation</a></div>
            <div class="modeSelectionLeafDiv"><a>Smoking Cessation</a></div>
            <div class="modeSelectionLeafDiv"><a>Problem Specific (Other)</a><input type="text" class="modeSelectionOtherInput" style="height: 14px; width: 150px; margin-top: 2px;"/></div>
        </div>
    </div>
    <div id="therapyModeOtherTherapiesId">
        <h3><a href="#">Other Therapies</a></h3>
        <div id="modeSelectionAcordDiv">
            <div class="modeSelectionLeafDiv"><a>DBT</a></div>
            <div class="modeSelectionLeafDiv"><a>Seeking Safety</a></div>
            <div class="modeSelectionLeafDiv"><a>Social Skills Training</a></div>
            <div class="modeSelectionLeafDiv"><a>Adjunctive Services</a></div>
            <div class="modeSelectionLeafDiv"><a>CAM</a></div>
            <div class="modeSelectionLeafDiv"><a>Other Therapies (Other)</a><input type="text" class="modeSelectionOtherInput" style="height: 14px; margin-top: 2px;"/></div>
        </div>
    </div>
</div>
