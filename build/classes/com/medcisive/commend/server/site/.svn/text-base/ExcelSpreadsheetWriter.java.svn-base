package com.medcisive.commend.server.site;

import com.google.gson.Gson;
import com.medcisive.commend.server.CommendWebappManager;
import com.medcisive.commend.server.reports.CPTServlet;
import com.medcisive.utility.sql2.SQLTable;
import java.io.IOException;
import java.util.Calendar;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.swing.GroupLayout;
import jxl.CellView;
import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

/**
 *
 * @author vhapalchambj
 */
public class ExcelSpreadsheetWriter {

    private static final java.text.SimpleDateFormat _shortMonthDateFormater = new java.text.SimpleDateFormat("MMM");
    private static final java.text.SimpleDateFormat _dateFormater = new java.text.SimpleDateFormat("MMMM dd, yyyy");
    private static final java.text.SimpleDateFormat _savedFileDateFormater = new java.text.SimpleDateFormat("yyyy-MM-dd");
    private static final java.util.ArrayList<java.sql.Timestamp> _rollingMonthStart = new java.util.ArrayList();
    private static final java.util.ArrayList<java.sql.Timestamp> _rollingQuarterStart = new java.util.ArrayList();
    private static final int _numberOfMonthsToProcess = 25;
    private static final int _numberOfQuartersToProcess = 5; // 4 quarters need 5 date points so _numberOfQuartersToProcess = numbOfQuarters + 1
    private static java.util.Map<Integer, String> quarterNames = new java.util.HashMap();
    private static WritableCellFormat cellFormat;
    private final CommendWebappManager _manager;
    private final CommendSiteDatabaseController _dbc;
    private String wgIdString;
    private String wgNameString;
    private int wgId;

    static {
            int year = Calendar.getInstance().get(Calendar.YEAR);
            int month = Calendar.getInstance().get(Calendar.MONTH);
            int quarter = month / 3 + 1;
            Calendar c = Calendar.getInstance();
            c.set(year, month, 1, 0, 0, 0);
            for (int i = 0; i < _numberOfMonthsToProcess; i++) {
                _rollingMonthStart.add(new java.sql.Timestamp(c.getTimeInMillis()));
                c.roll(Calendar.MONTH, -1);
                if (c.get(Calendar.MONTH) == Calendar.DECEMBER) {
                    c.set(Calendar.YEAR, c.get(Calendar.YEAR) - 1);
                }
            }
            c.set(year, month, 1, 0, 0, 0);
            switch (quarter) {
                case 1:
                    c.set(Calendar.MONTH, Calendar.JANUARY);
                    break;
                case 2:
                    c.set(Calendar.MONTH, Calendar.APRIL);
                    break;
                case 3:
                    c.set(Calendar.MONTH, Calendar.JULY);
                    break;
                case 4:
                    c.set(Calendar.MONTH, Calendar.OCTOBER);
                    break;
                default:
                    break;
            }
            for (int i = 0; i < _numberOfQuartersToProcess; i++) {
                _rollingQuarterStart.add(new java.sql.Timestamp(c.getTimeInMillis()));
                c.roll(Calendar.MONTH, -3);
                if (c.get(Calendar.MONTH) == Calendar.OCTOBER) {
                    c.set(Calendar.YEAR, c.get(Calendar.YEAR) - 1);
                }
            }
            
            for (int i = 0; i < 4; i++) {                
                java.sql.Timestamp start = _rollingQuarterStart.get(i + 1);
                java.sql.Timestamp end = _rollingQuarterStart.get(i);
                end = new java.sql.Timestamp(end.getTime() - 60000);
                c.setTimeInMillis(start.getTime());
                year = c.get(Calendar.YEAR);
                String startStr = _shortMonthDateFormater.format(start).toString();
                String endStr = _shortMonthDateFormater.format(end).toString();
                String quarterString = "" + startStr + "-" + endStr + " " + year;
                quarterNames.put(i, quarterString);
            }
    }

