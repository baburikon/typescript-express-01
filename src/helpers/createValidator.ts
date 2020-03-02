/// <reference path="../@types/ajv-i18n.d.ts" />
import { Ajv } from "ajv";
import ajvLocalizeRu from "ajv-i18n/localize/ru";
import createError from "http-errors";

/**
 *
 * @param schema
 */
export default function createValidator(schema: Ajv): Function {
  return (...argsArray: any): void => {
    const valid = <boolean>schema.validate.apply(schema, argsArray);
    if (!valid) {
      const errors = schema.errors;
      if (errors) {
        ajvLocalizeRu(errors);
        const details = errors.map(
          error => ({
            message: `Ошибка валидации: поле «${error.dataPath}» ${error.message}`,
          })
        );
        throw createError(400, details.join('. '), {errors: details});
      }
    }
  };
}
