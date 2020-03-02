import {NextFunction, Request, Response} from "express";

/**
 *
 * @param target
 * @param method
 * @param descriptor
 */
export default function controllerErrorsDecorator (target: Object, method: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await originalMethod.call(this, req, res, next);
    } catch (e) {
      next(e);
    }
  }
}
