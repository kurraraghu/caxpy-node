/// <reference path="../../Scripts/typings/lokijs/lokijs.d.ts" />

"use strict";

import * as Loki from "lokijs";
import {CaxpyConnection} from "../model/CaxpyConnection";
import {CaxpyReport} from "../model/CaxpyReport";
import {Group} from "../model/Group";
import {ReportUtility} from "../utility/ReportUtility";

import {CaxpyConstants} from "../CaxpyConstants";
var Promise = require('promise');

 
class DBCollections {
    public static REPORTS: string = "reports";
    public static MAILSETTINGS: string = "mailsettings";
    public static CONNECTIONS: string = "connections";
    public static FILES: string = "files";
    public static GROUPS: string = "groups";
}


export class LocalDB {

    /** The connection pool. */
    private static _db: Loki;
    public static DBName: string = "caxpy.db";

	/**
	 * use a single connection pool.
	 *
	 * @return the connection pool
	 */
    public static initDB(): void {
        this._db = new Loki(this.DBName, {
            autosave: true,
            autosaveInterval: 1000, // 1 second
            env: 'NODEJS',
            autoload: true
        });

        if (!this._getReportCollection()) {
            this._db.addCollection(DBCollections.REPORTS, {
                unique: ["reportid"]
            });
        }
        if (!this._getConnectionCollection()) {
            this._db.addCollection(DBCollections.CONNECTIONS);
        }

        if (!this._getGroupCollection()) {
            this._db.addCollection(DBCollections.GROUPS, {
                unique: ["id"]
            });
        }
        if (!this._getMailSettingCollection()) {
            this._db.addCollection(DBCollections.MAILSETTINGS);
        }
        if (!this._getFileCollection()) {
            this._db.addCollection(DBCollections.FILES);
        }
    }


