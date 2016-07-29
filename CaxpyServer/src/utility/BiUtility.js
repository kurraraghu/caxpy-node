/// <reference path="../db/DBUtils.ts" />
/// <reference path="../db/LocalDB.ts" />
/// <reference path="../model/CaxpyReport.ts" />
"use strict";
var DBUtils_1 = require("../db/DBUtils");
var LocalDB_1 = require("../db/LocalDB");
var CaxpyReport_1 = require("../model/CaxpyReport");
var Promise = require('promise');
/**
 * This utility class will be responsible for executing all our queries.
 */
var BiUtility = (function () {
    function BiUtility() {
    }
    BiUtility.prototype.BiUtility = function () { };
    /**
     * Gets the response.
     *
     * @param query the query
     * @param db the db
     * @return the response
     */
    BiUtility.getResponse = function (query, connectionName) {
        var $this = this;
        return new Promise(function (resolve, reject) {
            LocalDB_1.LocalDB.getConnectionInformation(connectionName)
                .then(function (con) {
                DBUtils_1.DBUtils.executeQuery(query, con)
                    .then(function (response) {
                    resolve(response);
                }, function (error) {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    };
    /**
     * Get all the report from the report location.
     *
     * @return table names in the form of array
     */
    BiUtility.getReports = function () {
        return LocalDB_1.LocalDB.getReports();
    };
    /**
     * Valid format is 1111-ProgmarXYZ.
     *
     * @param report_name the report_name
     * @return true, if is valid report name
     */
    BiUtility.isValidReportName = function (reportName) {
        if (reportName.indexOf("-") > -1 && this.isLong(reportName.split("-")[0])) {
            return true;
        }
        return false;
    };
    /**
     * Check if the number is a long.
     *
     * @param longval the longval
     * @return true, if is long
     */
    BiUtility.isLong = function (longval) {
        try {
            return !isNaN(parseInt(longval));
        }
        catch (ex) {
        }
        return false;
    };
    /**
     * Save report.
     *
     * @param report the report
     * @param groupid
     * @return the string
     */
    BiUtility.saveReport = function (reportObject, groupid) {
        var report_name = null;
        var newReport = false;
        var report_id = new Date().getTime();
        report_name = reportObject.report_name;
        if (!this.isValidReportName(report_name)) {
            newReport = true;
            //TODO escapeHtml if required
            report_name = report_id + "-" + report_name;
            //rename the report with new value
            reportObject.report_name = report_name;
            reportObject.report_id = report_id;
        }
        else {
            //its an old report
            report_id = reportObject.report_id;
        }
        var rep = new CaxpyReport_1.CaxpyReport();
        rep.reportid = report_id;
        rep.reportjson = reportObject;
        rep.setReportname(report_name);
        rep.groupid = groupid;
        if (newReport) {
            LocalDB_1.LocalDB.insertReport(rep);
        }
        else {
            LocalDB_1.LocalDB.updateReport(rep);
        }
        return report_name;
    };
    /**
     * Gets the report id.
     *
     * @param reportname the reportname
     * @return the report id
     */
    BiUtility.getReportId = function (reportname) {
        if (this.isLong(reportname)) {
            return parseInt(reportname);
        }
        return parseInt(reportname.split("-")[0]);
    };
    /**
     * Get file data by reading it from the file.
     *
     * @param reportid the reportid
     * @return null if the file doesnt exist else the file contents
     */
    BiUtility.getReport = function (reportid) {
        return LocalDB_1.LocalDB.getReportJson(this.getReportId(reportid), null);
    };
    /** The errormsg. */
    BiUtility.errormsg = "";
    return BiUtility;
}());
exports.BiUtility = BiUtility;
//# sourceMappingURL=BiUtility.js.map