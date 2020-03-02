import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import bodyParser from "body-parser";
import createError, { HttpError } from "http-errors";
import routes from "./routes/routes";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    createError(
      404,
      "Запрос прошёл через все промежуточные обработчики и маршруты, но так и не был обработан"
    )
  );
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(err);
  //console.error(err);
  const status = (<HttpError>err).status || 500;
  const listErrors = (<HttpError>err).errors;
  const existListErrors = Array.isArray(listErrors);
  res.status(status).json({
    errors: existListErrors
      ? listErrors
      : [{message: err.message}]
  });
});

export default app;
