<%--
    Document   : shutdown
    Created on : Apr 8, 2010, 3:37:37 PM
    Author     : vhapalchambj
--%>
<%@page import = "javax.servlet.http.*"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<%
    response.setHeader("Cache-control", "no-store");
    response.setHeader("Pragma", "no-cache");
    response.setDateHeader("Expires", -1);
    session.invalidate();
%>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="pragma" content="no-cache">
        <meta http-equiv="expires" content="-1">
        <meta http-equiv="cache-control" content="no-cache">
        <title>Shutdown Page</title>
        <script type="text/javascript" language="JavaScript1.2">
            var clientWindowLockSize = true;
            var clientWindowLockPosition = true;
            var clientWindowWidth = 560;
            var clientWindowHeight = 80;

            function right(e)
            {
                if (navigator.appName == 'Netscape' && (e.which == 3 || e.which == 2))
                    return false;
                else if (navigator.appName == 'Microsoft Internet Explorer' && (event.button == 2 || event.button == 3))
                {
                    alert("Sorry, you do not have permission to right click.");
                    return false;
                }
                return true;
            }

            document.onmousedown=right;
            document.onmouseup=right;
            window.onmousedown=right;
            window.onmouseup=right;
            if (document.layers) window.captureEvents(Event.MOUSEDOWN);
            if (document.layers) window.captureEvents(Event.MOUSEUP);
        </script>
    </head>
    <body>
        <h3>Thank you for closing your session!</h3>
    </body>
</html>
