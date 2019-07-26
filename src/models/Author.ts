import {AllowNull, BelongsToMany, Column, Length, Model, Scopes, Table} from "sequelize-typescript";
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
  timestamps: false,
  tableName: "author"
})
export class Author extends Model<Author> {

  @Column
  public firstName: string;

  @AllowNull(false)
  @Length({min: 1, max: 255})
  @Column
  public lastName!: string;

  @BelongsToMany(() => Book, () => BookAuthor)
  public books?: Array<Book & {BookAuthor: BookAuthor}>;
}
