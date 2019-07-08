import {Router} from "express";
import {Author} from "../models/Author";
import {Conditions} from "../conditions-helper";

export const authors = Router();

authors.post("/", async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json(author);
  } catch (e) {
    next(e);
  }
});

authors.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.scope(req.query.scope).findByPk(req.params.id);
    res.json(author);
  } catch (e) {
    next(e);
  }
});

authors.get("", async (req, res, next) => {
  try {
    const conditions = new Conditions(req.query);
    conditions.addCondition('firstName');
    conditions.addCondition('lastName');

    const authors = await Author.scope(req.query.scope).findAll({
      where: conditions.getConditions()
    });

    res.json(authors);
  } catch (e) {
    next(e);
  }
});

authors.put("/:id", async (req, res, next) => {
  try {
    await Author.update<Author>(req.body, {where: {id: req.params.id}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