    private static _getMailSettingCollection(): LokiCollection<any> {
        return this._db.getCollection<any>(DBCollections.MAILSETTINGS)
    }
	/**
	 * Gets the mail settings.
	 *
	 * @return the mail settings
	 */
    public static getMailSettings(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var mailsettingsColl = $that._getMailSettingCollection();
            if (!mailsettingsColl) {
                reject("No mailsettings");
            } else {
                resolve(mailsettingsColl.data);
            }
        });
    }

    private static _getReportCollection(): LokiCollection<CaxpyReport> {
        return this._db.getCollection<CaxpyReport>(DBCollections.REPORTS)
    } 
     
    /**
	 * Get all the report from the report location.
	 *
	 * @return table names in the form of array
	 */
    public static getReports(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var reportColl = $that._getReportCollection();
                if (!reportColl) {
                    reject("No Reports");
                } else {
                    resolve(reportColl.data);
                }
            }catch (err){
                reject(err);
            }
        });
    }


	/**
	 * Gets the report json.
	 *
	 * @param reportid the reportid
	 * @param params  the params
	 * @return the report json
	 */
    public static getReportJson(reportid: number, params: Array<any>): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var report = $that._db.getCollection<CaxpyReport>(DBCollections.REPORTS).findOne({ reportid: reportid });
                if (report) {
                    ReportUtility.refreshJsonData(report, params)
                        .then(function (response) {
                            resolve(response);
                        }, function (err) {
                            reject(err);
                        });
                } else {
                    reject("No report with reportid : " + reportid);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

	/**
	 * Save the entered connection information.
	 *
	 * @param rep the rep
	 */
    public static insertReport(report: CaxpyReport): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                report = $that._db.getCollection<CaxpyReport>(DBCollections.REPORTS).add(report);
                if (report) {
                    resolve(report);
                } else {
                    reject("Failed to insert Report");
                }
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
	 * Save the entered connection information.
	 *
	 * @param rep the rep
	 */
    public static updateReport(report: CaxpyReport): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                report = $that._db.getCollection<CaxpyReport>(DBCollections.REPORTS).update(report);
                if (report) {
                    resolve(report);
                } else {
                    reject("Failed to update Report");
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Save the entered connection information.
     *
     * @param rep
     *            the rep
     */
    public static updateReportName(reportname: string, groupid: number, reportid: number): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var reportCollection = $that._db.getCollection<CaxpyReport>(DBCollections.REPORTS);
                var editReport = reportCollection.findOne({ reportid: reportid });
                if (editReport) {
                    editReport.groupid = groupid;
                    editReport.reportname = reportname;
                    resolve(reportCollection.update(editReport));
                } else {
                    reject("No report with reportid : " + reportid);
                }
            } catch (err) {
                reject(err);
            }
 
        });

    }

	/**
	 * Delete report.
	 *
	 * @param reportid
	 *            the reportid
	 */
    public static deleteReport(reportid: number): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                $that._db.getCollection<CaxpyReport>(DBCollections.REPORTS).removeWhere({ reportid: reportid });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }




    private static _getConnectionCollection(): LokiCollection<CaxpyConnection> {
        return this._db.getCollection<CaxpyConnection>(DBCollections.CONNECTIONS)
    } 

	/**
	 * Return the list of all available connections from the database.
	 *db, dbname, host, port, username, password
	 * @return the connections
	 */
    public static getConnections(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var connColl = $that._getConnectionCollection();
                if (!connColl) {
                    reject("No Connections.");
                } else {
                    resolve(connColl.data);
                }
            } catch (err) {
                reject(err);
            }
        });
    }



	/**
	 * Get connection information.
	 *
	 * @param connectionName
	 *            the connection name
	 * @return the connection information
	 */
    public static getConnectionInformation(connectionname: string): any {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                var connection = $that._getConnectionCollection().findOne({ db: split[0], dbname: split[1]});
                resolve(connection);
            } catch (err) {
                reject(err);
            }
        });
    }


	/**
	 * Save the entered connection information.
	 * @param c the connection
	 */
    public static insertConnection(connection: CaxpyConnection): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var con = $that._getConnectionCollection().add(connection);
            if (!con) {
                reject("failed to insert");
            } else {
                resolve(con);
            }
        });
    }



	/**
	 * Update connection.
	 *
	 * @param oldConnection
	 *            the old connection
	 * @param c
	 *            the c
	 * @return true, if successful
	 */
    public static updateConnection(connectionname: string, con: CaxpyConnection): any {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                var upCon = $that._getConnectionCollection().update(con);
                resolve(upCon);
            } catch (err) {
                reject(err);
            }
        });
    }

	/**
	 * Delete the connection from database the connectionname is a combination
	 * of db and db name, for example - mysql-foodmart.
	 *
	 * @param connectionname
	 *            the connectionname
	 * @return true, if successful
	 */
    public static deleteConnection(connectionname: string): any {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                $that._getConnectionCollection().removeWhere({ db: split[0], dbname: split[1] });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }



    private static _getFileCollection(): LokiCollection<any> {
        return this._db.getCollection<any>(DBCollections.FILES);
    }
    /**
	 * Get file information.
	 *id,filename,datajson
	 * @return the all data files
	 */
    public static getAllDataFiles(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var fileColl = $that._getFileCollection();
                if (!fileColl) {
                    reject("No files.");
                } else {
                    resolve(fileColl.data);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Get file information.
     *
     * @param fileid
     *            the fileid
     * @return the file information
     */
    public static getFileInformation(fileid: number): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var file = $that._getFileCollection().findOne({ id: fileid });
            if (!file) {
                reject("No file with fileid: " + fileid);
            } else {
                resolve(file);
            }
        });
    }


	/**
	 * Save file and return generated id.
	 *
	 * @param filename
	 *            the filename
	 * @param datajson
	 *            the datajson
	 * @return the int
	 */
    public static saveFileInformation(file): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var file = $that._getFileCollection().add(file);
            if (!file) {
                reject("failed to insert");
            } else {
                resolve(file);
            }
        });
    }
    

	/**
	 * Delete file information.
	 *
	 * @param fileid
	 *            the fileid
	 * @return the int
	 */
    public static deleteFileInformation(fileid: number): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                $that._getFileCollection().removeWhere({ id: fileid });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
	 * Gets the all databases.
	 *
	 * @return the all databases
	 */
    public static getAllDatabases(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            Promise.all([$that.getAllDataFiles(), $that.getConnections()]).then(res => {
                var databases = {};
                databases[CaxpyConstants.CSV] = res[0];//sqls
                databases[CaxpyConstants.SQL] = res[1];//files
                resolve(databases);
            });
        });
    }


    private static _getGroupCollection(): LokiCollection<Group> {
        return this._db.getCollection<Group>(DBCollections.GROUPS);
    }
	/**
	 * Gets the all report groups.
	 *id, groupname, groupdesc
	 * @return the all report groups
	 */
    public static getAllGroups(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var groupColl = $that._getGroupCollection();
            if (!groupColl) {
                reject("No Groups");
            } else {
                resolve(groupColl.data);
            }
        });
    }


    //crud for group
	/**
	 * Insert group.
	 *id,groupname,groupdesc
	 * @param gp the gp
	 */
    public static insertGroup(gp: Group): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
           var group= $that._getGroupCollection().add(gp);
           if (!group) {
               reject("Faield to insert Group");
           } else {
               resolve(group);
           }
        });
    }

	/**
	 * Update group.
	 *
	 * @param gp the gp
	 */
    public static updateGroup(gp: Group): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var group = $that._getGroupCollection().update(gp);
            if (!group) {
                reject("Faield to update Group");
            } else {
                resolve(group);
            }
        });
    }

	/**
	 * Delete group.
	 *
	 * @param gpid the gpid
	 */
    public static deleteGroup(groupId: number): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
           $that._getGroupCollection().removeWhere({ id: groupId});
           resolve(true);
           $that.deleteReportGroupMapping(groupId);
        });
    }

    public static deleteReportGroupMapping(groupId: number): void {
        var $that = this;
        $that._getReportCollection().findAndUpdate(function (report): boolean {
            return report.groupid === groupId;
        }, function (report): CaxpyReport {
            report.groupid = 0;
            return report;
        });
    }

}
