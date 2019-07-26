import {NotFoundException} from "../apiExceptions";
import {sequelize} from "../app";
import {Conditions} from "../conditions-helper";
import {AuthorDTO} from "../DTO/AuthorDTO";
import {BookDTO} from "../DTO/BookDTO";
import {BookQueryDTO} from "../DTO/BookQueryDTO";
import {Author} from "../models/Author";
import {Book} from "../models/Book";

export class BookResource {
  public async read(bookId: number): Promise<Book> {
    return Book.findByPk(bookId);
  }

  public async search(query: BookQueryDTO): Promise<Book[]> {
    const conditions = new Conditions(query);
    conditions.addAllConditions();
    const conds = conditions.getConditions();

    if (query.author) {
      const conditionsAuthor = new Conditions(query.author);
      let options;
      const authors = await Author.scope("full").findAll(options = {
        where: conditionsAuthor.getConditions()
      });
      const books = authors.flatMap(author => author.books);

      if (conds) {
        const booksOther = await Book.findAll({
          where: conds
        });
        // concatenate arrays and unique them
        return [...new Map(booksOther.concat(books).map((book: Book) => {
          return [book.id, book];
        })).values()];
      } else {
        return [...new Set(books)];
      }
    }

    return Book.findAll({
      where: conds
    });
  }

  public async create(bookData: BookDTO): Promise<Book> {
    if (bookData.authors) {
      const authorsData = bookData.authors;
      const authorsExisting = await Author.findAll({where: {id: authorsData.map(author => author.id)}});

      const bookCreated = await sequelize.transaction(async transaction => {
        const book = await Book.create(bookData, {transaction});
        await Promise.all(
          authorsData.flatMap( authorData => {
            const author = authorsExisting.find(authorLoc => authorLoc.id === authorData.id);
            if (author) {
              // if exists, update author
              return [
                author.update(authorData, {transaction}),
                book.$add("authors", author, {transaction})
              ];
            } else {
              return book.$create("author", authorData, {transaction});
            }
          })
        );
        return book;
      });
      return bookCreated.reload({include: [Author]});
    } else {
      return Book.create(bookData);
    }
  }

  public async update(bookData: BookDTO): Promise<Book> {
    const authorsData = bookData.authors;
    const bookId = bookData.id;

    const book = await Book.findByPk(bookId, {include: [Author]});
    if (!book) {
      throw new NotFoundException(Book.name, bookId);
    }
    if (! authorsData) {
      return book.update(bookData);
    }
    const {authors} = book;
    const existingAuthors = await Author.findAll({where: {id: authorsData.map(author => author.id)}});
    await sequelize.transaction(async transaction => {
      await Promise.all([
        ...authorsData.flatMap((authorData: AuthorDTO) => {
          const author = authors.find(authorLoc => authorLoc.id === authorData.id);
          if (author) {
            // if exists, update author
            return author.update(authorData, {transaction});
          } else {
            const authorEx = existingAuthors.find(authorLoc => authorLoc.id === authorData.id);
            if (authorEx) {
              // if author exists, but it's not binded to current book
              return [
                authorEx.update(authorData, {transaction}),
                book.$add("authors", authorEx, {transaction})
              ];
            } else {
              // if not create new author and associate to book
              return book.$create("author", authorData, {transaction});
            }
          }
        }),
        ...authors.map(author => {
          if (! authorsData.find(authorLoc => authorLoc.id === author.id)) {
            // if there are additional authors not in update request
            return book.$remove("authors", author, {transaction});
          }
        })
      ]);

      // finally update customer
      await book.update(bookData, {transaction});
    });

    return book;
  }

  public async delete(bookId: number): Promise<number> {
    return Book.destroy({where: {id: bookId}, cascade: true});
  }
}
