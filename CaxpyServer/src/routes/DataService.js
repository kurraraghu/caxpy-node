"use strict";
var BiUtility_1 = require("../utility/BiUtility");
var LocalDB_1 = require("../db/LocalDB");
var CaxpyConnection_1 = require("../model/CaxpyConnection");
var CaxpyConstants_1 = require("../CaxpyConstants");
module.exports = function (DataServiceRouter) {
    var prefixUrl = "";
    //executeQuery
    DataServiceRouter.get(prefixUrl + '/execute', function (req, res) {
        var query;
        var db;
        BiUtility_1.BiUtility.getResponse(query, db)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //getReports
    DataServiceRouter.get(prefixUrl + '/reports', function (req, res) {
        BiUtility_1.BiUtility.getReports()
            .then(function (reports) {
            res.status(200).json(reports);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //getReport
    DataServiceRouter.get(prefixUrl + '/report', function (req, res) {
        var reportid;
        BiUtility_1.BiUtility.getReport(reportid)
            .then(function (report) {
            if (!report) {
                res.status(404).end();
            }
            if (!report.report_id) {
                report.report_id = reportid;
            }
            res.status(200).json(report);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //getConnections
    DataServiceRouter.get(prefixUrl + '/connections', function (req, res) {
        var reportid;
        LocalDB_1.LocalDB.getConnections()
            .then(function (connections) {
            res.status(200).json(connections);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //saveReport
    DataServiceRouter.post(prefixUrl + '/save', function (req, res) {
        var report = req.body.report;
        var groupid = req.body.groupid;
        var report_name = BiUtility_1.BiUtility.saveReport(report, groupid);
        var response = {
            "status": "success",
            "report": report_name
        };
        res.status(200).json(response);
    });
    //saveEditedReport
    DataServiceRouter.post(prefixUrl + '/saveedits', function (req, res) {
        var reportname = req.body.reportname;
        var groupid = req.body.groupid;
        var reportid = req.body.reportid;
        LocalDB_1.LocalDB.updateReportName(reportname, groupid, reportid)
            .then(function (editedReport) {
            res.status(200).json(CaxpyConstants_1.CaxpyConstants.SUCCESS);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //deleteReport
    DataServiceRouter.get(prefixUrl + '/delete', function (req, res) {
        var reportname = req.body.report_name;
        LocalDB_1.LocalDB.deleteReport(BiUtility_1.BiUtility.getReportId(reportname))
            .then(function (editedReport) {
            res.status(200).json(CaxpyConstants_1.CaxpyConstants.SUCCESS);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //saveConnection
    DataServiceRouter.post(prefixUrl + '/saveconnection', function (req, res) {
        var con = new CaxpyConnection_1.CaxpyConnection();
        con.db = req.body.database;
        con.dbname = req.body.dbname;
        con.host = req.body.host;
        con.port = req.body.port;
        con.username = req.body.username;
        con.password = req.body.password;
        LocalDB_1.LocalDB.insertConnection(con)
            .then(function (connection) {
            res.status(200).json(connection);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //updateConnection
    DataServiceRouter.get(prefixUrl + '/updateconnection', function (req, res) {
        var oldconnection = req.body.oldconnection;
        var con = new CaxpyConnection_1.CaxpyConnection();
        con.db = req.body.database;
        con.dbname = req.body.dbname;
        con.host = req.body.host;
        con.port = req.body.port;
        con.username = req.body.username;
        con.password = req.body.password;
        LocalDB_1.LocalDB.updateConnection(oldconnection, con)
            .then(function (response) {
            res.status(200).json(CaxpyConstants_1.CaxpyConstants.SUCCESS);
        }, function (error) {
            res.status(403).json(error);
        });
    });
    //deleteConnection
    DataServiceRouter.get(prefixUrl + '/deleteconnection', function (req, res) {
        var connection = req.body.connection;
        LocalDB_1.LocalDB.deleteConnection(connection)
            .then(function (response) {
            res.status(200).json(CaxpyConstants_1.CaxpyConstants.SUCCESS);
        }, function (error) {
            res.status(403).json(CaxpyConstants_1.CaxpyConstants.FAILED);
        });
    });
    //testConnection
    DataServiceRouter.get(prefixUrl + '/testconnection', function (req, res) {
        var con = new CaxpyConnection_1.CaxpyConnection();
        con.db = req.body.database;
        con.dbname = req.body.dbname;
        con.host = req.body.host;
        con.port = req.body.port;
        con.username = req.body.username;
        con.password = req.body.password;
        //DBUtils.testDatabaseConnection(con)
        //    .then(function (response) {
        //        res.status(200).json(response);
        //    }, function (error) {
        //        res.status(403).json(error);
        //    });
    });
    //getFileDatabases
    DataServiceRouter.get(prefixUrl + '/filedatabases', function (req, res) {
        LocalDB_1.LocalDB.getAllDataFiles()
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(CaxpyConstants_1.CaxpyConstants.FAILED);
        });
    });
    //getAllDatabases
    DataServiceRouter.get(prefixUrl + '/alldatabases', function (req, res) {
        LocalDB_1.LocalDB.getAllDatabases()
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //getFileDatabase
    DataServiceRouter.get(prefixUrl + '/filedatabase', function (req, res) {
        var fileid = req.body.fileid;
        LocalDB_1.LocalDB.getFileInformation(fileid)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //deleteFileDatabases
    DataServiceRouter.get(prefixUrl + '/deletefiledatabase', function (req, res) {
        var fileid = req.body.fileid;
        LocalDB_1.LocalDB.deleteFileInformation(fileid)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //getGroups
    DataServiceRouter.get(prefixUrl + '/groups', function (req, res) {
        LocalDB_1.LocalDB.getAllGroups()
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //saveGroup
    DataServiceRouter.post(prefixUrl + '/group', function (req, res) {
        var group = req.body;
        LocalDB_1.LocalDB.insertGroup(group)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //updateGroup
    DataServiceRouter.put(prefixUrl + '/group', function (req, res) {
        var group = req.body;
        LocalDB_1.LocalDB.updateGroup(group)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
    //updateGroup
    DataServiceRouter.delete(prefixUrl + '/group', function (req, res) {
        var groupid = req.query.id;
        LocalDB_1.LocalDB.deleteGroup(groupid)
            .then(function (response) {
            res.status(200).json(CaxpyConstants_1.CaxpyConstants.SUCCESS);
        }, function (error) {
            res.status(500).json(error);
        });
    });
};
//# sourceMappingURL=DataService.js.map