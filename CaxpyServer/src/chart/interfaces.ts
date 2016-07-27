
/**
 * Basic Structure of all our charts 
 */
export interface IChart {
    getColumnChart(reportJson: string): string;
    getBarChart(reportJson: string): string;
    getAreaChart(reportJson: string): string;
    getLineChart(reportJson: string): string;
    getPieChart(reportJson: string): string;
}
