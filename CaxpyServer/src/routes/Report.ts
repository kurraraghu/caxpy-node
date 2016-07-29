/// <reference path="../../Scripts/typings/express/express.d.ts" />
"use strict";

import * as express from "express";

import {ReportUtility} from "../utility/ReportUtility";
import {BiUtility} from "../utility/BiUtility";

module.exports = function (ReportServiceRouter: express.Express) {
    const prefixUrl: string = "";
    ReportServiceRouter.get(prefixUrl + '/report', (req: express.Request, res: express.Response) => {
        var params = req.body.params;
        var reportid = req.body.reportid;
        ReportUtility.getReportJson(BiUtility.getReportId(reportid), params)
            .then(function (response) {
                res.status(200).json(response);
            }, function (error) {
                res.status(500).json(error);
            });
    });
}

