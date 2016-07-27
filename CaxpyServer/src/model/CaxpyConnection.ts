export class CaxpyConnection {

    public db: string;
    public connectionname: string;
    public host: string;
    public dbname: string;
    public port: number;
    public username: string;
    public password: string = "";
    public connectionType: string;

    public getConnectionname(): string {
        this.connectionname = this.db + "-" + this.dbname;
        return this.connectionname;
    }

    /**
     * Get connection url for the current database object
     * 
     * @return
     */
    public getUrl(): string {
        if (this.db.toLowerCase() === "mysql") {
            return "jdbc:mysql://" + this.host + ":" + this.port + "/" + this.dbname;
        } else if (this.db.toLowerCase() === "postgresql") {
            return "jdbc:postgresql://" + this.host + ":" + this.port + "/" + this.dbname;
        }
        return "";
    }

    public getDriver(): string {
        if (this.db.toLowerCase() === "mysql") {
            return "com.mysql.jdbc.Driver";
        } else if (this.db.toLowerCase() === "postgresql") {
            return "org.postgresql.Driver";
        }
        return "";
    }
}