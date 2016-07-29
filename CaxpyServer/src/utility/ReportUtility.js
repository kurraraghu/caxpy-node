/// <reference path="../db/LocalDB.ts" />
/// <reference path="BiUtility.ts" />
'use strict';
var LocalDB_1 = require("../db/LocalDB");
var BiUtility_1 = require("../utility/BiUtility");
var CaxpyConstants_1 = require("../CaxpyConstants");
var Promise = require('promise');
var ReportUtility = (function () {
    function ReportUtility() {
    }
    ReportUtility.getReportJson = function (reportid, params) {
        return LocalDB_1.LocalDB.getReportJson(reportid, params);
    };
    /**
     * Get the data refreshed from the database
     *
     * @param params
     * @param reportJson
     * @return
     * @throws JSONException
     */
    ReportUtility.refreshJsonData = function (reportObject, params) {
        var $this = this;
        return new Promise(function (resolve, reject) {
            if (reportObject.connectionType) {
                var connectionType = reportObject.connectionType;
                if (connectionType.toLowerCase() === CaxpyConstants_1.CaxpyConstants.CSV) {
                    resolve(reportObject);
                }
                else if (connectionType == "null" || connectionType.toLowerCase() === CaxpyConstants_1.CaxpyConstants.SQL) {
                    if (params == null) {
                        if (reportObject.query_params) {
                            params = reportObject.query_params;
                        }
                    }
                    $this.refreshJsonDataUsingParams(reportObject, params)
                        .then(function (response) {
                        resolve(response);
                    }, function (err) {
                        reject(err);
                    });
                }
            }
            else {
                if (params == null) {
                    if (reportObject.query_params) {
                        params = reportObject.query_params;
                    }
                }
                $this.refreshJsonDataUsingParams(reportObject, params)
                    .then(function (response) {
                    resolve(response);
                }, function (err) {
                    reject(err);
                });
            }
        });
    };
    /**
     * Get the data refreshed from the database
     *
     * @param params
     * @param reportJson
     * @return
     * @throws JSONException
     */
    ReportUtility.refreshJsonDataUsingParams = function (reportObject, params) {
        var $this = this;
        return new Promise(function (resolve, reject) {
            if (reportObject != null) {
                var myquery = reportObject.query;
                if (params != null) {
                    for (var i = 0; i < params.length; i++) {
                        var obj = params[i];
                        myquery = myquery.replace("<" + obj.name + ">", obj.value);
                    }
                }
                //execute the query
                return BiUtility_1.BiUtility.getResponse(myquery, reportObject.connection)
                    .then(function (chartData) {
                    reportObject.chartData = chartData;
                    resolve(reportObject);
                }, function (error) {
                    resolve(reportObject);
                });
            }
            else {
                reject("reportObject is not valid");
            }
        });
    };
    return ReportUtility;
}());
exports.ReportUtility = ReportUtility;
//# sourceMappingURL=ReportUtility.js.map