
<style type="text/css">
.dataEntryTable { width: 100%;  float: none; }
.CBCell { width: 5%; align: right; }
.QCell { width: 45%; align: left; }

div.column {
    width: 49%;
    float: left;
    height:200px;
    border: .2em solid #001C9B;
}
td {align: top }
#tooltip {
    position: absolute;
    z-index: 2;
    background: #A3E7FF;
    border: 1px solid #c98;
    padding: 1px;
}
td.prompt { width: 200px; text-align: center; vertical-align: top; border: 1px solid #001C9B;}
td.question { vertical-align: top; border: 1px solid #001C9B;}
td.sectionTitle { font-style: italic; font-size: 1em; text-decoration: underline; }
table.dataEntry {
    border: solid #001C9B;
    background-color: #A3E7FF;
    height: 70px;
}
.behaviorContainer {
    height: 300px;
    overflow-y: auto;
}
.behaviorDetails {
    display:none;
    height: 100px;
    margin-top: 1%;
}
</style>

<!--script type="text/javascript" src="../javascript/goalTrackingMeasuresPopup.js"></script-->
<!--hidden value to save form value -->
<div style="width: 100%;height: 100%;overflow: hidden;">
    <div style="display:inline-block; width: 100%;">
        <div class="column">
            <table>
              <tr>
                <td class="CBcell">&nbsp;</td>
                <td class="QCell, sectionTitle">Behaviors</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="activityCheckboxId" name="goalTrackingMeasuresCheckbox" value="activity" type="checkbox"/></td>
                  <td class="QCell">Activity Level</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="recreationCheckboxId" name="goalTrackingMeasuresCheckbox" value="recreation" type="checkbox"/></td>
                  <td class="QCell">Recreation</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="socializingCheckboxId" name="goalTrackingMeasuresCheckbox" value="socializing" type="checkbox"/></td>
                  <td class="QCell">Socializing</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="practicingCheckboxId" name="goalTrackingMeasuresCheckbox" value="practicing" type="checkbox"/></td>
                  <td class="QCell">Practicing skills</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="sleepCheckboxId" name="goalTrackingMeasuresCheckbox" value="sleep" type="checkbox"/></td>
                  <td class="QCell">Sleep Hygiene</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="nutritionCheckboxId" name="goalTrackingMeasuresCheckbox" value="nutrition" type="checkbox"/></td>
                  <td class="QCell">Nutrition</td>
              </tr>
              <tr>
                  <td class="CBcell"><input id="exerciseCheckboxId" name="goalTrackingMeasuresCheckbox" value="exercise" type="checkbox"/></td>
                  <td class="QCell">Exercise</td>
              </tr>
            </table>
        </div>
        <div class="column">
            <table>
                <tr>
                    <td class="CBcell">&nbsp;</td>
                    <td class="QCell, sectionTitle">Symptoms</td>
                </tr>
                <tr>
                    <td class="CBcell"><input id="depressionCheckboxId" name="goalTrackingMeasuresCheckbox" value="depression" type="checkbox"/></td>
                    <td class="QCell">Depression</td>
                </tr>
                <tr>
                    <td class="CBcell"><input id="anxietyCheckboxId" name="goalTrackingMeasuresCheckbox" value="anxiety" type="checkbox"/></td>
                    <td class="QCell">Anxiety</td>
                </tr>
                <tr>
                    <td class="CBcell"><input id="insomniaCheckboxId" name="goalTrackingMeasuresCheckbox" value="insomnia" type="checkbox"/></td>
                    <td class="QCell">Insomnia</td>
                </tr>
                <tr>
                    <td class="CBcell"><input id="angerCheckboxId" name="goalTrackingMeasuresCheckbox" value="anger" type="checkbox"/></td>
                    <td class="QCell">Anger/Irritability</td>
                </tr>
                <tr>
                    <td class="CBcell"><input id="fatigueCheckboxId" name="goalTrackingMeasuresCheckbox" value="fatigue" type="checkbox"/></td>
                    <td class="QCell">Fatigue</td>
                </tr>
            </table>
        </div>
    </div>
    <div class="behaviorContainer">
        <%
            java.util.LinkedHashMap<String, String> goalTrackingMeasuresHash = new java.util.LinkedHashMap();
            goalTrackingMeasuresHash.put("activityMeasureDiv", "Activity Level: How many days in the last week did you get out of the house for more than an hour or two?");
            goalTrackingMeasuresHash.put("recreationMeasureDiv", "Recreation: How many days in the last week did you do something just for fun for a couple of hours?");
            goalTrackingMeasuresHash.put("socializingMeasureDiv", "Socializing: How many days in the past week did you call or get together with friends or family?");
            goalTrackingMeasuresHash.put("practicingMeasureDiv", "Practicing skills: How many days in the last week did you do your \"homework\" or exercises you learned in therapy?");
            goalTrackingMeasuresHash.put("sleepMeasureDiv", "Sleep: How many days in the last week were you able to get a good night's sleep?");
            goalTrackingMeasuresHash.put("nutritionMeasureDiv", "Nutrition: How many days in the past week did you have a healthy meal?");
            goalTrackingMeasuresHash.put("exerciseMeasureDiv", "Exercise: How many days in the last week did you exercise for 20 minutes or more?");
            goalTrackingMeasuresHash.put("depressionMeasureDiv", "Depression: How many days in the past week were you so depressed that it bothered you or prevented you from getting things done?");
            goalTrackingMeasuresHash.put("anxietyMeasureDiv", "Anxiety: How many days in the past week did you feel anxiety to the point that it bothered you or prevented you from getting things done?");
            goalTrackingMeasuresHash.put("insomniaMeasureDiv", "Insomnia: How many days in the past week did you have insomnia to the point that it bothered you or prevented you from getting things done the next day?");
            goalTrackingMeasuresHash.put("angerMeasureDiv", "Anger/Irritability: How many days in the past week were you so angry or irritated that it bothered you or prevented you from getting things done?");
            goalTrackingMeasuresHash.put("fatigueMeasureDiv", "Fatigue: How many days in the past week did you feel so fatigued that it bothered you or prevented you from getting things done?");

            for(String key : goalTrackingMeasuresHash.keySet())
            {
        %>
        <div class="behaviorDetails" id="<%=key%>">
            <table class="dataEntry">
                <tr>
                    <td >&nbsp;</td>
                    <td align="left" colspan="8">
                    <%=goalTrackingMeasuresHash.get(key)%>
                    </td>
                    <td> &nbsp;</td>
                </tr>
                <tr>
                    <td >&nbsp;</td>
                    <% for(int i = 0; i < 8; i++) { %>
                    <td class="prompt">
                        <table>
                            <tr><td align="center"><input id="<%=key%>RadioButton<%=i%>Id" type="radio" name="<%=key%>RadioButton" class="<%=key%>RadioButton" value="<%=i%>"/></td></tr>
                            <tr><td align="center"><%=i%> days</td></tr>
                        </table>
                    </td>
                    <% } %>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </div>
        <%
            }
        %>
    </div>
</div>
