import {BelongsToMany, Column, DataType, Model, Scopes, Table} from "sequelize-typescript";
import {Author} from "./Author";
import {BookAuthor} from "./BookAuthor";

@Scopes(() => ({
  full: {
    include: [{
      model: Author,
      through: {attributes: []},
    }],
  }
}))
@Table({
  timestamps: true,
  tableName: "book"
})
export class Book extends Model<Book> {

  @Column
  public title: string;

  @Column(DataType.TEXT)
  public description: string;

  @BelongsToMany(() => Author, () => BookAuthor)
  public authors?: Array<Author & {BookAuthor: BookAuthor}>;
}
