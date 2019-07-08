import {Router} from "express";
import {Book} from "../models/Book";
import {Conditions} from "../conditions-helper";

export const books = Router();

books.post("/", async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (e) {
    next(e);
  }
});


books.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.scope(req.query.scope).findByPk(req.params.id);
    res.json(book);
  } catch (e) {
    next(e);
  }
});

books.get("", async (req, res, next) => {
  try {
    const conditions = new Conditions(req.query);
    conditions.addCondition('title');
    conditions.addCondition('description');

    const books = await Book.scope(req.query.scope).findAll({
      where: conditions.getConditions()
    });

    res.json(books);
  } catch (e) {
    next(e);
  }
});

books.put("/:id", async (req, res, next) => {
  try {
    await Book.update<Book>(req.body, {where: {id: req.params.id}});
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});
