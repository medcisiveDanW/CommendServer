package com.medcisive.commend.server;

import com.medcisive.utility.UtilityFramework;
//import static com.medcisive.utility.UtilityFramework._properties;
//import static com.medcisive.utility.UtilityFramework.init2;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Web application lifecycle listener.
 * @author vhapalchambj
 */
public class CommendContextListener extends UtilityFramework implements ServletContextListener {

    private void setProperties(ServletContext sc) {
        String propertiesFile = sc.getInitParameter("PropertiesFile");
        synchronized(this){
            if(_properties==null) {
                init2(propertiesFile);
            }
        }
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("contextDestroyed");
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("contextInitialized started!");
        setProperties(sce.getServletContext());
    }
}
