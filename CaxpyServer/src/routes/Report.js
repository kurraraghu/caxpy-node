/// <reference path="../../Scripts/typings/express/express.d.ts" />
"use strict";
var ReportUtility_1 = require("../utility/ReportUtility");
var BiUtility_1 = require("../utility/BiUtility");
module.exports = function (ReportServiceRouter) {
    var prefixUrl = "";
    ReportServiceRouter.get(prefixUrl + '/report', function (req, res) {
        var params = req.body.params;
        var reportid = req.body.reportid;
        ReportUtility_1.ReportUtility.getReportJson(BiUtility_1.BiUtility.getReportId(reportid), params)
            .then(function (response) {
            res.status(200).json(response);
        }, function (error) {
            res.status(500).json(error);
        });
    });
};
//# sourceMappingURL=Report.js.map