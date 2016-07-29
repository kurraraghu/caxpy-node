/// <reference path="../../Scripts/typings/lokijs/lokijs.d.ts" />
"use strict";
var Loki = require("lokijs");
var ReportUtility_1 = require("../utility/ReportUtility");
var CaxpyConstants_1 = require("../CaxpyConstants");
var Promise = require('promise');
var DBCollections = (function () {
    function DBCollections() {
    }
    DBCollections.REPORTS = "reports";
    DBCollections.MAILSETTINGS = "mailsettings";
    DBCollections.CONNECTIONS = "connections";
    DBCollections.FILES = "files";
    DBCollections.GROUPS = "groups";
    return DBCollections;
}());
var LocalDB = (function () {
    function LocalDB() {
    }
    /**
     * use a single connection pool.
     *
     * @return the connection pool
     */
    LocalDB.initDB = function () {
        this._db = new Loki(this.DBName, {
            autosave: true,
            autosaveInterval: 1000,
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
    };
    LocalDB._getMailSettingCollection = function () {
        return this._db.getCollection(DBCollections.MAILSETTINGS);
    };
    /**
     * Gets the mail settings.
     *
     * @return the mail settings
     */
    LocalDB.getMailSettings = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var mailsettingsColl = $that._getMailSettingCollection();
            if (!mailsettingsColl) {
                reject("No mailsettings");
            }
            else {
                resolve(mailsettingsColl.data);
            }
        });
    };
    LocalDB._getReportCollection = function () {
        return this._db.getCollection(DBCollections.REPORTS);
    };
    /**
     * Get all the report from the report location.
     *
     * @return table names in the form of array
     */
    LocalDB.getReports = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var reportColl = $that._getReportCollection();
                if (!reportColl) {
                    reject("No Reports");
                }
                else {
                    resolve(reportColl.data);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Gets the report json.
     *
     * @param reportid the reportid
     * @param params  the params
     * @return the report json
     */
    LocalDB.getReportJson = function (reportid, params) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var report = $that._db.getCollection(DBCollections.REPORTS).findOne({ reportid: reportid });
                if (report) {
                    ReportUtility_1.ReportUtility.refreshJsonData(report, params)
                        .then(function (response) {
                        resolve(response);
                    }, function (err) {
                        reject(err);
                    });
                }
                else {
                    reject("No report with reportid : " + reportid);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Save the entered connection information.
     *
     * @param rep the rep
     */
    LocalDB.insertReport = function (report) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                report = $that._db.getCollection(DBCollections.REPORTS).add(report);
                if (report) {
                    resolve(report);
                }
                else {
                    reject("Failed to insert Report");
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Save the entered connection information.
     *
     * @param rep the rep
     */
    LocalDB.updateReport = function (report) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                report = $that._db.getCollection(DBCollections.REPORTS).update(report);
                if (report) {
                    resolve(report);
                }
                else {
                    reject("Failed to update Report");
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Save the entered connection information.
     *
     * @param rep
     *            the rep
     */
    LocalDB.updateReportName = function (reportname, groupid, reportid) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var reportCollection = $that._db.getCollection(DBCollections.REPORTS);
                var editReport = reportCollection.findOne({ reportid: reportid });
                if (editReport) {
                    editReport.groupid = groupid;
                    editReport.reportname = reportname;
                    resolve(reportCollection.update(editReport));
                }
                else {
                    reject("No report with reportid : " + reportid);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Delete report.
     *
     * @param reportid
     *            the reportid
     */
    LocalDB.deleteReport = function (reportid) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                $that._db.getCollection(DBCollections.REPORTS).removeWhere({ reportid: reportid });
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    LocalDB._getConnectionCollection = function () {
        return this._db.getCollection(DBCollections.CONNECTIONS);
    };
    /**
     * Return the list of all available connections from the database.
     *db, dbname, host, port, username, password
     * @return the connections
     */
    LocalDB.getConnections = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var connColl = $that._getConnectionCollection();
                if (!connColl) {
                    reject("No Connections.");
                }
                else {
                    resolve(connColl.data);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Get connection information.
     *
     * @param connectionName
     *            the connection name
     * @return the connection information
     */
    LocalDB.getConnectionInformation = function (connectionname) {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                var connection = $that._getConnectionCollection().findOne({ db: split[0], dbname: split[1] });
                resolve(connection);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Save the entered connection information.
     * @param c the connection
     */
    LocalDB.insertConnection = function (connection) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var con = $that._getConnectionCollection().add(connection);
            if (!con) {
                reject("failed to insert");
            }
            else {
                resolve(con);
            }
        });
    };
    /**
     * Update connection.
     *
     * @param oldConnection
     *            the old connection
     * @param c
     *            the c
     * @return true, if successful
     */
    LocalDB.updateConnection = function (connectionname, con) {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                var upCon = $that._getConnectionCollection().update(con);
                resolve(upCon);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Delete the connection from database the connectionname is a combination
     * of db and db name, for example - mysql-foodmart.
     *
     * @param connectionname
     *            the connectionname
     * @return true, if successful
     */
    LocalDB.deleteConnection = function (connectionname) {
        var $that = this;
        var split = connectionname.split("-", 2);
        return new Promise(function (resolve, reject) {
            try {
                $that._getConnectionCollection().removeWhere({ db: split[0], dbname: split[1] });
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    LocalDB._getFileCollection = function () {
        return this._db.getCollection(DBCollections.FILES);
    };
    /**
     * Get file information.
     *id,filename,datajson
     * @return the all data files
     */
    LocalDB.getAllDataFiles = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                var fileColl = $that._getFileCollection();
                if (!fileColl) {
                    reject("No files.");
                }
                else {
                    resolve(fileColl.data);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Get file information.
     *
     * @param fileid
     *            the fileid
     * @return the file information
     */
    LocalDB.getFileInformation = function (fileid) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var file = $that._getFileCollection().findOne({ id: fileid });
            if (!file) {
                reject("No file with fileid: " + fileid);
            }
            else {
                resolve(file);
            }
        });
    };
    /**
     * Save file and return generated id.
     *
     * @param filename
     *            the filename
     * @param datajson
     *            the datajson
     * @return the int
     */
    LocalDB.saveFileInformation = function (file) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var file = $that._getFileCollection().add(file);
            if (!file) {
                reject("failed to insert");
            }
            else {
                resolve(file);
            }
        });
    };
    /**
     * Delete file information.
     *
     * @param fileid
     *            the fileid
     * @return the int
     */
    LocalDB.deleteFileInformation = function (fileid) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            try {
                $that._getFileCollection().removeWhere({ id: fileid });
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    /**
     * Gets the all databases.
     *
     * @return the all databases
     */
    LocalDB.getAllDatabases = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            Promise.all([$that.getAllDataFiles(), $that.getConnections()]).then(function (res) {
                var databases = {};
                databases[CaxpyConstants_1.CaxpyConstants.CSV] = res[0]; //sqls
                databases[CaxpyConstants_1.CaxpyConstants.SQL] = res[1]; //files
                resolve(databases);
            });
        });
    };
    LocalDB._getGroupCollection = function () {
        return this._db.getCollection(DBCollections.GROUPS);
    };
    /**
     * Gets the all report groups.
     *id, groupname, groupdesc
     * @return the all report groups
     */
    LocalDB.getAllGroups = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var groupColl = $that._getGroupCollection();
            if (!groupColl) {
                reject("No Groups");
            }
            else {
                resolve(groupColl.data);
            }
        });
    };
    //crud for group
    /**
     * Insert group.
     *id,groupname,groupdesc
     * @param gp the gp
     */
    LocalDB.insertGroup = function (gp) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var group = $that._getGroupCollection().add(gp);
            if (!group) {
                reject("Faield to insert Group");
            }
            else {
                resolve(group);
            }
        });
    };
    /**
     * Update group.
     *
     * @param gp the gp
     */
    LocalDB.updateGroup = function (gp) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            var group = $that._getGroupCollection().update(gp);
            if (!group) {
                reject("Faield to update Group");
            }
            else {
                resolve(group);
            }
        });
    };
    /**
     * Delete group.
     *
     * @param gpid the gpid
     */
    LocalDB.deleteGroup = function (groupId) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that._getGroupCollection().removeWhere({ id: groupId });
            resolve(true);
            $that.deleteReportGroupMapping(groupId);
        });
    };
    LocalDB.deleteReportGroupMapping = function (groupId) {
        var $that = this;
        $that._getReportCollection().findAndUpdate(function (report) {
            return report.groupid === groupId;
        }, function (report) {
            report.groupid = 0;
            return report;
        });
    };
    LocalDB.DBName = "caxpy.db";
    return LocalDB;
}());
exports.LocalDB = LocalDB;
//# sourceMappingURL=LocalDB.js.map