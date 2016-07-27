/**
   * The Class CaxpyReport.
   */
export class CaxpyReport {
    public reportid: number;
    public reportjson: any;
    public reportname: string;
    public groupid: number = 0;

    /**
     * Sets the reportname.
     *
     * @param reportname
     *            the new reportname
     */
    public setReportname(reportname: string): void {
        var tempname = reportname.indexOf("-") > -1 ? reportname.split("-")[1] : reportname;
        this.reportname = tempname.toString();
    }
    public getReportname(): string {
        return this.reportname;
    }
}
