import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  Length,
  Model,
  Scopes,
  Table, Unique
} from "sequelize-typescript";
import {Author} from "./Author";
import {BookAuthor} from "./BookAuthor";

@DefaultScope(() => ({
  include: [{
    model: Author,
    through: {attributes: []},
  }]
}))
@Table({
  timestamps: false,
  tableName: "book"
})
export class Book extends Model<Book> {

  @AllowNull(false)
  @Length({min: 1, max: 255})
  @Unique
  @Column
  public title!: string;

  @Column(DataType.TEXT)
  public description: string;

  @BelongsToMany(() => Author, () => BookAuthor)
  public authors?: Array<Author & {BookAuthor: BookAuthor}>;
}
