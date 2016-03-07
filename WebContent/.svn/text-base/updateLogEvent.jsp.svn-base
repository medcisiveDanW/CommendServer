<%-- 
    Document   : updateLogEvent
    Created on : May 4, 2011, 12:07:29 PM
    Author     : vhapalchambj
--%>
<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
    CommendWebappManager manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
    String event = (String)request.getParameter("event");
    String eventId = (String)request.getParameter("eventId");
    if( (event!=null) && (eventId!=null)) {
        manager.logMe(event, eventId);
    }
%>
