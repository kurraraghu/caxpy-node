"use strict";

import * as express from "express";

import {BiUtility} from "../utility/BiUtility";
import {LocalDB} from "../db/LocalDB";
import {CaxpyConnection} from "../model/CaxpyConnection";
import {Group} from "../model/Group";
import {CaxpyConstants} from "../CaxpyConstants";

module.exports = function (DataServiceRouter: express.Router) {
    const prefixUrl: string = "";
    //executeQuery
    DataServiceRouter.get(prefixUrl+'/execute', (req, res) => {
        var query: string;
        var db: string;
        BiUtility.getResponse(query, db)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //getReports
    DataServiceRouter.get(prefixUrl+'/reports', (req, res) => {
        BiUtility.getReports()
            .then(function (reports) {
                res.status(200).json(reports);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //getReport
    DataServiceRouter.get(prefixUrl+'/report', (req, res) => {
        var reportid: string;
        BiUtility.getReport(reportid)
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
    DataServiceRouter.get(prefixUrl+'/connections', (req, res) => {
        var reportid: string;
        LocalDB.getConnections()
            .then(function (connections) {
                res.status(200).json(connections);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //saveReport
    DataServiceRouter.post(prefixUrl + '/save', (req: express.Request, res: express.Response) => {
        console.log(req.body);
        var report: any = req.body.report;
        var groupid: number = req.body.groupid;
        var report_name = BiUtility.saveReport(report, groupid);
        var response = {
            "status": "success",
            "report": report_name
        };
        res.status(200).json(response);
    });


    //saveEditedReport
    DataServiceRouter.post(prefixUrl+'/saveedits', (req, res) => {
        var reportname: string = req.body.reportname;
        var groupid: number = req.body.groupid;
        var reportid: number = req.body.reportid;
        LocalDB.updateReportName(reportname, groupid, reportid)
            .then(function (editedReport) {
                res.status(200).json(CaxpyConstants.SUCCESS);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //deleteReport
    DataServiceRouter.get(prefixUrl+'/delete', (req, res) => {
        var reportname: string = req.body.report_name;
        LocalDB.deleteReport(BiUtility.getReportId(reportname))
            .then(function (editedReport) {
                res.status(200).json(CaxpyConstants.SUCCESS);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //saveConnection
    DataServiceRouter.post(prefixUrl+'/saveconnection', (req, res) => {
        var con = new CaxpyConnection();
        con.db = req.body.database;
        con.dbname = req.body.dbname;
        con.host = req.body.host;
        con.port = req.body.port;
        con.username = req.body.username;
        con.password = req.body.password;
        LocalDB.insertConnection(con)
            .then(function (connection) {
                res.status(200).json(connection);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //updateConnection
    DataServiceRouter.get(prefixUrl+'/updateconnection', (req, res) => {
        var oldconnection: string = req.body.oldconnection;
        var con = new CaxpyConnection();
        con.db = req.body.database;
        con.dbname = req.body.dbname;
        con.host = req.body.host;
        con.port = req.body.port;
        con.username = req.body.username;
        con.password = req.body.password;
        LocalDB.updateConnection(oldconnection, con)
            .then(function (response) {
                res.status(200).json(CaxpyConstants.SUCCESS);
            }, function (error) {
                res.status(403).json(error);
            });
    });

    //deleteConnection
    DataServiceRouter.get(prefixUrl+'/deleteconnection', (req, res) => {
        var connection: string = req.body.connection;
        LocalDB.deleteConnection(connection)
            .then(function (response) {
                res.status(200).json(CaxpyConstants.SUCCESS);
            }, function (error) {
                res.status(403).json(CaxpyConstants.FAILED);
            });
    });

    //testConnection
    DataServiceRouter.get(prefixUrl+'/testconnection', (req, res) => {
        var con = new CaxpyConnection();
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
    DataServiceRouter.get(prefixUrl+'/filedatabases', (req, res) => {
        LocalDB.getAllDataFiles()
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(CaxpyConstants.FAILED);
            });
    });

    //getAllDatabases
    DataServiceRouter.get(prefixUrl+'/alldatabases', (req, res) => {
        LocalDB.getAllDatabases()
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //getFileDatabase
    DataServiceRouter.get(prefixUrl+'/filedatabase', (req, res) => {
        var fileid: number = req.body.fileid;
        LocalDB.getFileInformation(fileid)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //deleteFileDatabases
    DataServiceRouter.get(prefixUrl+'/deletefiledatabase', (req, res) => {
        var fileid: number = req.body.fileid;
        LocalDB.deleteFileInformation(fileid)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });


    //getGroups
    DataServiceRouter.get(prefixUrl+'/groups', (req, res) => {
        LocalDB.getAllGroups()
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //saveGroup
    DataServiceRouter.post(prefixUrl+'/group', (req, res) => {
        var group = req.body as Group;
        LocalDB.insertGroup(group)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //updateGroup
    DataServiceRouter.put(prefixUrl+'/group', (req, res) => {
        var group = req.body as Group;
        LocalDB.updateGroup(group)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });

    //updateGroup
    DataServiceRouter.delete(prefixUrl+'/group', (req, res) => {
        var groupid: number = req.query.id;
        LocalDB.deleteGroup(groupid)
            .then(function (response) {
                res.status(200).json(CaxpyConstants.SUCCESS);
            }, function (error) {
                res.status(500).json(error);
            });
    });


}
