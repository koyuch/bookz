import Ajv from "ajv";
import express from "express";
import {ValidationException} from "./apiExceptions";

const ajv = new Ajv({allErrors: true});

export default function validate(rules: {[source: string]: object}): express.RequestHandler {
  return (req: {[key: string]: any}, res, next) => {
    const errors = Object.entries(rules).flatMap(
      ([source, schema]) => {
        return (!ajv.validate(schema, req[source])) ? ajv.errors : [];
      });
    if (errors && errors.length) {
      throw new ValidationException(errors);
    }
    next();
  };
}