    public ExcelSpreadsheetWriter(CommendWebappManager manager) {
        _manager = manager;
        _dbc = new CommendSiteDatabaseController(_manager.providerSta3n);
        try {
            WritableFont cellFont = new WritableFont(WritableFont.TIMES,14);
            cellFont.setColour(Colour.WHITE);
            cellFormat = new WritableCellFormat(cellFont);
            cellFormat.setBackground(Colour.DARK_BLUE);
            cellFormat.setAlignment(Alignment.CENTRE);
            cellFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
            cellFormat.setWrap(true);
        } catch (WriteException ex) {
            Logger.getLogger(ExcelSpreadsheetWriter.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public synchronized void writeProductivitySpreadsheet(HttpServletRequest request, HttpServletResponse response) throws IOException, WriteException {
        WritableWorkbook workbook = _createWrokbook("Productivity",request,response);

        _createProductivitySheet(wgNameString, "Year",              0, 2, _getEncountersStatistics(0, 2), workbook);
        _createProductivitySheet(wgNameString, quarterNames.get(0), 1, 1, _getEncountersStatistics(0, 1), workbook);
        _createProductivitySheet(wgNameString, quarterNames.get(1), 2, 1, _getEncountersStatistics(1, 1), workbook);
        _createProductivitySheet(wgNameString, quarterNames.get(2), 3, 1, _getEncountersStatistics(2, 1), workbook);
        _createProductivitySheet(wgNameString, quarterNames.get(3), 4, 1, _getEncountersStatistics(3, 1), workbook);
        _createProductivitySheet(wgNameString, "Last Month",        5, 0, _getEncountersStatistics(0, 0), workbook);

        workbook.write();
        workbook.close();
    }
    
    public synchronized void writeEncountersSpreadsheet(HttpServletRequest request, HttpServletResponse response) throws IOException, WriteException {
        WritableWorkbook workbook = _createWrokbook("Encounters",request,response);

        _createEncountersSheet(wgNameString, "Year",              0, 2, _getEncountersStatistics(0, 2), workbook);
        _createEncountersSheet(wgNameString, quarterNames.get(0), 1, 1, _getEncountersStatistics(0, 1), workbook);
        _createEncountersSheet(wgNameString, quarterNames.get(1), 2, 1, _getEncountersStatistics(1, 1), workbook);
        _createEncountersSheet(wgNameString, quarterNames.get(2), 3, 1, _getEncountersStatistics(2, 1), workbook);
        _createEncountersSheet(wgNameString, quarterNames.get(3), 4, 1, _getEncountersStatistics(3, 1), workbook);
        _createEncountersSheet(wgNameString, "Last Month",        5, 0, _getEncountersStatistics(0, 0), workbook);

        workbook.write();
        workbook.close();
    }

    public synchronized void writeCPTSpreadsheet(HttpServletRequest request, HttpServletResponse response) throws IOException, WriteException {
        WritableWorkbook workbook = _createWrokbook("CPT",request,response);

        _createCPTSheet(wgNameString, "Year",              0, 2, _getCPTPatterns(0, 2), workbook);
        _createCPTSheet(wgNameString, quarterNames.get(0), 1, 1, _getCPTPatterns(0, 1), workbook);
        _createCPTSheet(wgNameString, quarterNames.get(1), 2, 1, _getCPTPatterns(1, 1), workbook);
        _createCPTSheet(wgNameString, quarterNames.get(2), 3, 1, _getCPTPatterns(2, 1), workbook);
        _createCPTSheet(wgNameString, quarterNames.get(3), 4, 1, _getCPTPatterns(3, 1), workbook);
        _createCPTSheet(wgNameString, "Last Month",        5, 0, _getCPTPatterns(0, 0), workbook);

        workbook.write();
        workbook.close();
    }
    
    private void _createProductivitySheet(String wgName, String tabName, int pageNumber, int temporalCatId, java.util.Map<String, Object> data, WritableWorkbook workbook) throws WriteException {
        WritableSheet sheet = workbook.createSheet(tabName, pageNumber);
        _sizeSheet(15,sheet);
        String start = (String) data.get("start");
        String end = (String) data.get("end");
        java.util.Map total = null;
        SQLTable table = (SQLTable) data.get("data");
        
        sheet.addCell(new Label(0, 0, "Work Group", cellFormat));
        sheet.addCell(new Label(0, 1, wgName));
        sheet.addCell(new Label(0, 2, "Start Date", cellFormat));
        sheet.addCell(new Label(0, 3, start));
        sheet.addCell(new Label(0, 4, "End Date", cellFormat));
        sheet.addCell(new Label(0, 5, end));
        
        int shiftDown = 7;
        sheet.addCell(new Label(0, shiftDown, "Provider", cellFormat));
        sheet.addCell(new Label(1, shiftDown, "Role", cellFormat));
        sheet.addCell(new Label(2, shiftDown, "Total wRVU", cellFormat));
        sheet.addCell(new Label(3, shiftDown, "%Time", cellFormat));
        sheet.addCell(new Label(4, shiftDown, "Productivity", cellFormat));
        sheet.addCell(new Label(5, shiftDown, "Target", cellFormat));
        sheet.addCell(new Label(6, shiftDown, "%Target", cellFormat));
        sheet.addCell(new Label(7, shiftDown, "Unique Indiv. Pts.", cellFormat));
        sheet.addCell(new Label(8, shiftDown, "Total Encs.", cellFormat));
        shiftDown++;
        for (int i : table.keySet()) {
            java.util.Map map = table.getRow(i);
            String Name = (String) map.get("name");
            if (Name.equalsIgnoreCase("Total")) {
                total = map;
                shiftDown--;
            } else {
                String Role = (String) map.get("Role");
                double FTE = (Double) map.get("FTE");
                String prod, target_wRVU = null;
                double prodTarget = 0;
                double target_wRVUDouble = -1;
                double rawProd;
                double wRVUTot = (Double) map.get("wRVUTot");
                double wRVUFilter = (Double) map.get("wRVUFilter");
                double error = wRVUTot / wRVUFilter;
                int PatTot = ((Double)map.get("PatTot")).intValue();
                int EncTot = ((Double)map.get("EncTot")).intValue();
                if (FTE > 0) {
                    prod = "" + wRVUFilter / FTE;
                    rawProd = wRVUTot / FTE;
                } else {
                    prod = "" + wRVUFilter;
                    rawProd = wRVUTot;
                }
                if (error > 10) {
                    error = 10;
                }
                if (_getRoleTargetValue(Role, temporalCatId) != null) {
                    target_wRVU = _getRoleTargetValue(Role, temporalCatId);
                }
                if (!prod.equalsIgnoreCase("--") && target_wRVU != null && !target_wRVU.equalsIgnoreCase("--")) {
                    target_wRVUDouble = Double.parseDouble(target_wRVU);
                    prodTarget = _round(((rawProd / target_wRVUDouble) * 100.f));
                }
                sheet.addCell(new  Label(0, i + shiftDown, Name));
                sheet.addCell(new  Label(1, i + shiftDown, Role));
                sheet.addCell(new Number(2, i + shiftDown, _round(wRVUTot)));
                sheet.addCell(new Number(3, i + shiftDown, _round(FTE * 100.f)));
                sheet.addCell(new Number(4, i + shiftDown, _round(rawProd)));
                if(target_wRVUDouble>0){
                    sheet.addCell(new Number(5, i + shiftDown, _round(target_wRVUDouble)));
                }else{
                    sheet.addCell(new  Label(5, i + shiftDown, target_wRVU));
                }
                sheet.addCell(new Number(6, i + shiftDown, prodTarget));
                sheet.addCell(new Number(7, i + shiftDown, PatTot));
                sheet.addCell(new Number(8, i + shiftDown, EncTot));
            }
        }
    }

    private void _createEncountersSheet(String wgName, String tabName, int pageNumber, int temporalCatId, java.util.Map<String, Object> data, WritableWorkbook workbook) throws WriteException {
        WritableSheet sheet = workbook.createSheet(tabName, pageNumber);
        _sizeSheet(11,sheet);
        String start = (String) data.get("start");
        String end = (String) data.get("end");
        java.util.Map total = null;
        SQLTable table = (SQLTable) data.get("data");
        
        sheet.addCell(new Label(0, 0, "Work Group", cellFormat));
        sheet.addCell(new Label(0, 1, wgName));
        sheet.addCell(new Label(0, 2, "Start Date", cellFormat));
        sheet.addCell(new Label(0, 3, start));
        sheet.addCell(new Label(0, 4, "End Date", cellFormat));
        sheet.addCell(new Label(0, 5, end));
        
        int shiftDown = 7;
        sheet.mergeCells(0, shiftDown, 0, shiftDown+1);
        sheet.addCell(new Label(0, shiftDown, "Provider", cellFormat));
        
        sheet.mergeCells(1, shiftDown, 2, shiftDown);
        sheet.addCell(new Label(1, shiftDown, "Individual", cellFormat));
        sheet.addCell(new Label(1, shiftDown+1, "U", cellFormat));
        sheet.addCell(new Label(2, shiftDown+1, "E", cellFormat));
        
        sheet.mergeCells(3, shiftDown, 4, shiftDown);
        sheet.addCell(new Label(3, shiftDown, "Group", cellFormat));
        sheet.addCell(new Label(3, shiftDown+1, "U", cellFormat));
        sheet.addCell(new Label(4, shiftDown+1, "E", cellFormat));
        
        sheet.mergeCells(5, shiftDown, 6, shiftDown);
        sheet.addCell(new Label(5, shiftDown, "Telephone", cellFormat));
        sheet.addCell(new Label(5, shiftDown+1, "U", cellFormat));
        sheet.addCell(new Label(6, shiftDown+1, "E", cellFormat));
        
        sheet.mergeCells(7, shiftDown, 8, shiftDown);
        sheet.addCell(new Label(7, shiftDown, "Other", cellFormat));
        sheet.addCell(new Label(7, shiftDown+1, "U", cellFormat));
        sheet.addCell(new Label(8, shiftDown+1, "E", cellFormat));
        
        sheet.mergeCells(9, shiftDown, 10, shiftDown);
        sheet.addCell(new Label(9, shiftDown, "Total", cellFormat));
        sheet.addCell(new Label(9, shiftDown+1, "U", cellFormat));
        sheet.addCell(new Label(10, shiftDown+1, "E", cellFormat));
        shiftDown++;
        for (int i : table.keySet()) {
            java.util.Map map = table.getRow(i);
            String Name = (String) map.get("name");
            shiftDown++;
            if (Name.equalsIgnoreCase("Total")) {
                total = map;
                shiftDown--;
            } else {
                int PatInd = ((Double)map.get("PatInd")).intValue();
                int EncInd = ((Double)map.get("EncInd")).intValue();
                int PatGro = ((Double)map.get("PatGro")).intValue();
                int EncGro = ((Double)map.get("EncGro")).intValue();
                int PatTel = ((Double)map.get("PatTel")).intValue();
                int EncTel = ((Double)map.get("EncTel")).intValue();
                int PatOth = ((Double)map.get("PatOth")).intValue();
                int EncOth = ((Double)map.get("EncOth")).intValue();
                int PatTot = ((Double)map.get("PatTot")).intValue();
                int EncTot = ((Double)map.get("EncTot")).intValue();
                sheet.addCell(new  Label(0, shiftDown, Name));
                sheet.addCell(new Number(1, shiftDown, PatInd));
                sheet.addCell(new Number(2, shiftDown, EncInd));
                sheet.addCell(new Number(3, shiftDown, PatGro));
                sheet.addCell(new Number(4, shiftDown, EncGro));
                sheet.addCell(new Number(5, shiftDown, PatTel));
                sheet.addCell(new Number(6, shiftDown, EncTel));
                sheet.addCell(new Number(7, shiftDown, PatOth));
                sheet.addCell(new Number(8, shiftDown, EncOth));
                sheet.addCell(new Number(9, shiftDown, PatTot));
                sheet.addCell(new Number(10, shiftDown, EncTot));
            }
        }
        shiftDown++;
        int PatInd = ((Double)total.get("PatInd")).intValue();
        int EncInd = ((Double)total.get("EncInd")).intValue();
        int PatGro = ((Double)total.get("PatGro")).intValue();
        int EncGro = ((Double)total.get("EncGro")).intValue();
        int PatTel = ((Double)total.get("PatTel")).intValue();
        int EncTel = ((Double)total.get("EncTel")).intValue();
        int PatOth = ((Double)total.get("PatOth")).intValue();
        int EncOth = ((Double)total.get("EncOth")).intValue();
        int PatTot = ((Double)total.get("PatTot")).intValue();
        int EncTot = ((Double)total.get("EncTot")).intValue();
        sheet.addCell(new  Label(0, shiftDown, "Total", cellFormat));
        sheet.addCell(new Number(1, shiftDown, PatInd, cellFormat));
        sheet.addCell(new Number(2, shiftDown, EncInd, cellFormat));
        sheet.addCell(new Number(3, shiftDown, PatGro, cellFormat));
        sheet.addCell(new Number(4, shiftDown, EncGro, cellFormat));
        sheet.addCell(new Number(5, shiftDown, PatTel, cellFormat));
        sheet.addCell(new Number(6, shiftDown, EncTel, cellFormat));
        sheet.addCell(new Number(7, shiftDown, PatOth, cellFormat));
        sheet.addCell(new Number(8, shiftDown, EncOth, cellFormat));
        sheet.addCell(new Number(9, shiftDown, PatTot, cellFormat));
        sheet.addCell(new Number(10,shiftDown, EncTot, cellFormat));
    }

    private void _createCPTSheet(String wgName, String tabName, int pageNumber, int temporalCatId, java.util.Map<String, Object> data, WritableWorkbook workbook) throws WriteException {
        WritableSheet sheet = workbook.createSheet(tabName, pageNumber);
        _sizeSheet(14,sheet);
        String start = (String) data.get("start");
        String end = (String) data.get("end");
        java.util.Map total = null;
        SQLTable table = (SQLTable) data.get("data");
        
        sheet.addCell(new Label(0, 0, "Work Group", cellFormat));
        sheet.addCell(new Label(0, 1, wgName));
        sheet.addCell(new Label(0, 2, "Start Date", cellFormat));
        sheet.addCell(new Label(0, 3, start));
        sheet.addCell(new Label(0, 4, "End Date", cellFormat));
        sheet.addCell(new Label(0, 5, end));
        
        int shiftDown = 7;
        sheet.addCell(new Label(0, shiftDown, "Provider", cellFormat));
        sheet.addCell(new Label(1, shiftDown, "Total Encounters", cellFormat));
        sheet.addCell(new Label(2, shiftDown, "Too Many E&M", cellFormat));
        sheet.addCell(new Label(3, shiftDown, "Prescribing", cellFormat));
        sheet.addCell(new Label(4, shiftDown, "Intake", cellFormat));
        sheet.addCell(new Label(5, shiftDown, "Addon With E&M", cellFormat));
        sheet.addCell(new Label(6, shiftDown, "Addon Only", cellFormat));
        sheet.addCell(new Label(7, shiftDown, "Crisis", cellFormat));
        sheet.addCell(new Label(8, shiftDown, "High Complexity", cellFormat));
        sheet.addCell(new Label(9, shiftDown, "Medium Complexity", cellFormat));
        sheet.addCell(new Label(10, shiftDown, "Low Complexity", cellFormat));
        sheet.addCell(new Label(11, shiftDown, "Group Therapy", cellFormat));
        sheet.addCell(new Label(12, shiftDown, "Prolonged Service", cellFormat));
        sheet.addCell(new Label(13, shiftDown, "Interactive Complexity", cellFormat));
        
        shiftDown++;
        
        for (int i : table.keySet()) {
            java.util.Map map = table.getRow(i);
            String Name = (String) map.get("name");
            if (Name.equalsIgnoreCase("Total")) {
                total = map;
                shiftDown--;
            } else {
                int EncTot = ((Double)map.get("EncTot")).intValue();
                int TooManyEM = ((Double)map.get("TooManyEM")).intValue();
                int Prescribing = ((Double)map.get("Prescribing")).intValue();
                int Intake = ((Double)map.get("Intake")).intValue();
                int AddOnWithEM = ((Double)map.get("AddOnWithEM")).intValue();
                int AddOnOnly = ((Double)map.get("AddOnOnly")).intValue();
                int Crisis = ((Double)map.get("Crisis")).intValue();
                int HighComplexity = ((Double)map.get("HighComplexity")).intValue();
                int MediumComplexity = ((Double)map.get("MediumComplexity")).intValue();
                int LowComplexity = ((Double)map.get("LowComplexity")).intValue();
                int GroupTherapy = ((Double)map.get("GroupTherapy")).intValue();
                int ProlongedService = ((Double)map.get("ProlongedService")).intValue();
                int InteractiveComplexity = ((Double)map.get("InteractiveComplexity")).intValue();
                sheet.addCell(new  Label(0, i + shiftDown, Name));
                sheet.addCell(new Number(1, i + shiftDown, EncTot));
                sheet.addCell(new Number(2, i + shiftDown, TooManyEM));
                sheet.addCell(new Number(3, i + shiftDown, Prescribing));
                sheet.addCell(new Number(4, i + shiftDown, Intake));
                sheet.addCell(new Number(5, i + shiftDown, AddOnWithEM));
                sheet.addCell(new Number(6, i + shiftDown, AddOnOnly));
                sheet.addCell(new Number(7, i + shiftDown, Crisis));
                sheet.addCell(new Number(8, i + shiftDown, HighComplexity));
                sheet.addCell(new Number(9, i + shiftDown, MediumComplexity));
                sheet.addCell(new Number(10, i + shiftDown, LowComplexity));
                sheet.addCell(new Number(11, i + shiftDown, GroupTherapy));
                sheet.addCell(new Number(12, i + shiftDown, ProlongedService));
                sheet.addCell(new Number(13, i + shiftDown, InteractiveComplexity));
            }
        }
    }

    private java.util.Map<String, Object> _getEncountersStatistics(int temporalOffset, int temporalCatId) {
        java.sql.Timestamp start = _rollingMonthStart.get(temporalOffset + 1);
        java.sql.Timestamp end = _rollingMonthStart.get(temporalOffset);
        if (temporalCatId == 1) {
            start = _rollingQuarterStart.get(temporalOffset + 1);
            end = _rollingQuarterStart.get(temporalOffset);
        } else if (temporalCatId == 2) {
            start = _rollingQuarterStart.get(temporalOffset + 4);
            end = _rollingQuarterStart.get(temporalOffset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.put("start", _dateFormater.format(start).toString());
        result.put("end", _dateFormater.format(end).toString());
        if (wgId != -1) {
            result.put("data", _dbc.getEncounterStatistics("" + wgId, "" + temporalOffset, "" + temporalCatId));
        }
        return result;
    }
    
    private java.util.Map<String, Object> _getCPTPatterns(int temporalOffset, int temporalCatId) {
        java.sql.Timestamp start = _rollingMonthStart.get(temporalOffset + 1);
        java.sql.Timestamp end = _rollingMonthStart.get(temporalOffset);
        if (temporalCatId == 1) {
            start = _rollingQuarterStart.get(temporalOffset + 1);
            end = _rollingQuarterStart.get(temporalOffset);
        } else if (temporalCatId == 2) {
            start = _rollingQuarterStart.get(temporalOffset + 4);
            end = _rollingQuarterStart.get(temporalOffset);
        }
        end = new java.sql.Timestamp(end.getTime() - 60000);
        java.util.Map<String, Object> result = new java.util.HashMap();
        result.put("start", _dateFormater.format(start).toString());
        result.put("end", _dateFormater.format(end).toString());
        if (wgId != -1) {
            CPTServlet cpts = new CPTServlet();
            result.put("data", cpts.getCPTPatterns(wgId, temporalCatId, temporalOffset));
        }
        return result;
    }

    private WritableWorkbook _createWrokbook(String name, HttpServletRequest request, HttpServletResponse response) throws IOException{
        wgIdString = (String) request.getParameter("wgId");
        wgNameString = (String) request.getParameter("wgName");
        wgId = Integer.parseInt(wgIdString);
        java.sql.Timestamp ts = new java.sql.Timestamp(System.currentTimeMillis());
        String filename = name + " " + wgNameString + " " + _savedFileDateFormater.format(ts) + ".xls";
        response.setContentType("application/ms-excel");
        response.setHeader("Content-Disposition", "attachment; filename=" + filename);
        return Workbook.createWorkbook(response.getOutputStream());
    }
    
    private void _sizeSheet(int size, WritableSheet sheet){
        sheet.setColumnView(0,30);
        for(int i = 1; i < 20; i++){
            sheet.setColumnView(i,size);
        }
    }
   
    private String _getRoleTargetValue(String role, int temporalShift) {
        java.util.Map<String, String[]> map = new java.util.HashMap();
        String[] a = {"215", "644", "2574"};
        String[] b = {"161", "482", "1926"};
        String[] c = {"100", "299", "1194"};
        String[] d = {"164", "494", "1977"};
        String[] e = {"--", "--", "--"};
        map.put("PSYCHIATRIST", a);
        map.put("PSYCHOLOGIST", b);
        map.put("SOCIALWORKER", c);
        map.put("CNS", d);
        map.put("RNP", d);
        map.put("RN", e);
        map.put("AT", e);
        map.put("RT", e);
        map.put("PSYCHTECH", e);
        if (map.get(role) != null && temporalShift > -1 && temporalShift < 3) {
            return map.get(role)[temporalShift];
        }
        return "--";
    }
    
    private double _round(double unrounded){
        return new java.math.BigDecimal(unrounded).setScale(2, java.math.RoundingMode.HALF_UP).doubleValue();
    }
}
