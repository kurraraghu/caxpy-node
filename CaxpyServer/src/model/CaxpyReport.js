"use strict";
/**
   * The Class CaxpyReport.
   */
var CaxpyReport = (function () {
    function CaxpyReport() {
        this.groupid = 0;
    }
    /**
     * Sets the reportname.
     *
     * @param reportname
     *            the new reportname
     */
    CaxpyReport.prototype.setReportname = function (reportname) {
        var tempname = reportname.indexOf("-") > -1 ? reportname.split("-")[1] : reportname;
        this.reportname = tempname.toString();
    };
    CaxpyReport.prototype.getReportname = function () {
        return this.reportname;
    };
    return CaxpyReport;
}());
exports.CaxpyReport = CaxpyReport;
//# sourceMappingURL=CaxpyReport.js.map