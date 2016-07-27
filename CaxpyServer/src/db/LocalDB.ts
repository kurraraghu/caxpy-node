
/// <reference path="../../Scripts/typings/lokijs/lokijs.d.ts" />
/// <reference path="../model/CaxpyConnection.ts" />
/// <reference path="../model/CaxpyReport.ts" />
/// <reference path="../model/Group.ts" />
/// <reference path="../utility/ReportUtility.ts" />
/// <reference path="../CaxpyConstants.ts" />
import {CaxpyReport} from "../model/CaxpyReport";
"use strict";

import * as Loki from "lokijs";
import {CaxpyConnection} from "../model/CaxpyConnection";
import {CaxpyReport} from "../model/CaxpyReport";
import {Group} from "../model/Group";
import {ReportUtility} from "../utility/ReportUtility";

import {CaxpyConstants} from "../CaxpyConstants";
var Promise = require('promise');


export class Map<T> {
    private items: { [key: string]: T };

    constructor() {
        this.items = {};
    }

    add(key: string, value: T): void {
        this.items[key] = value;
    }

    has(key: string): boolean {
        return key in this.items;
    }

    get(key: string): T {
        return this.items[key];
    }
}

export class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    size(): number {
        return this.items.length;
    }

    add(value: T): void {
        this.items.push(value);
    }

    get(index: number): T {
        return this.items[index];
    }
}


export class LocalDB {

    /** The connection pool. */
    private static dbConnection: any = null;
    public static DBName: string = "caxpy";

	/**
	 * use a single connection pool.
	 *
	 * @return the connection pool
	 */
    public static getConnection(): any {
        if (this.dbConnection == null) {
            try {
                this.dbConnection = new Loki(this.DBName, { autosave: false });
            } catch (ex) {

            }
        }
        return this.dbConnection;
    }

