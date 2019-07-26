import app from "./app";
import {sequelize} from "./app";

const port = process.env.SERVER_PORT || 3000;

(async () => {
  await sequelize
    .authenticate()
    .then(() => {
      // tslint:disable-next-line:no-console
      console.log("Connection to db has been established successfully.");
    })
    .catch((err: string) => {
      console.error("Unable to connect to the database:", err);
    });

  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(
      "App is running at http://localhost:%d in %s mode",
      port,
      app.get("env")
    );
  });
})();
