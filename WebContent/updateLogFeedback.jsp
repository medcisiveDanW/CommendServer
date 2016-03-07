<%-- 
    Document   : updateLogFeedback
    Created on : Jun 20, 2011, 2:21:52 PM
    Author     : vhapalchambj
--%>

<%@ page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="com.medcisive.commend.server.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%
    CommendWebappManager manager = (CommendWebappManager) session.getAttribute("CommendWebappManager");
    java.sql.Timestamp eventtime = new java.sql.Timestamp(System.currentTimeMillis());
    String patientSSN = (String)request.getParameter("SSN");
    String providerDUZ = (String)request.getParameter("DUZ");
    String text = (String)request.getParameter("text");
    String type = (String)request.getParameter("type");

    if( (eventtime!=null) && (patientSSN!=null) && (providerDUZ!=null) && (text!=null) && (type!=null)) {
        manager.logFeedback(eventtime, patientSSN, providerDUZ, text, type);
    }
%>