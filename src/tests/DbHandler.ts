import {execSync} from "child_process";

export default class DbHandler {

  public recreateDb() {
    return execSync(`npx sequelize db:create && npx sequelize db:migrate && npx sequelize db:seed:all`);
  }

  public dropDb() {
    return execSync(`npx sequelize db:drop`);
  }
}
