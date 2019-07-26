import {Router} from "express";
import {NotFoundException} from "../apiExceptions";
import {AuthorDTO} from "../DTO/AuthorDTO";
import {Author} from "../models/Author";
import {AuthorResource} from "../resources/AuthorResource";
import AuthorSchema from "../schemas/author.json";
import AuthorQuerySchema from "../schemas/authorQuery.json";
import ScopeQuerySchema from "../schemas/scopeQuery.json";
import validate from "../validator";

export const authors = Router();
const aRes = new AuthorResource();

authors.post("/", validate({body: AuthorSchema}), async (req, res, next) => {
  try {
    const author = await aRes.create(req.body);
    res.status(201).json(author);
  } catch (e) {
    next(e);
  }
});

authors.get("/:id(\\d+)", validate({query: ScopeQuerySchema}), async (req, res, next) => {
  try {
    const author = await aRes.read(req.params.id, req.query.scope);
    if (author) {
      res.json(author);
    } else {
      throw new NotFoundException(Author.name, req.params.id);
    }
  } catch (e) {
    next(e);
  }
});

authors.get("", validate({query: AuthorQuerySchema}), async (req, res, next) => {
  try {
    res.json(await aRes.search(req.query));
  } catch (e) {
    next(e);
  }
});

authors.put("/:id(\\d+)", validate({body: AuthorSchema, query: ScopeQuerySchema}), async (req, res, next) => {
  try {
    const authorInput: AuthorDTO = req.body;
    authorInput.id = req.params.id;
    await aRes.update(authorInput);
    res.json(await aRes.read(authorInput.id, req.query.scope));
  } catch (e) {
    next(e);
  }
});

authors.delete("/:id(\\d+)", async (req, res, next) => {
  try {
    const count = await aRes.delete(req.params.id);
    if (count < 1) {
      throw new NotFoundException(Author.name, req.params.id);
    }
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});
