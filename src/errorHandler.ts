import {NextFunction, Request, Response} from "express";
import {ValidationError} from "sequelize";
import {ApiException} from "./apiExceptions";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiException) {
    res.status(err.code).json({
      error: err.constructor.name,
      message: err.message,
      payload: err.payload,
      stack: err.stack
    });
  } else if (err instanceof ValidationError) {
    res.status(400).json({
      name: err.name,
      message: err.message,
      errors: err.errors
    });
  } else if (err instanceof SyntaxError) {
    res.status(400).json({
      error: err.name,
      message: err.message
    });
  } else if (err instanceof Error) {
    res.status(500);
    if (process.env.NODE_ENV !== "prod") {
      res.json({
        error: err.constructor.name,
        name: err.name,
        message: err.message,
        stack: err.stack
      });
    } else {
      res.json({
        error: "Internal error"
      });
    }
    console.error(err);
  } else { // pass error on if not common error
    next(err);
    return;
  }
  next();
};
