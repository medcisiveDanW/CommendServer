<input id="removePHIId" type="button" style="margin-top: -7px;" value="Hide PHI"/>
<div class="patientInformationBackground ui-widget-content">
    <table>
        <tr>
            <td class="ui-state-default">
                Today's Date
            </td>
            <td>
                <%=manager.todayStr%>
            </td>
        </tr>
        <tr>
            <td class="ui-state-default">
                DOB
            </td>
            <td>
                <span class="ui-phi"><%=manager.getCurrentPatient().dateOfBirth%></span>
            </td>
        </tr>
        <tr>
            <td class="ui-state-default">
                Last Visit
            </td>
            <td>
                <span class="ui-phi"><%=manager.getCurrentPatient().getLastAppointment() %></span>
            </td>
        </tr>
        <tr>
            <td class="ui-state-default">
                Age
            </td>
            <td>
                <span class="ui-phi"><%=manager.getCurrentPatient().ageInYears%></span>
            </td>
        </tr>
        <tr>
            <td class="ui-state-default">
                Last Therapy Mode
            </td>
            <td>
                <span class="ui-phi"><%=manager.getCurrentPatient().getLastTherapyMode() %></span>
            </td>
        </tr>
    </table>
</div>
<div class="patientInformationBackground ui-widget-content" style="height: 360px; overflow-x: hidden; overflow-y: scroll; ">
    <%
        boolean hashOutcomes = false;
        for(com.medcisive.commend.server.PatientSummary ps : manager.getCurrentPatient().patientSummary) {
            if(ps.getType().equalsIgnoreCase("O")){
                hashOutcomes = true;
            }
        }
        if(hashOutcomes) {
    %>
    <table>
        <thead>
            <tr class="ui-state-default">
                <th>
                    Outcomes
                </th>
                <th>
                    Last
                </th>
                <th>
                    Baseline
                </th>
            </tr>
        </thead>
        <tbody>
            <%  for(com.medcisive.commend.server.PatientSummary ps : manager.getCurrentPatient().patientSummary) {
                    if(ps.getType().equalsIgnoreCase("O")){
            %>
            <tr>
                <td class="Outcome">
                    <%=ps.getDetails()%>
                </td>
                <td class="Last" align="center">
                    <%=ps.getLastValue()%>
                    <span class="ui-phi"><br><%=ps.getLastDate()%></span>
                </td>
                <td class="Baseline" align="center">
                    <%=ps.getFirstValue()%>
                    <span class="ui-phi"><br><%=ps.getFirstDate()%></span>
                </td>
            </tr>
            <%
                    }
                }
            %>
        </tbody>
    </table>
    <%
        }
        for(com.medcisive.commend.server.PatientSummary ps : manager.getCurrentPatient().patientSummary) {
            if(ps.getType().equalsIgnoreCase("S")){
    %>
    <table>
        <thead>
            <tr class="ui-state-default">
                <th>
                    Side Effects
                </th>
                <th>
                    Last
                </th>
                <th>
                    Baseline
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="Outcome" style="width: 120px;">
                    <%=manager.getCurrentPatient().getSideEffectsString()%>
                </td>
                <td class="Last" align="center">
                    <%=ps.getLastValue()%>
                    <span class="ui-phi"><br><%=ps.getLastDate()%></span>
                </td>
                <td class="Baseline" align="center">
                    <%=ps.getFirstValue()%>
                    <span class="ui-phi"><br><%=ps.getFirstDate()%></span>
                </td>
            </tr>
        </tbody>
    </table>
    <%
            }
        }
    %>
</div>