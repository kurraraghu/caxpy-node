"use strict";

import {ReportUtility} from "../utility/ReportUtility";
import {BiUtility} from "../utility/BiUtility";

import express = require('express');

export function report(req: express.Request, res: express.Response) {
    var params = req.body.params;
    var reportid = req.body.reportid;
    ReportUtility.getReportJson(BiUtility.getReportId(reportid), params)
        .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
}