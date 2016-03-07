<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
    String sid = (String)request.getParameter("sid");
    String name = (String)request.getParameter("name");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Provider Site Panel</title>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="expires" content="-1"/>
        <meta http-equiv="cache-control" content="no-cache"/>

        <link type="text/css" href="css/providerSite.css" rel="stylesheet" />
        <link type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_page.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table_jui.css" rel="stylesheet" />

        <link type="text/css" href="css/demo_page_dan.css" rel="stylesheet" />

        <script language="javascript" type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/dataTables.dateSort.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/jQueryCustomFunctions.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/RemoteInvocationController.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/jquery.wresize.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/flot/excanvas.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/flot/jquery.flot.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/flot/jquery.flot.navigate.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/flot/jquery.flot.symbol.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/flot/jquery.flot.resize.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/date.format.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ptsdtherapy/PTSDManager.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ptsdtherapy/PTSDPatient.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ptsdtherapy/PTSDGraph.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ptsdtherapy/PTSDPopupController.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/ptsdtherapy/PatientPanel.js"></script>
        <script language="javascript" type="text/javascript" src="javascript/root/Utility.js"></script>
        <script type="text/javascript">
            var clientWindowLockSize = false;
            var clientWindowLockPosition = false;
            var clientWindowWidth = 1200;
            var clientWindowHeight = 820;
            $(function() {
                var sid = '<%=sid%>';
                var patientManager = new PTSDManager(sid);
                patientManager.rpc.log('Provider Information Selected','1024');
                $('#tabs').tabs();
                $('#tabs').bind('tabsshow', function(event, ui) {
                    if (ui.panel.id == "tabPTSD") {
                        patientManager.rpc.log('Provider Timeline Selected','1026');
                        if(patientManager.isReady==false) {
                            $('.processingOverlay').show();
                            setTimeout(function() { patientManager.initDiv('ptsdTherapyGraphID'); }, 100);
                        }
                    }
                    if (ui.panel.id == "tabPTSDPanel") {
                        patientManager.rpc.log('Provider Pending Patients Selected','1025');
                    }
                });
                $('#backToAdmin').button().click(function() {
                    $('#adminPageId').submit();
                });
            });
        </script>
    </head>
    <form id="refreshPageId" action="providerSite.jsp"></form>
    <form id="adminPageId" action="administration.jsp"></form>
    <body>

        <table id="headerTableId" width="100%" border="0">
            <tr>
                <td>
                    <table class="ui-state-default" width="100%" border="0">
                        <tr>
                            <td width="33%">
                                <img align="left" src="images/VAlogo.gif" style="width: 50px; height: 50px;" alt="VAlogo"/>
                            </td>
                            <td width="34%" align="center">
                                <span class="titleProvider">
                                    <a id="providerNameId"><%=name%></a>
                                </span>
                            </td>
                            <td width="33%">
                                <img align="right" src="images/COMMENDlogo.gif" style="width: 215px; height: 50px;" alt="COMMENDlogo"/>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <div style="width: 1%; height: 500px; position:relative; float:left;"></div>
        <button id="backToAdmin" style="margin-bottom: 5px;">Back to Reports</button>
        <div style="width: 98%; position: relative; float:left;">
            <div id="processingOverlayId" class="processingOverlay">
                <div class="processingOverlayBottom"></div>
                <div class="processingOverlayTop">
                    <img src="images/loading.gif" alt=""/>
                    <span>Processing...</span>
                </div>
            </div>
            <div id="tabs">
                <ul>
                    <li><a href="#tabPTSDPanel">Pending Patients</a></li>
                    <li><a href="#tabPTSD">Timeline</a></li>
                </ul>
                <div id="tabPTSDPanel" style="margin: 0px; padding:5px;">
                    <div id="patientPanelDivId"></div>
                </div>
                <div id="tabPTSD" style="margin: 0px; padding:5px;">
                    <div id="ptsdTherapyGraphID"></div>
                </div>
            </div>
        </div>
    </body>
</html>