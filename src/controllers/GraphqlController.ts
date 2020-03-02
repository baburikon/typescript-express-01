import { NextFunction, Request, Response } from "express";
import { buildSchema, graphql, GraphQLSchema, ExecutionResult, GraphQLError } from "graphql";
import graphqlHTTP from "express-graphql";
import createError from "http-errors";
import errors from "../helpers/controllerErrorsDecorator";
import resolvers from "./graphql/resolvers";
import fs from "fs";

export const schema: GraphQLSchema = buildSchema(fs.readFileSync(__dirname+'/graphql/schema.graphql', 'utf8'));

/**
 *
 */
export default class TasksController {
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  @errors
  async exec(req: Request, res: Response, next: NextFunction): Promise<void> {
    const contextValue = {};
    const operationName = req.body.operationName;
    const result: ExecutionResult = await graphql(
      schema,
      req.body.query,
      resolvers,
      contextValue,
      req.body.variables,
      operationName
    );
    if (!result.errors) {
      res.status(200).json({ data: result.data });
    } else { //console.log(result.errors);
      const fncReplaceQuotationMarks = (str: string): string =>
        str.replace(/"/g, `'`);
      throw createError(400, "GraphQLError", {
        errors: result.errors.map((err: GraphQLError) => ({
          message: fncReplaceQuotationMarks(err.message),
          locations: fncReplaceQuotationMarks(JSON.stringify(err.locations)),
          path: err.path,
        }))
      });
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  @errors
  async ide(req: Request, res: Response, next: NextFunction): Promise<void> {
    const graphqlHTTPMiddleware = graphqlHTTP({
      schema,
      rootValue: resolvers,
      graphiql: true
    });
    await graphqlHTTPMiddleware(req, res);
  }
}
