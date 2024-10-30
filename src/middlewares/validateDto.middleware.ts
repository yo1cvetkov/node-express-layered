import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";

function validateDto<T extends ClassConstructor<unknown>>(dtoClass: T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body) as T;
    const errors: ValidationError[] = await validate(dtoInstance);
    if (errors.length > 0) {
      const messages = errors.flatMap((error) => Object.values(error.constraints || {}));
      res.status(400).json({ errors: messages });
      return;
    }
    req.body = dtoInstance;
    next();
  };
}

export default validateDto;