    /**
	 * Get all the report from the report location.
	 *
	 * @return table names in the form of array
	 */
    public static getReports(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try{
                var reports:LokiCollection<CaxpyReport>=$that.getConnection().getCollection<CaxpyReport>("reports");
                resolve(reports);
            }catch (err){
                if (err) reject(err);
            }
        });
    }


	/**
	 * Gets the report json.
	 *
	 * @param reportid
	 *            the reportid
	 * @param params
	 *            the params
	 * @return the report json
	 */
    public static getReportJson(reportid: number, params: Array<any>): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                var report = reports[reportid];
                if (report) {
                    resolve(ReportUtility.refreshJsonData(report, params));
                } else {
                    reject("No report with id: " + reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    }



	/**
	 * Save the entered connection information.
	 *
	 * @param rep
	 *            the rep
	 */
    public static insertReport(rep: CaxpyReport): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                if (!reports[rep.reportid]) {
                    reports[rep.reportid] = rep;
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err) reject(err); // likely the key was not found
                        resolve(rep);
                    });
                } else {
                    reject("already report exist with id: " + rep.reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    }


    /**
	 * Save the entered connection information.
	 *
	 * @param rep
	 *            the rep
	 */
    public static updateReport(rep: CaxpyReport): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                var report = reports[rep.reportid];
                if (report) {
                    reports[rep.reportid] = rep;
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err) reject(err); // likely the key was not found
                        resolve(rep);
                    });
                } else {
                    reject("reportid not exist id: " + rep.reportid);
                }
            }, function (err) {
                reject(err);
            });
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
            $that.getReports().then(function (reports) {
                var editReport = reports[reportid];
                if (editReport) {
                    editReport.groupid = groupid;
                    editReport.reportname = reportname;
                    reports[reportid] = editReport;
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err) reject(err); // likely the key was not found
                        resolve(editReport);
                    });
                } else {
                    reject("No report with reportid : " + reportid);
                }
            }, function (err) {
                reject(err);
            });
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
            $that.getReports().then(function (reports) {
                if (!reports[reportid]) {
                    delete reports[reportid];
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err) reject(err); // likely the key was not found
                        resolve(true);
                    });
                } else {
                    reject("report not exist with id: " + reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    }

	/**
	 * Gets the mail settings.
	 *
	 * @return the mail settings
	 */
    public static getMailSettings(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('mailsettings', function (err, mailsettings) {
                if (err) reject(err); // likely the key was not found
                resolve(mailsettings);
            });
        });
    }


	/**
	 * Return the list of all available connections from the database.
	 *db, dbname, host, port, username, password
	 * @return the connections
	 */
    public static getConnections(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('connections', function (err, connections) {
                if (err) reject(err); // likely the key was not found
                resolve(connections);
            });
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
            $that.getConnections().then(function (connections) {
                connections.forEach(function (item, index) {
                    if (item.db === split[0] && item.dbname === split[1]) {
                        resolve(connections[index]);
                    }
                });
            }, function (err) {
                reject(err);
            });
        });
    }



	/**
	 * Save the entered connection information.
	 *
	 * @param c
	 *            the c
	 * @return true, if successful
	 */
    public static insertConnection(c: CaxpyConnection): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('connections', function (err, connections) {
                if (err) reject(err);
                connections.push(c);
                $that.getConnection().put('connections', connections, function (err) {
                    if (err) reject(err);
                    resolve(c);
                });

            });
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
            $that.getConnections().then(function (connections) {
                connections.forEach(function (item, index) {
                    if (item.db === split[0] && item.dbname === split[1]) {
                        connections[index] = con;
                    }
                });
                $that.getConnection().put('connections', connections, function (err) {
                    if (err) reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getConnections().then(function (connections) {
                connections.forEach(function (item, index) {
                    if (item.db === split[0] && item.dbname === split[1]) {
                        connections.splice(index, 1);
                    }
                });
                $that.getConnection().put('connections', connections, function (err) {
                    if (err) reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
        });
    }



    /**
	 * Get file information.
	 *id,filename,datajson
	 * @return the all data files
	 */
    public static getAllDataFiles(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('files', function (err, files) {
                if (err) reject(err); // likely the key was not found
                resolve(files);
            });
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
                databases[CaxpyConstants.SQL] = res[0];//sqls
                databases[CaxpyConstants.CSV] = res[1];//files
                resolve(databases);
            });
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
            $that.getAllDataFiles().then(function (files) {
                resolve(files);
            }, function (err) {
                reject(err);
            });
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
            $that.getAllDataFiles().then(function (files) {
                files.push(file);
                $that.getConnection().put('files', files, function (err) {
                    if (err) reject(err);
                    resolve(file);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllDataFiles().then(function (files) {
                files.forEach(function (item, index) {
                    if (item.id === fileid) {
                        files.splice(index, 1);
                    }
                });
                $that.getConnection().put('files', files, function (err) {
                    if (err) reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
        });

    }




	/**
	 * Gets the all report groups.
	 *id, groupname, groupdesc
	 * @return the all report groups
	 */
    public static getAllGroups(): any {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('groups', function (err, groups) {
                if (err) reject(err); // likely the key was not found
                resolve(groups);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.push(gp);
                $that.getConnection().put('groups', groups, function (err) {
                    if (err) reject(err);
                    resolve(gp);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.forEach(function (item, index) {
                    if (item.id === gp.id) {
                        groups[index] = gp;
                    }
                });
                $that.getConnection().put('groups', groups, function (err) {
                    if (err) reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.forEach(function (item, index) {
                    if (item.id === groupId) {
                        groups.splice(index, 1);
                    }
                });
                $that.getConnection().put('groups', groups, function (err) {
                    if (err) reject(err);
                    resolve(true);
                    $that.deleteReportGroupMapping(groupId);
                });
            }, function (err) {
                reject(err);
            });
        });
    }

    public static deleteReportGroupMapping(groupId: number): void {
        var $that = this;
        $that.getReports().then(function (reports) {

            reports.forEach(function (item, index) {
                if (item.groupid === groupId) {
                    reports[index].groupid = 0;
                }
            });
            $that.getConnection().put('reports', reports, function (err) {
            });
        }, function (err) {
        });
    }



}
