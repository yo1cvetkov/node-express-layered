import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";

async function validateDto(req: Request, res: Response, next: Function, dtoClass: any) {
  const dtoInstance = plainToInstance(dtoClass, req.body);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const messages = errors.flatMap((error) => Object.values(error.constraints || {}));
    return res.status(400).json({ errors: messages });
  }

  req.body = dtoInstance;
  next();
}

export default validateDto;
