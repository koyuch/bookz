import {BelongsToMany, Column, Model, Scopes, Table} from "sequelize-typescript";
import {Book} from "./Book";
import {BookAuthor} from "./BookAuthor";

@Scopes(() => ({
  full: {
    include: [{
      model: Book,
      through: {attributes: []},
    }],
  }
}))
@Table({
  timestamps: true,
  tableName: "author"
})
export class Author extends Model<Author> {

  @Column
  public firstName: string;

  @Column
  public lastName: string;

  @BelongsToMany(() => Book, () => BookAuthor)
  public books?: Array<Book & {BookAuthor: BookAuthor}>;
}
