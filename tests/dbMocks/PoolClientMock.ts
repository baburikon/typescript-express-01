import {
  QueryConfig,
  QueryResult,
  QueryResultRow,
  FieldDef,
} from "pg";
import alasql from 'alasql';

/**
 *
 */
export default class PoolClientMock { // наследовать от PoolClient не стал - и так хорошо

  /**
   *
   * @param err
   */
  release(err?: Error | boolean): void {}

  /**
   *
   * @param queryTextOrConfig
   * @param values
   */
  async query<R extends QueryResultRow = any, I extends any[] = any[]>(
    queryTextOrConfig: string | QueryConfig<I>,
    values?: I,
  ): Promise<QueryResult<R>> {

    if (values) values.unshift(undefined); // $0 in $1

    const rows: R[] = alasql(queryTextOrConfig, values); //console.log('rows', rows);

    const fields = rows.length
      ? Object.entries(rows[0]).map(([fieldName]) => (<FieldDef> {
          name: fieldName,
        }))
      : [];

    return <QueryResult<R>> {
      rowCount: rows.length,
      fields,
      rows,
    };
  }
}
