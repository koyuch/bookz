import {Op} from "sequelize";

export class Conditions {
  private where: any = {};

  constructor(readonly dict: any) {}

  public addCondition(key: string): void {
    if (this.dict && this.dict[key]) {
      this.where[key] = {
        [Op.substring]: this.dict[key]
      };
    }
  }

  public getConditions(): any {
    if (Object.keys(this.where).length > 1) {
      return {
        [Op.and]: this.where
      }
    } else {
      return this.where;
    }
  }
}
