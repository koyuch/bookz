import {Router} from "express";
import {NotFoundException} from "../apiExceptions";
import {BookDTO} from "../DTO/BookDTO";
import {BookQueryDTO} from "../DTO/BookQueryDTO";
import {Book} from "../models/Book";
import {BookResource} from "../resources/BookResource";
import BookSchema from "../schemas/book.json";
import BookQuerySchema from "../schemas/bookQuery.json";
import validate from "../validator";

export const books = Router();

const bRes = new BookResource();

books.post("/", validate({body: BookSchema}), async (req, res, next) => {
  try {
    const book = await bRes.create(req.body as BookDTO);
    res.status(201).json(book);
  } catch (e) {
    next(e);
  }
});

books.get("/:id(\\d+)", async (req, res, next) => {
  try {
    const book = await bRes.read(req.params.id);
    if (book) {
      res.json(book);
    } else {
      throw new NotFoundException(Book.name, req.params.id);
    }
  } catch (e) {
    next(e);
  }
});

books.get("", validate({query: BookQuerySchema}), async (req, res, next) => {
  try {
    res.json(await bRes.search(req.query as BookQueryDTO));
  } catch (e) {
    next(e);
  }
});

books.put("/:id(\\d+)", validate({body: BookSchema}), async (req, res, next) => {
  try {
    const bookInput = req.body as BookDTO;
    bookInput.id = req.params.id;

    res.json(await bRes.update(bookInput));
  } catch (e) {
    next(e);
  }
});

books.delete("/:id(\\d+)", async (req, res, next) => {
  try {
    const count = await bRes.delete(req.params.id);
    if (count === 1) {
      res.sendStatus(204);
    } else if (count > 1) {
      throw new Error("Too many rows in Book deleted - id: " + req.params.id + " count: " + count);
    } else {
      throw new NotFoundException(Book.name, req.params.id);
    }
  } catch (e) {
    next(e);
  }
});
