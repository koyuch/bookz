import bodyParser = require("body-parser");
import dotenv from "dotenv";
import express from "express";
import bearerToken from "express-bearer-token";
import {Sequelize} from "sequelize-typescript";
import {AuthorizationException} from "./apiExceptions";
import {authors} from "./controllers/authors";
import {books} from "./controllers/books";
import errorHandler from "./errorHandler";

let options = {};
if (process.env.NODE_ENV) {
  options = { path: ".env." + process.env.NODE_ENV};
}
dotenv.config(options);

const app = express();

// middleware for json body parsing
app.use(bodyParser.json({limit: "5mb"}));

app.use(bodyParser.urlencoded({extended: true}));

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOSTNAME,
  dialect: "mysql",
  modelPaths: [__dirname + "/models"],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// sequelize.sync();

app.use(bearerToken(), (req, res, next) => {
  if (!req.token || req.token !== process.env.BEARER_TOKEN) {
    throw new AuthorizationException();
  }
  next();
});

app.use("/books", books);
app.use("/authors", authors);

// "custom" Error handler for all errors
app.use(errorHandler);

export default app;
