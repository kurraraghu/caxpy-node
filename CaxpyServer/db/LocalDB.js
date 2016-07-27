/// <reference path="../Scripts/typings/levelup/levelup.d.ts" />
/// <reference path="../model/CaxpyConnection.ts" />
/// <reference path="../model/CaxpyReport.ts" />
/// <reference path="../model/Group.ts" />
/// <reference path="../utility/ReportUtility.ts" />
"use strict";
var levelup = require("levelup");
var ReportUtility_1 = require("../utility/ReportUtility");
var Promise = require('promise');
var Map = (function () {
    function Map() {
        this.items = {};
    }
    Map.prototype.add = function (key, value) {
        this.items[key] = value;
    };
    Map.prototype.has = function (key) {
        return key in this.items;
    };
    Map.prototype.get = function (key) {
        return this.items[key];
    };
    return Map;
}());
exports.Map = Map;
var List = (function () {
    function List() {
        this.items = [];
    }
    List.prototype.size = function () {
        return this.items.length;
    };
    List.prototype.add = function (value) {
        this.items.push(value);
    };
    List.prototype.get = function (index) {
        return this.items[index];
    };
    return List;
}());
exports.List = List;
var LocalDB = (function () {
    function LocalDB() {
    }
    /**
     * use a single connection pool.
     *
     * @return the connection pool
     */
    LocalDB.getConnection = function () {
        if (this.dbConnection === null) {
            try {
                this.dbConnection = levelup('./' + this.DBName);
            }
            catch (ex) {
            }
        }
        return this.dbConnection;
    };
    /**
     * Get all the report from the report location.
     *
     * @return table names in the form of array
     */
    LocalDB.getReports = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('reports', function (err, reports) {
                if (err)
                    reject(err); // likely the key was not found
                resolve(reports);
            });
        });
    };
    /**
     * Gets the report json.
     *
     * @param reportid
     *            the reportid
     * @param params
     *            the params
     * @return the report json
     */
    LocalDB.getReportJson = function (reportid, params) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                var report = reports[reportid];
                if (report) {
                    resolve(ReportUtility_1.ReportUtility.refreshJsonData(report, params));
                }
                else {
                    reject("No report with id: " + reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     * Save the entered connection information.
     *
     * @param rep
     *            the rep
     */
    LocalDB.updateReport = function (rep) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                if (reports[rep.reportid]) {
                    reports[rep.reportid] = rep;
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err)
                            reject(err); // likely the key was not found
                        resolve(rep);
                    });
                }
                else {
                    reject("No report with id: " + rep.reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     * Save the entered connection information.
     *
     * @param rep
     *            the rep
     */
    LocalDB.insertReport = function (rep) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getReports().then(function (reports) {
                if (!reports[rep.reportid]) {
                    reports[rep.reportid] = rep;
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err)
                            reject(err); // likely the key was not found
                        resolve(rep);
                    });
                }
                else {
                    reject("already report exist with id: " + rep.reportid);
                }
            }, function (err) {
                reject(err);
            });
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
            $that.getReports().then(function (reports) {
                if (!reports[reportid]) {
                    delete reports[reportid];
                    $that.getConnection().put('reports', reports, function (err) {
                        if (err)
                            reject(err); // likely the key was not found
                        resolve(true);
                    });
                }
                else {
                    reject("report not exist with id: " + reportid);
                }
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     * Gets the mail settings.
     *
     * @return the mail settings
     */
    LocalDB.getMailSettings = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('mailsettings', function (err, mailsettings) {
                if (err)
                    reject(err); // likely the key was not found
                resolve(mailsettings);
            });
        });
    };
    /**
     * Return the list of all available connections from the database.
     *db, dbname, host, port, username, password
     * @return the connections
     */
    LocalDB.getConnections = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('connections', function (err, connections) {
                if (err)
                    reject(err); // likely the key was not found
                resolve(connections);
            });
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
    };
    /**
     * Save the entered connection information.
     *
     * @param c
     *            the c
     * @return true, if successful
     */
    LocalDB.insertConnection = function (c) {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('connections', function (err, connections) {
                if (err)
                    reject(err);
                connections.push(c);
                $that.getConnection().put('connections', connections, function (err) {
                    if (err)
                        reject(err);
                    resolve(c);
                });
            });
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
            $that.getConnections().then(function (connections) {
                connections.forEach(function (item, index) {
                    if (item.db === split[0] && item.dbname === split[1]) {
                        connections[index] = con;
                    }
                });
                $that.getConnection().put('connections', connections, function (err) {
                    if (err)
                        reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getConnections().then(function (connections) {
                connections.forEach(function (item, index) {
                    if (item.db === split[0] && item.dbname === split[1]) {
                        connections.splice(index, 1);
                    }
                });
                $that.getConnection().put('connections', connections, function (err) {
                    if (err)
                        reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     * Get file information.
     *id,filename,datajson
     * @return the all data files
     */
    LocalDB.getAllDataFiles = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('files', function (err, files) {
                if (err)
                    reject(err); // likely the key was not found
                resolve(files);
            });
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
            $that.getAllDataFiles().then(function (files) {
                resolve(files);
            }, function (err) {
                reject(err);
            });
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
            $that.getAllDataFiles().then(function (files) {
                files.push(file);
                $that.getConnection().put('files', files, function (err) {
                    if (err)
                        reject(err);
                    resolve(file);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllDataFiles().then(function (files) {
                files.forEach(function (item, index) {
                    if (item.id === fileid) {
                        files.splice(index, 1);
                    }
                });
                $that.getConnection().put('files', files, function (err) {
                    if (err)
                        reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    /**
     * Gets the all report groups.
     *id, groupname, groupdesc
     * @return the all report groups
     */
    LocalDB.getAllGroups = function () {
        var $that = this;
        return new Promise(function (resolve, reject) {
            $that.getConnection().get('groups', function (err, groups) {
                if (err)
                    reject(err); // likely the key was not found
                resolve(groups);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.push(gp);
                $that.getConnection().put('groups', groups, function (err) {
                    if (err)
                        reject(err);
                    resolve(gp);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.forEach(function (item, index) {
                    if (item.id === gp.id) {
                        groups[index] = gp;
                    }
                });
                $that.getConnection().put('groups', groups, function (err) {
                    if (err)
                        reject(err);
                    resolve(true);
                });
            }, function (err) {
                reject(err);
            });
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
            $that.getAllGroups().then(function (groups) {
                groups.forEach(function (item, index) {
                    if (item.id === groupId) {
                        groups.splice(index, 1);
                    }
                });
                $that.getConnection().put('groups', groups, function (err) {
                    if (err)
                        reject(err);
                    resolve(true);
                    $that.deleteReportGroupMapping(groupId);
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    LocalDB.deleteReportGroupMapping = function (groupId) {
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
    };
    /** The connection pool. */
    LocalDB.dbConnection = null;
    LocalDB.DBName = "caxpy";
    return LocalDB;
}());
exports.LocalDB = LocalDB;
//# sourceMappingURL=LocalDB.js.map