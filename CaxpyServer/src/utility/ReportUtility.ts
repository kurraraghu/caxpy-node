/// <reference path="../db/LocalDB.ts" />
/// <reference path="BiUtility.ts" />

'use strict';
 
import {LocalDB} from "../db/LocalDB";
import {BiUtility} from "../utility/BiUtility";
import {CaxpyConstants} from "../CaxpyConstants";
var Promise = require('promise');

export class ReportUtility {
	
    public static getReportJson(reportid: number, params: Array<any>):any {
        return LocalDB.getReportJson(reportid, params);
	}

	
	/**
	 * Get the data refreshed from the database
	 * 
	 * @param params
	 * @param reportJson
	 * @return
	 * @throws JSONException
	 */
    public static refreshJsonData(reportObject: any, params: Array<any>): any {
        var $this = this;
        return new Promise(function (resolve, reject) {
            if (reportObject.connectionType) {
                var connectionType: string = reportObject.connectionType;
                if (connectionType.toLowerCase() === CaxpyConstants.CSV) {
                    resolve(reportObject);
                } else if (connectionType == "null" || connectionType.toLowerCase() === CaxpyConstants.SQL) {

                }
            }
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
        });

    }

    /**
	 * Get the data refreshed from the database
	 * 
	 * @param params
	 * @param reportJson
	 * @return
	 * @throws JSONException
	 */
    public static refreshJsonDataUsingParams(reportObject: any, params: Array<any>): any {
        var $this = this;
        return new Promise(function (resolve, reject) {
            if (reportObject != null) {
                var myquery: string = reportObject.query;
                if (params != null) {
                    for (var i = 0; i < params.length; i++) {
                        var obj = params[i];
                        myquery = myquery.replace("<" + obj.name + ">", obj.value);
                    }
                }
                //execute the query
                return BiUtility.getResponse(myquery, reportObject.connection)
                    .then(function (chartData) {
                        reportObject.chartData = chartData;
                        resolve(reportObject); 
                    }, function (error) {
                        reject(error);
                    });

            } else {
                reject("reportObject is not valid");
            }
        });
    }
 
}
