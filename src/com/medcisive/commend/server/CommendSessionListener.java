package com.medcisive.commend.server;

import com.medcisive.utility.UtilityFramework;
import java.io.InputStream;
import javax.servlet.http.*;

/**
 *
 * @author vhapalchambj
 */
public class CommendSessionListener implements HttpSessionListener {

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        System.out.println("Session Created");
        String testingProperty = CommendContextListener._properties.getProperty("TESTING");
        boolean testing = Boolean.valueOf(testingProperty).booleanValue();        
        String siteProperty = CommendContextListener._properties.getProperty("SITE_ENABLED");
        boolean site = Boolean.valueOf(siteProperty).booleanValue();
        String dbServer = CommendContextListener._properties.getProperty("DATABASE_SERVER");
        String dbPort = CommendContextListener._properties.getProperty("DATABASE_PORT");
        String db = CommendContextListener._properties.getProperty("DATABASE");
        CommendDatabaseController dbc = new CommendDatabaseController();
        dbc.logEvent(null, null, null, null, null, "Database controller setup: Server-" + dbServer + " Port-" + dbPort + " DB-" + db, "1000");
        HttpSession session = se.getSession();
        session.setAttribute("isTestingEnabled", testing);
        session.setAttribute("isSiteEnabled", site);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        System.out.println("Shutting down session");
    }
}