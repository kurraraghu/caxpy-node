"use strict";
var CaxpyConnection = (function () {
    function CaxpyConnection() {
        this.password = "";
    }
    CaxpyConnection.prototype.getConnectionname = function () {
        this.connectionname = this.db + "-" + this.dbname;
        return this.connectionname;
    };
    /**
     * Get connection url for the current database object
     *
     * @return
     */
    CaxpyConnection.prototype.getUrl = function () {
        if (this.db.toLowerCase() === "mysql") {
            return "jdbc:mysql://" + this.host + ":" + this.port + "/" + this.dbname;
        }
        else if (this.db.toLowerCase() === "postgresql") {
            return "jdbc:postgresql://" + this.host + ":" + this.port + "/" + this.dbname;
        }
        return "";
    };
    CaxpyConnection.prototype.getDriver = function () {
        if (this.db.toLowerCase() === "mysql") {
            return "com.mysql.jdbc.Driver";
        }
        else if (this.db.toLowerCase() === "postgresql") {
            return "org.postgresql.Driver";
        }
        return "";
    };
    return CaxpyConnection;
}());
exports.CaxpyConnection = CaxpyConnection;
//# sourceMappingURL=CaxpyConnection.js.map