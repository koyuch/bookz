import {Column, ForeignKey, Model, Table} from "sequelize-typescript";
import {Author} from "./Author";
import {Book} from "./Book";

@Table({
  timestamps: false,
  tableName: "book_author"
})
export class BookAuthor extends Model<BookAuthor> {

  @ForeignKey(() => Book)
  @Column
  public bookId!: number;

  @ForeignKey(() => Author)
  @Column
  public authorId!: number;
}
