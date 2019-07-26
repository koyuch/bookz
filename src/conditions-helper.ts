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

  public addAllConditions(): any {
    if (this.dict) {
      return this.where = Object.entries(this.dict).flatMap(([key, value]) => {
        return (typeof value === "string") ? {[key]: {[Op.substring]: value}} : [];
      });
    }
  }

  public getConditions(): any {
    if (Object.keys(this.where).length > 1) {
      return {
        [Op.or]: this.where
      };
    } else {
      return this.where;
    }
  }
}
