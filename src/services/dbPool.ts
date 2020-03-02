import { Pool } from "pg";
import config from "config";
import PoolMock from "../../tests/dbMocks/PoolMock";

const dbPool: Pool =
  process.env.NODE_ENV === "test"
    ? <Pool>new PoolMock()
    : new Pool({
        /*host: config.get("db.host"),
        user: config.get("db.user"),
        database: config.get("db.database"),
        password: config.get("db.password"),*/
        max: config.get("db.max"),
        idleTimeoutMillis: config.get("db.idleTimeoutMillis"),
        connectionTimeoutMillis: config.get("db.connectionTimeoutMillis")
      });

export default dbPool;
