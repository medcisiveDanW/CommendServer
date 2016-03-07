<%--
    Document   : patientDetailHeader
    Created on : Jul 30, 2010, 1:19:25 PM
    Author     : vhapalchambj
--%>

<div class="patientDetailHeaderContainer ui-state-default">
    <div id="patientDetailLogoVA">
        <img align="left" src="../images/VAlogo.gif" alt="VAlogo" style="width: 50px; height: 50px;">
    </div>
    <div id="patientDetailHeaderTextContainer">
        <div id="patientDetailHeaderTitle">
            PTSD Treatment Monitoring
        </div>
        <div id="patientDetailHeaderName" class="patientDetailTextFormt">
            <span class="ui-phi"><%=manager.getCurrentPatient().patientName%></span>
        </div>
        <div id="patientDetailHeaderSSN" class="patientDetailTextFormt">
            <span class="ui-phi">SSN: <%=manager.getCurrentPatient().SSN%></span>
        </div>
    </div>
    <div id="patientDetailLogoCommend">
        <img align="right" src="../images/COMMENDlogo.gif" alt="COMMENDlogo" style="width: 215px; height: 50px;">
    </div>
    <div id="patientDetialHeaderProvider" class="patientDetailTextFormt">
        <span class="ui-phi">Provider: <%=manager.providerName%></span>
    </div>
</div>


