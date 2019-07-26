import {Conditions} from "../conditions-helper";
import {AuthorDTO} from "../DTO/AuthorDTO";
import {Author} from "../models/Author";

export class AuthorResource {
  public async create(author: AuthorDTO): Promise<Author> {
    return Author.create(author);
  }

  public async read(id: number, scope: string): Promise<Author> {
    return Author.scope(scope).findByPk(id);
  }

  public async search(authorQuery: AuthorDTO): Promise<Author[]> {
    const conditions = new Conditions(authorQuery);
    conditions.addAllConditions();

    return Author.scope("full").findAll({
      where: conditions.getConditions()
    });
  }

  public async update(author: AuthorDTO): Promise<[number, Author[]]> {
    return Author.update(author, {where: {id: author.id}});
  }

  public async delete(id: number): Promise<number> {
    return Author.destroy({where: {id}, cascade: true});
  }
}
