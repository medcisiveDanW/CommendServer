<%--
    Document   : siteAnalysis
    Created on : Jan 26, 2012, 2:41:09 PM
    Author     : vhapalchambj
--%>

<%@ page contentType="text/html" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>Site Analysis</title>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="expires" content="-1"/>
        <meta http-equiv="cache-control" content="no-cache"/>
        <link type="text/css" href="css/providerSite.css" rel="stylesheet" />
        <link type="text/css" href="css/newBlue/jquery-ui-1.8.11.custom.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_page.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table.css" rel="stylesheet" />
        <link type="text/css" href="css/demo_table_jui.css" rel="stylesheet" />
        <script type="text/javascript" src="javascript/root/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery-ui-1.8.11.custom.min.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.wresize.js"></script>
        <script type="text/javascript" src="javascript/root/jquery.dataTables.min.js"></script>
        <script type="text/javascript" src="javascript/root/dataTables.dateSort.js"></script>
        <script type="text/javascript" src="javascript/root/AjaxManager.js"></script>
        <script type="text/javascript" src="javascript/root/flot/excanvas.js"></script>
        <script type="text/javascript" src="javascript/root/flot/jquery.flot.js"></script>
        <script type="text/javascript" src="javascript/root/flot/jquery.flot.navigate.js"></script>
        <script type="text/javascript" src="javascript/root/flot/jquery.flot.symbol.js"></script>
        <script type="text/javascript" src="javascript/root/flot/jquery.flot.resize.js"></script>
        <script type="text/javascript" src="javascript/root/date.format.js"></script>
        <script type="text/javascript" src="javascript/ptsdtherapy/PTSDManager.js"></script>
        <script type="text/javascript" src="javascript/ptsdtherapy/PTSDPatient.js"></script>
        <script type="text/javascript" src="javascript/ptsdtherapy/PTSDGraph.js"></script>
        <script type="text/javascript" src="javascript/ptsdtherapy/SiteAnalysisManager.js"></script>
        <script type="text/javascript" src="javascript/ptsdtherapy/PatientPanel.js"></script>
        <style type="text/css">
            body{
                margin: 0px;
                padding: 0px;
            }
        </style>
        <script type="text/javascript">
            var clientWindowLockSize = false;
            var clientWindowLockPosition = false;
            var clientWindowWidth = 1200;
            var clientWindowHeight = 820;
            $(function() {
                var panel = new PatientPanel('siteAnalysisDivId');
            });
        </script>
    </head>
    <body class="ui-widget-content">
        <div id="siteAnalysisDivId" style="width: 100%; height: 600px; overflow-y: auto; position: relative; top: 0px; left: 0px;"></div>
    </body>
</html>