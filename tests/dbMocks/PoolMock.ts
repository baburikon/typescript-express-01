import {PoolClient} from "pg";
import PoolClientMock from "./PoolClientMock";

/**
 *
 */
export default class PoolMock { // унаследовать от Pool не удалось, хз - запретили?

  /**
   *
   */
  async connect(): Promise<PoolClient> {
    return <PoolClient> new PoolClientMock();
  }
}
