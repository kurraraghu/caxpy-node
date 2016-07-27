/// <reference path="../db/DBUtils.ts" />
/// <reference path="../db/LocalDB.ts" />
/// <reference path="../model/CaxpyReport.ts" />

import {DBUtils} from "../db/DBUtils";
import {LocalDB} from "../db/LocalDB";
import {CaxpyReport} from "../model/CaxpyReport";

var Promise = require('promise');
/**
 * This utility class will be responsible for executing all our queries.
 */
export class BiUtility {

    private BiUtility() { }

    /** The errormsg. */
    public static errormsg: string = "";

	/**
	 * Gets the response.
	 *
	 * @param query the query
	 * @param db the db
	 * @return the response
	 */
    public static getResponse(query: string, db: string): any {
        var $this = this;
        return new Promise(function (resolve, reject) {
            DBUtils.getDBConnection(db)
                .execute(query, function (error, response) {
                    if (error) reject(error);
                    resolve(response);
                });
        });
    }


    /**
	 * Get all the report from the report location.
	 *
	 * @return table names in the form of array
	 */
    public static getReports(): any {
        return LocalDB.getReports();
    }


	/**
	 * Valid format is 1111-ProgmarXYZ.
	 *
	 * @param report_name the report_name
	 * @return true, if is valid report name
	 */
    public static isValidReportName(reportName: string): boolean {
        if (reportName.indexOf("-") > -1 && this.isLong(reportName.split("-")[0])) {
            return true;
        }
        return false;
    }

	/**
	 * Check if the number is a long.
	 *
	 * @param longval the longval
	 * @return true, if is long
	 */
    public static isLong(longval: string): boolean {
        try {
            return !isNaN(parseInt(longval));
        } catch (ex) {
        }
        return false;
    }

	/**
	 * Save report.
	 *
	 * @param report the report
	 * @param groupid 
	 * @return the string
	 */
    public static saveReport(reportObject: any, groupid: number): string {
        var report_name: string = null;
        var newReport: boolean = false;
        var report_id: number = new Date().getTime();
        report_name = reportObject.report_name;
        if (!this.isValidReportName(report_name)) {
            newReport = true;
            //TODO escapeHtml if required
            report_name = report_id + "-" + report_name;
            //rename the report with new value
            reportObject.report_name = report_name;
            reportObject.report_id = report_id;
        } else {
            //its an old report
            report_id = reportObject.report_id;
        }
        var rep = new CaxpyReport();
        rep.reportid = report_id;
        rep.reportjson = reportObject;
        rep.setReportname(report_name);
        rep.groupid = groupid;
        if (newReport) {
            LocalDB.insertReport(rep);  
        } else {
            LocalDB.updateReport(rep);
        }
        return report_name;
    }

	/**
	 * Gets the report id.
	 *
	 * @param reportname the reportname
	 * @return the report id
	 */
    public static getReportId(reportname: string): number {
        if (this.isLong(reportname)) {
            return parseInt(reportname);
        }
        return parseInt(reportname.split("-")[0]);
    }

	/**
	 * Get file data by reading it from the file.
	 *
	 * @param reportid the reportid
	 * @return null if the file doesnt exist else the file contents
	 */
    public static getReport(reportid: string): any {
        return LocalDB.getReportJson(this.getReportId(reportid), null);
    }

}
