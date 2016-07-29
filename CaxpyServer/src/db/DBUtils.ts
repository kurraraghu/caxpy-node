
import {CaxpyConnection} from "../model/CaxpyConnection";
var Promise = require('promise');
var tedious = require('tedious');

export class DBUtils {
	 

    public static executeQuery(query: string, con: CaxpyConnection): any{
        var connTyp = con.connectionType.toLowerCase();
        if (connTyp === "mysql") {

        } else if (connTyp === "mssql") {
            return this.mssqlExecuteQuery(query, con);
        }
    }

    public static mssqlExecuteQuery(query: string, con: CaxpyConnection): any {
        return new Promise(function (resolve, reject) {

            var config = {
                userName: con.username,
                password: con.password,
                server: con.host,
                //domain: con.host,
                options: {
                    port: con.port ? con.port : 1433,
                    database : con.dbname
                 }
            };
            var Connection = tedious.Connection;
            var connection = new Connection(config);
            connection.on('connect', function (err) {
                // If no error, then good to go...
                executeStatement();
            });
            function executeStatement() {
                var Request = tedious.Request;
                var request = new Request(query, function (err, rowCount) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(rowCount + ' rows');
                    }
                });
                request.on('row', function (columns) {
                    resolve(columns);
                    columns.forEach(function (column) {
                        console.log(column.value);
                    });
                });
                connection.execSql(request);
            }

        });
       
    }

   
}
