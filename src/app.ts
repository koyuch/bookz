import dotenv from "dotenv";
import express from "express";
import {Sequelize} from "sequelize-typescript";
// import {configure} from "sequelize-pg-utilities";
import {authors} from "./routes/authors";
import {books} from "./routes/books";

// initialize configuration
dotenv.config();
// const config = require("../config/config.json");
// const {  } = configure(config)

const port = process.env.SERVER_PORT;

const app = express();
const sequelize = new Sequelize(process.env.DB_URI, {
  modelPaths: [__dirname + "/models"],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    // tslint:disable-next-line:no-console
    console.log("Connection has been established successfully.");
  })
  .catch((err: string) => {
    // tslint:disable-next-line:no-console
    console.error("Unable to connect to the database:", err);
  });

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/books", books);
app.use("/authors", authors);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
