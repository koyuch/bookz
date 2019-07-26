import {Transaction} from "sequelize";
import {sequelize} from "../app";

function runWithoutChecks(callback: any) {
  sequelize.query("SET FOREIGN_KEY_CHECKS = 0")
    .then(() => {
      return callback();
    })
    .then(() => {
      return sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    });
}

export default async function truncate() {
  return Promise.all(
    Object.values(sequelize.models).map(model => {
      return model.truncate({cascade: true});
    })
  );
}
